const Sauce = require("../models/sauce");
const fs = require("fs"); // Package fs = file system qui permet de modifier ou supprimer des fichiers

///-----CRÉER UNE SAUCE-----///
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée" }))
    .catch((error) => res.status(400).json({ error }));
};

///-----MODIFIER UNE SAUCE-----///
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

///-----SUPPRIMER UNE SAUCE-----///
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

///-----RÉCUPÉRER UNE SAUCE-----///
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

///-----RÉCUPÉRER TOUTES LES SAUCES-----///
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

///-----GESTION DES LIKES ET DISLIKES-----///

exports.sauceLike = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (like == 1) {
        //l'utilisateur aime la sauce.
        sauce.usersLiked.push(userId);
        sauce.liked += like;
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { like: 1 }, $push: { usersLiked: req.body.userId } } //$inc = Incrémenter un champ numérique existant & $push = Mettre à jour un tableau (ajouter un nouvel élément)
        );
      } /* else if (like == 0) {          //l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
         if (sauce.usersLiked) {
          sauce.liked -= 1;
         }
         if (sauce.usersDisliked) {
          sauce.disliked -= 1;
         }
       } else if (like == -1) {         //l'utilisateur n'aime pas la sauce.
        sauce.usersDisliked;
        sauce.disliked += 1;
       }*/
    })
    .catch((error) => res.status(400).json({ error }));
};

/*
Définit le statut "j'aime" pour userID fourni.
Si j'aime = 1, l'utilisateur aime la sauce.
Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
Si j'aime = -1, l'utilisateur n'aime pas la sauce.

L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié,
en gardant une trace de ses préférences et en l'empêchant
d'aimer ou de ne pas aimer la même sauce plusieurs fois.
Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
*/
