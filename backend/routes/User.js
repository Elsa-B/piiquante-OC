//Commande d'importation d'express
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

//Routes pour envoyer vers une URL
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
//Export du router
module.exports = router;