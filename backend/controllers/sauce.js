const Sauce = require('../models/sauce');
const fs = require('fs');

//Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //suppression du champs id
  delete sauceObject._id;
  //Création d'un objet sauce
  const sauce = new Sauce({
    ...sauceObject,
    //Résolution de l'URL http de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //Sauvegarde de la sauce dans la base de donnée
  sauce.save()
  .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
  .catch((error) => res.status(400).json({ error: error }));
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  //Création d'un objet qui vérifie si le fichier existe ou pas
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),//On récupère l'objet en chaîne de caractère
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//URL de l'image que l'on récupère
   } : { ...req.body };
   //On recherche la sauce ayant le même id que la requête
   Sauce.findOne({_id: req.params.id})
   .then((sauce)=>{
    if(sauce.userId != req.auth.userId){//Si l'utilisateur n'a pas le même id que la sauce
      res.status(403).json({message : 'Requête non autorisée'})
    }else{//Sinon on met à jour la sauce
      Sauce.updateOne({_id : req.params.id}, {...sauceObject, _id:req.params.id})
      .then(()=> res.status(201).json ({message : 'Sauce modifiée'}))
      .catch(error=> res.status(400).json({error}));
    }
   })
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})//On recherche la sauce ayant le même id que la requête
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {//Si l'utilisateur n'est pas le bon
            res.status(403).json({message: 'Requête non autorisée'});
        } else {//Si c'est le bon, on récupère le nom de fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {//On supprime un fichier du système de fichier
                Sauce.deleteOne({_id: req.params.id})//On supprime la sauce
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
          }
    })
    .catch( error => { res.status(500).json({ error });
  });
};

exports.getOneSauce = (req, res, next) => {
  //On recherche la sauce unique ayant le même Id
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce) )
    .catch(error => res.status(404).json({ error }))
  };
  
exports.getAllSauce = (req, res, next) => {
  //On renvoie un tableau avec toutes les sauces
  Sauce.find()
  .then(sauces => res.status(200).json(sauces) )
  .catch(error => res.status(400).json({ error }))
};

exports.likeSauce = (req, res, next)=>{
  let like = req.body.like;
  //Si l'utilisateur aime la sauce
  if(like===1){
    Sauce.updateOne({ _id: req.params.id },
      { $inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id})
      .then(() => res.status(200).json({ message: 'Vous aimez la sauce !' }))
      .catch(error => res.status(400).json({error}));
  }else if(like===-1){
    Sauce.updateOne({ _id: req.params.id },
      { $inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
      .then(() => res.status(200).json({ message: 'Vous n\'aimez pas la sauce !' }))
      .catch(error => res.status(400).json({error}));
  }else{
    Sauce.findOne({ _id: req.params.id })
    .then(sauce=>{
      if(sauce.usersLiked.includes(req.body.userId)){
        Sauce.updateOne({ _id: req.params.id },
          { $inc: {likes: -1}, $pull: {usersLiked: req.body.userId}, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Vous avez retiré votre like !' }))
          .catch(error => res.status(400).json({error}));
      }else if(sauce.usersDisliked.includes(req.body.userId)){
        Sauce.updateOne({ _id: req.params.id },
          { $inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Vous avez retiré votre dislike' }))
          .catch(error => res.status(400).json({error}));
      }
    })
  }
}