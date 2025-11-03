const Book = require('../models/Book');
const fs = require('fs');
const sharp = require("sharp");

// saving new file in format webp in images/
const createBookRef = async (req) => {
    const { buffer, originalname } = req.file;
    const ref = `${originalname}-${Date.now()}.webp`;
    await sharp(buffer).webp({ quality: 20 }).toFile("./images/" + ref);
    return ref;
};
// create new book object
const createBookObject = async (req) => {
    const ref = await createBookRef(req);
    const BookObject = JSON.parse(req.body.book);
    return {
        userId: req.auth.userId,
        title: BookObject.title,
        author: BookObject.author,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${ref}`,
        year: BookObject.year,
        genre: BookObject.genre,
        ratings:[],
        averageRating: 0
    };
};
// update book object
const updateBookObject = async (req) => {
    const BookObject = (req.file)? JSON.parse(req.body.book) : req.body;
    let imageUrl = BookObject.imageUrl ;
    if (req.file) {
        const ref = await createBookRef(req);
        imageUrl = `${req.protocol}://${req.get('host')}/images/${ref}`;
        // BookObject.imageUrl is undefined here
    }
    return {
        userId: req.auth.userId,
        title: BookObject.title,
        author: BookObject.author,
        imageUrl: imageUrl,
        year: BookObject.year,
        genre: BookObject.genre,
        ratings: BookObject.ratings,
        averageRating: BookObject.averageRating
    };
};

exports.createBook = async (req, res, next) => {
    const bookObject = await createBookObject(req);
    const book = new Book(bookObject);
    book.save()
    .then(()=>{ console.log('save: book '+bookObject.title+' saved');
                res.status(201).json({message: 'object saved'});})
    .catch(error=>{ console.log('save: error 400 '+error);
                    res.status(400).json({error});
    });
};

exports.updateBook = async (req, res, next) => {
    const book = await Book.findOne({_id: req.params.id})
    if (!book) {
        console.log('updateBook error 400 :could not find book');
        res.status(400).json({message:'could not find book'});
    } else {
        if (book.userId != req.auth.userId){console.log('updateBook error 403 : update non authorized');
                                            res.status(403).json({message: 'unauthorized request'});}
        else {
            const bookObject = await updateBookObject(req); 

            // removing old file in images/
            const filename = book.imageUrl? book.imageUrl.split('/images/')[1]: '';
            fs.unlink(`images/${filename}`, err =>{
                if (err) console.log('Error unlink file:'+filename, err);
                else console.log(`file images/${filename} deleted`);
            })

            Book.updateOne( {_id: req.params.id},{...bookObject, _id: req.params.id},
                            { runValidators: true })
            .then(()=>{console.log('updateBook : 200');
                       res.status(200).json({message: 'object updated'});})
            .catch(error=>{ console.log('updateBook error 401 : update failed '+error);
                            res.status(401).json({error});});
        }
    }
};

exports.getBooks = (req, res, next) => {
    Book.find()
    .then(books=>{ console.log('getBooks : found '+books.length+' books');
                   res.status(200).json(books);})
    .catch(error=>{ console.log('getBooks :error 404 '+error);
                    res.status(404).json({error});});
};

exports.getBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book=>{ console.log('getBook : book found'); 
                  res.status(200).json(book);})
    .catch(error=>{ console.log('getBook :error 404 '+error);
                    res.status(404).json({error});});
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
    .then(book=>{if (book.userId != req.auth.userId) {
                    console.log('deleteBook :error 401 '+error);
                    res.status(401).json({Message:'delete non authorized'});
                 } else {
                    const filename = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) {console.log('deleteBook unlink:error 500 '+err);
                                  res.status(500).json({err});}
                        else {Book.deleteOne({_id: req.params.id})
                              .then(()=>{console.log('deleteBook: 200');
                                        res.status(200).json({message: 'object deleted'});})
                              .catch(error=>{console.log('deleteBook deleteOne:error 500 '+error);
                                            res.status(500).json({error});})}                             
                    });
                  }
    })
    .catch(error=>{ console.log('deleteBook findOne:error 500 '+error);
                    res.status(500).json({error});});
};

exports.ratingBook = (req, res, next) => {
    if (req.body.userId != req.auth.userId) {
        console.log('ratingBook error 403 rating non authorized');
        return res.status(403).json({message: 'unauthorized request'});
    } 
    Book.findOne({_id: req.params.id})
    .then(book => {
        let ratings = book.ratings || [];
        let averageRating = 0;
        if (ratings.length == 0) {
            ratings.push({userId: req.auth.userId, grade: req.body.rating});
            averageRating = req.body.rating;
        } else {
            const found = ratings.find(elt => elt.userId===req.auth.userId);
            if (found) {
                console.log('ratingBook error 400: user already gave a rating');
                return res.status(400).json({message: 'user already gave a rating'});
            } 
            ratings.push({ userId: req.auth.userId, grade: req.body.rating });
            avgRatingDble = ratings.reduce((acc,elt)=>acc+elt.grade,0)/ratings.length;
            averageRating = Math.round(avgRatingDble);
        }
        book.averageRating = averageRating;
        book.ratings = ratings;
        Book.updateOne( {_id: req.params.id},{ratings: ratings , averageRating: averageRating},
                        { runValidators: true }) // validating Mongoose schema
        .then(() =>{console.log('ratingBook : 200');
                    res.status(200).json(book);})
        .catch(error=>{ console.log('ratingBook error 401 : update rating failed '+error);
                        res.status(401).json({error});});
    })
    .catch(error=>{ console.log('ratingBook findOne:error 500 '+error);
                    res.status(500).json({error});});
    
};