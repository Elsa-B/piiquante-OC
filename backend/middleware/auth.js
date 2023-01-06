const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
      //On extrait le token du header "authorization", et on utilise split pour tout récupérer
       const token = req.headers.authorization.split(' ')[1];
       //Utilisation de verify pour décoder le token
       const decodedToken = jwt.verify(token, process.env.SECRET_DB);
       const userId = decodedToken.userId;
        req.auth = {userId}
         next();
   }catch(error) {
      res.status(401).json({ error : new Error('Requête invalide')});

   }
};