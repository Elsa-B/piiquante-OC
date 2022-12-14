//Commande pour importer express
const express = require('express');
//Commande d'import mongoose
const mongoose = require('mongoose');
//Commande d'import de user depuis le dossier routes
const userRoutes = require('./routes/user');
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
app.use('/api/auth', userRoutes)
//Export de la méthode express
module.exports = app;