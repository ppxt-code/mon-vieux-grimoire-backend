const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'a3f1e5b7c8d9e0123456789abcdef0123456789abcdef0123456789abcdef0123';

exports.signup = (req, res, next) => {
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
                token: jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn:'24h'})
            }); })
        .catch(error=>{ console.log('login: bcrypt error 500='+error);
                        res.status(500).json({error});});
    })
    .catch(error=>{ console.log('login: findOne error 500='+error);
                    res.status(500).json({error});});
};