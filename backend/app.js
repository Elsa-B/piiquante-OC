//Commande pour importer express
const express = require('express');
//Commande d'import mongoose
const mongoose = require('mongoose');
const helmet = require('helmet');//Import de helmet, pour protéger des vulnérabilités les plus courantes
const path = require('path');

//Commande d'import des users et des sauces depuis le dossier routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
//Appel de la méthode express, qui permet de créer l'application express
const app = express();

//Package Mongoose permettant la connexion à la base de donnée
mongoose.connect('mongodb+srv://abwb:projet6oc@cluster0.wzvyrvy.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Intercepte toutes les requêtes
app.use(express.json())
//Ajout des headers pour communiquer entre les deux "localhost"
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
//Export de la méthode express
module.exports = app;