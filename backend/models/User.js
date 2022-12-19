//Import de mongoDB
const mongoose = require('mongoose');
//Import de mongoose-unique-validator
const uniqueValidator = require('mongoose-unique-validator');
//Schéma de données pour indiquer le type et le caractère
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);