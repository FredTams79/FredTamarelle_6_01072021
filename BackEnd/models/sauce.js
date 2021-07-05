const mongoose = require("mongoose");

///-----creation schema de donnees-----///

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, //identifiant unique pour l'user qui a créee la sauce
  name: { type: String, required: true }, //nom de la sauce
  manufacturer: { type: String, required: true }, //fabricant de la sauce
  description: { type: String, required: true }, //description de la sauce
  mainPepper: { type: String, required: true }, //principal ingredient de la sauce
  imageUrl: { type: String, required: true }, //string de l'image de la sauce de l'user
  heat: { type: Number, required: true }, //nombre entre 1 et 10 décrivant la sauce
  likes: { type: Number, required: false }, //nombre d'users qui aiment la sauce, required=false car ce n'est pas une valeur obligatoire a remplir c'est un plus que peut faire l'utilisateur
  dislikes: { type: Number, required: false }, //nombre d'users qui n'aiment pas la sauce
  usersLiked: { type: [String], required: false }, //tableau d'id d'users ayant aimé la sauce
  usersDisliked: { type: [String], required: false }, //tableau d'id d'users n'ayant pas aimé la sauce
});

module.exports = mongoose.model("Sauce", sauceSchema);
