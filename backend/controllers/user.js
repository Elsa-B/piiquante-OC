const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
//Fonction pour une inscription utilisateur
exports.signup = (req, res, next)=>{
    //Appel de la fonction de hachage bcrypt. On passe le mot de pase du corps de la requête.
    //Demande de "salage" 10 fois (combien de fois on vérifie le mdp)
    bcrypt.hash(req.body.password, 10)
    //Récupération du hash du mdp
    .then(hash => {
        //Création du nouvel utilisateur avec email fourni dans le corps de la requête. Enregistrement du hash
        const user = new User({
            email : req.body.email,
            password : hash
        });
        //Enregistrement du user dans la base de données
        user.save()
            //Si enregistrement réussi, status 201(créé), sinon message d'erreur
            .then(() => res.status(201).json({message : 'Utilisateur créé'}))
            .catch(error => res.status(500).json({error}));
    })
    //Message d'erreur. Erreur 500 (erreur serveur)
    .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next)=>{
    User.findOne({email : req.body.email})
        .then(user=>{
            if(!user){
                return res.status(401).json({message : 'Identifiant ou mot de passe invalide'});
            }
            //Utilisation de compare pour comparer le mot de passe de l'user et le hash
            bcrypt.compare(req.body.password)
            .then(valid=>{
                //Si il est différent erreur 401
                if(!valid){
                    return res.status(401).json({message : 'Identifiant ou mot de passe invalide'});
                }
                //S'il est bon, réponse 200
                res.status(200).json({
                    userId : user._id,
                    //Utilisation de sign de jsonwebtoken pour chiffrer un token
                    token: jwt.sign(
                        {userId : user._id},
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn : '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};