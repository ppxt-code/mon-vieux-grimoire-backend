const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/User');
const bookRoutes = require('./routes/Book');

// pour JWT_SECRET :
require('dotenv').config();

const app = express();
// pour la base de données
mongoose.connect('mongodb+srv://ppxt:ppxtpassword@ppxt-code.04sxpwl.mongodb.net/?retryWrites=true&w=majority&appName=ppxt-code',
    { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// pour les requetes cross-origin
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// pour les requetes qui ont un content type json
app.use(express.json());

// pour mapper le repertoire images, modification des routes :
app.use('/images', express.static(path.join(__dirname,'images')));


app.use((req,res, next)=>{
    console.log(`requete recue : ${req.url}`);
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;