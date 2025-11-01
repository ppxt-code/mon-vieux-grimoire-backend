const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const BookObject = JSON.parse(req.body.book);
    const book = new Book({
        userId: req.auth.userId,
        title: BookObject.title,
        author: BookObject.author,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        year: BookObject.year,
        genre: BookObject.genre,
        ratings:[],
        averageRating: 0
    });
    book.save()
    .then(()=>{ console.log('save: book '+BookObject.title+' saved');
                res.status(201).json({message: 'object saved'});})
    .catch(error=>{ console.log('save: error 400 '+error);
                    res.status(400).json({error});
    });
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
                    fs.unlink(`images/${filename}`,
                        ()=>{Book.deleteOne({_id: req.params.id})
                             .then(()=>{console.log('deleteBook: 200');
                                        res.status(200).json({message: 'object deleted'});})
                             .catch(error=>{console.log('deleteBook unlink:error 500 '+error);
                                            res.status(500).json({error});})} );
                  }
                 })
    .catch(error=>{ console.log('findOne unlink:error 500 '+error);
                    res.status(500).json({error});});
};