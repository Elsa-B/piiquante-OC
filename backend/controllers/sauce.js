const Sauce = require('../models/sauce');
const fs = require('fs');

//Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = {...JSON.parse(req.body.sauce), userId: req.auth.userId};
  //suppression du champs id
  delete sauceObject._id;
  //Création d'un objet sauce
  const sauce = new Sauce({
    ...sauceObject,
    //Résolution de l'URL http de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0
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
    //On récupère l'objet en chaîne de caractère
    ...JSON.parse(req.body.sauce),
    //URL de l'image que l'on récupère
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
   //On recherche la sauce ayant le même id que la requête
   Sauce.findOne({_id: req.params.id})
   .then((sauce)=>{
    //Si l'utilisateur n'a pas le même id que la sauce
    if(sauce.userId != req.auth.userId){
      res.status(403).json({message : 'Requête non autorisée'})
    }else{//Sinon on met à jour la sauce
      Sauce.updateOne({_id : req.params.id}, {...sauceObject})
      .then(()=> res.status(201).json ({message : 'Sauce modifiée'}))
      .catch(error=> res.status(400).json({error}));
    }
   })
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  //On recherche la sauce ayant le même id que la requête
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {//Si l'utilisateur n'est pas le bon
            res.status(403).json({message: 'Requête non autorisée'});  
        } else {//Si c'est le bon, on récupère le nom de fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            //On supprime un fichier du système de fichier
            fs.unlink(`images/${filename}`, () => {
                //On supprime la sauce
                sauce.delete()
                    .then(() => { res.status(200).json({message: 'Sauce supprimée !'})})
                    .catch(error => res.status(500).json({ error }));
            });
          }
    })
    .catch( error => { 
      res.status(500).json({ error });
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
  Sauce.findOne({ _id: req.params.id })//On cherche l'objet ayant le même id
    .then(sauce=>{
      //Si l'utilisateur aime la sauce
      if(like===1){
        if(sauce.usersLiked.includes(req.auth.userId)){
          res.status(400).json({error: 'La sauce est déjà liké'})
        }else{
        Sauce.updateOne({ _id: req.params.id },//Mise à jour de la sauce
          //Ajout d'un like, envoie de l'information à la sauce
          { $inc: {likes: 1}, $push: {usersLiked: req.auth.userId}, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Vous aimez la sauce !' }))
          .catch(error => res.status(400).json({error}));
        }
      }else if(like===-1){//Si l'utilisateur n'aime pas
        if(sauce.usersDisliked.includes(req.auth.userId)){
          res.status(400).json({error: 'La sauce est déjà disliké'})
        }else{
          Sauce.updateOne({ _id: req.params.id },
          { $inc: {dislikes: 1}, $push: {usersDisliked: req.auth.userId}, _id: req.params.id})
          .then(() => res.status(200).json({ message: 'Vous n\'aimez pas la sauce !' }))
          .catch(error => res.status(400).json({error}));
        }
      }else{
        if(sauce.usersLiked.includes(req.auth.userId)){//Détermine si le tableau contient la valeur
          Sauce.updateOne({ _id: req.params.id },//Mise à jour de la sauce
          //Retire un like, suppression d'un élément de la sauce
            { $inc: {likes: -1}, $pull: {usersLiked: req.auth.userId}, _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Vous avez retiré votre like !' }))
            .catch(error => res.status(400).json({error}));
        }else if(sauce.usersDisliked.includes(req.auth.userId)){
          Sauce.updateOne({ _id: req.params.id },
            { $inc: {dislikes: -1}, $pull: {usersDisliked: req.auth.userId}, _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Vous avez retiré votre dislike' }))
            .catch(error => res.status(400).json({error}));
        }
      }
    })
}