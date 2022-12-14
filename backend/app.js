const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');//Import de helmet, pour protéger des vulnérabilités les plus courantes
const path = require('path');//Manipule les chemins de fichier
const expressMongoSanitize = require('express-mongo-sanitize');//Pour protéger des injections
require('dotenv').config();//Permet de placer dans un fichier les informations sensibles

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
//Appel de la méthode express, qui permet de créer l'application express
const app = express();

//Package Mongoose permettant la connexion à la base de donnée
mongoose.connect(process.env.USER_DB,
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

app.use(expressMongoSanitize());
app.use(helmet());
//Permet l'affichage des images suite à l'ajout d'helmet
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
//Export de la méthode express
module.exports = app;