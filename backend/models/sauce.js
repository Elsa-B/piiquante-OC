//Imort de mongoose
const mongoose = require('mongoose');
//Schéma de données pour indiquer le type et le caractère
const sauceSchema = mongoose.Schema({
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: [{type: String}],
  usersDisliked: [{type: String}],
});
//Export de mongoose, le rendant disponible pour l'application express
module.exports = mongoose.model('Sauce', sauceSchema);