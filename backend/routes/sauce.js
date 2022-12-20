const express = require('express');//Import d'express
const router = express.Router();//Création de routeurs séparés
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');//Import des sauces dans le contrôleur

//Routes de chaque fichier
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth,multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;