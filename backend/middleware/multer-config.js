const multer = require('multer');//Import de multer
//Objet avec les différents types d'images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
//Création d'un objet de configuration 
const storage = multer.diskStorage({//Enregistrement sur le disque
  destination: (req, file, callback) => {
    callback(null, 'images');//Pas d'erreur, nom du dossier
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');//On génère le nom du fichier.On supprime les espaces et instaure des underscores dans le nom de fichier
    const extension = MIME_TYPES[file.mimetype];//Création de l'extension de fichier 
    callback(null, name + Date.now() + '.' + extension);//On appel le callback avec le nom de fichier
  }
});
//On exporte multer avec l'objet storage et le fichier unique
module.exports = multer({storage: storage}).single('image');