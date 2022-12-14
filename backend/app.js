//Commande pour importer express
const express = require('express');
//Commande d'import mongoose
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
//Commande d'import de user depuis le dossier routes
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://abwb:projet6oc@cluster0.wzvyrvy.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Appel de la méthode express, qui permet de créer l'application express
const app = express();
//Intercepte toutes les requêtes
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
//Export de la méthode express
module.exports = app;