const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const { invalidText } = require('../utilities/validateText.js');

function invalidEmail(req, res) {
    if (!validator.isEmail(req.body.email)) {
        console.log('signup: error 422 :invalid email '+req.body.email);
        res.status(422).json({message: 'invalid email'});
        return true;
    }
    return false;
}
function invalidPassword(req, res) {
    if (invalidText(req.body.password)) {
        console.log('signup: error 422 :invalid password');
        res.status(422).json({message: 'invalid password'});
        return true;
    }
    return false;
}
exports.signup = (req, res, next) => {
    // verification de l'email
    if (invalidEmail(req, res)) return;
    // verification du mot de passe
    if (invalidPassword(req, res)) return;
    // hash du mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        // creation du user
        const user = new User({email: req.body.email, password: hash});
        user.save()
        .then(()=>{ console.log('signup: user '+req.body.email+' created'); 
                    res.status(201).json({message: 'user created'});})
        .catch(error=>{ console.log('signup: error 400='+error);
                        res.status(400).json({error});});
    })
    .catch(error=>{ console.log('signup: error 500='+error);
                    res.status(500).json({error});});
};

exports.login = (req, res, next) => {
    // verification de l'email
    if (invalidEmail(req, res)) return;
    // verification du mot de passe
    if (invalidPassword(req, res)) return;
    
    User.findOne({email: req.body.email})
    .then(user => { 
        if (!user){ console.log('login: nouser error 401='+error);
                    return res.status(401).json({message: 'pair login/password invalid'});}
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid){console.log('login: notvalid error 401='+error);
                        return res.status(401).json({message: 'pair login/password invalid'});}
            // la reponse HTTP contient userId et le token JWT
            console.log('login: 200');
            res.status(200).json({
                userId: user._id, 
                token: jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:'24h'})
            }); })
        .catch(error=>{ console.log('login: bcrypt error 500='+error);
                        res.status(500).json({error});});
    })
    .catch(error=>{ console.log('login: findOne error 500='+error);
                    res.status(500).json({error});});
};