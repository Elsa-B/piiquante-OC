const mongoose = require('mongoose');
//Import de mongoose-unique-validator pour vérifier l'emil unique
const uniqueValidator = require('mongoose-unique-validator');
//Schéma de données pour indiquer le type et le caractère
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
//On applique le validateur au schéma avant de l'exporter
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);