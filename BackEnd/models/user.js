const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); //Plugin qui permet de s'assurer qu'aucun utilisateur peut avoir la même adresse mail

module.exports = mongoose.model("User", userSchema); //exportation su schéma en tant que modèle pour le rendre disponible sur l'application
