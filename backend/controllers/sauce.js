const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');
//Création d'une sauce
/*exports.createSauce = (req, res, next) => {
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
};*/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

/*exports.modifySauce = (req, res, next) => {
  //Création d'un objet qui vérifie si le fichier existe ou pas
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
   //Mise à jour de la sauce
   Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
   .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
   .catch(error => res.status(400).json({ error }));
   console.log(sauce);
};*/
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

/*exports.deleteSauce = (req, res, next) => {
  //On recherche la sauce unique ayant le même Id
  Sauce.findOne({_id: req.params.id})
    .then(sauce=>{
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () =>{
        //Suppression d'une sauce
        Sauce.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch(error => res.status(400).json({error}));
      });
    });  
};*/
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
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