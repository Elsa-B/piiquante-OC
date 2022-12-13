//Commande pour importer express
const express = require('express');
const mongoose = require('mongoose');
//Appel de la méthode express, qui permet de créer l'application express
const app = express();

mongoose.connect('mongodb+srv://abwb:projet6oc@cluster0.wzvyrvy.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//Gestion de la fonction middleware
app.use((req, res)=>{
    res.json({message: 'Voila la réponse de ma requête'});
});
//Export de la méthode express
module.exports = app;