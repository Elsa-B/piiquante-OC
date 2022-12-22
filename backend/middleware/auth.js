const jwt = require('jsonwebtoken');//Import de jsonwebtoken
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];//On extrait le token du header "authorization", et on utilise split pour tout récupérer
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//Utilisation de verify pour décoder le token
       const userId = decodedToken.userId;
       if (req.body.userId && req.body.userId !== userId) {
         throw 'UserId non valide';
       } else {
         next();
       }
   }catch(error) {
      res.status(401).json({ error : new error('Requête invalide')});
   }
};