//Commande pour importer express
const express = require('express');
//Appel de la méthode express, qui permet de créer l'application express
const app = express();
//Gestion de la fonction middleware
app.use((req, res)=>{
    res.json({message: 'Voila la réponse de ma requête'});
});
//Export de la méthode express
module.exports = app;