const bcrypt = require("bcrypt"); //Plug in pour hasher les password
const jwt = require("jsonwebtoken"); //Plug in pour sécuriser la connection avec des tokens uniques

const User = require("../models/User");

///-----INSCRIPTION UTILISATEUR-----///
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) //Salage du mot de passe à 10 reprises
    .then((hash) => {
      //création de l'objet utilisateur
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      //sauvegarde de l'utilisateur
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

///-----CONNEXION UTILISATEUR-----///
exports.login = (req, res, next) => {
  //récupération de l'utilisateur
  User.findOne({ email: req.body.email })
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
