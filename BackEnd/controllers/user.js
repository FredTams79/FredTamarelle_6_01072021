const bcrypt = require("bcrypt"); //Plug in pour hasher les password
const jwt = require("jsonwebtoken"); //Plug in pour sécuriser la connection avec des tokens uniques
const passwordValidator = require("password-validator"); //Plug in qui permet de compléxifier un mot de passe

const User = require("../models/User");
const maskData = require("../node_modules/maskdata"); // Plug in pour masquer l'e-mail de l'utilisateur mais peut aussi masquer différents types de données

///-----VALIDATEUR DE MOT DE PASSE UTILISATEUR-----///
const schema = new passwordValidator(); //Le mot de passe doit contenir au minimum 6 caractères avec au moins 2 chiffres, 1 minuscule, 1 symbole et sans espace.
schema
  .is()
  .min(6) // Minimum 6 caractères
  .is()
  .max(20) // Maximum 20 caractères
  .has()
  .symbols() // Le mot de passe doit avoir au moins 1 symbole
  .has()
  .lowercase() // Le mot de passe doit avoir au moins 1 minuscule
  .has()
  .digits(2) // Le mot de passe doit avoir au moins 2 chiffres
  .has()
  .not()
  .spaces(); // Le mot de passe ne doit pas avoir d'espace

///-----MASQUER L'EMAIL UTILISATEUR-----///
const emailMask2Options = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 2, //Nombre de caractères masqués avant @ -> 2
  unmaskedEndCharactersAfterAt: 1, //Nombre de caractères masqués après @ -> 1
  maskAtTheRate: false,
};

///-----INSCRIPTION UTILISATEUR-----///
exports.signup = (req, res, next) => {
  //Test du format du mot de passe
  //Si mdp invalide
  if (!schema.validate(req.body.password)) {
    return res.status(400).json({
      error:
        "Entrer un mot de passe valide svp !\nil doit contenir au minimum 6 caractères dont 2 chiffres, 1 minuscule, 1 symbole et sans espace - merci !",
    });
    //Si mdp valide
  } else if (schema.validate(req.body.password)) {
    bcrypt
      .hash(req.body.password, 10) //Salage du mot de passe à 10 reprises
      .then((hash) => {
        //création de l'objet utilisateur
        const user = new User({
          email: maskData.maskEmail2(req.body.email, emailMask2Options),
          password: hash,
        });
        //sauvegarde de l'utilisateur
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

///-----CONNEXION UTILISATEUR-----///
exports.login = (req, res, next) => {
  //récupération de l'utilisateur
  User.findOne({
    email: maskData.maskEmail2(req.body.email, emailMask2Options),
  })
    .then((user) => {
      //si l'utilisateur n'existe pas
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      //comparaison des mots de passe
      bcrypt
        .compare(req.body.password, user.password) //compare le password soumis avec le password de la base de données
        .then((valid) => {
          //si invalide = mdp incorrect
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // si valide = on renvoie l'userId et le token
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h", //TOKEN généré de 24h
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
