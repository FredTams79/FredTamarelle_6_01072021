const Sauce = require("../models/Sauce");
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

exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;

  Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (like == 1) {
        //l'utilisateur aime la sauce.
        sauce.usersLiked.push(userId);
        sauce.likes += like;
        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { like: 1 }, //$inc = Incrémenter un champ numérique existant ici +1
            $push: { usersLiked: userId }, //$push = Mettre à jour le tableau usersLiked
          }
        )
          .then(() => {
            res.status(200).json({
              message: "Merci de votre avis et d'avoir aimé cette sauce !",
            });
          })
          .catch((error) => {
            res.status(400).json({ error: error });
          });
      } else if (like == 0) {
        //l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
        Sauce.updateOne({ _id: sauceId })
          .then((sauce) => {
            //l'utilisateur annule la sauce qu'il aime
            // on cherche si l'utilisateur est déjà dans le tableau usersLiked
            if (sauce.usersLiked.find((user) => user === userId)) {
              Sauce.updateOne(
                { _id: sauceId },
                {
                  $inc: { like: -1 }, // on décrémente la valeur des likes avec un -1
                  $pull: { usersLiked: userId }, // on retire l'utilisateur du tableau
                }
              )
                .then(() => {
                  res
                    .status(200)
                    .json({ message: "Votre avis j'aime a été annulé !" });
                })
                .catch((error) => {
                  res.status(400).json({ error: error });
                });
            }
            //l'utilisateur annule la sauce qu'il n'aime pas
            // on cherche si l'utilisateur est déjà dans le tableau usersDisliked
            if (sauce.usersDisliked.find((user) => user === userId)) {
              Sauce.updateOne(
                { _id: sauceId },
                {
                  $inc: { dislike: -1 },
                  $pull: { usersDisliked: userId },
                }
              )
                .then(() => {
                  res.status(200).json({
                    message: "Votre avis je n'aime pas a été annulé !",
                  });
                })
                .catch((error) => {
                  res.status(400).json({ error: error });
                });
            }
          })
          .catch((error) => res.status(400).json({ error: error }));
      } else if (like == -1) {
        //l'utilisateur n'aime pas la sauce.
        sauce.usersDisliked.push(userId);
        sauce.dislikes += like;
        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { dislike: 1 },
            $push: { usersDisliked: userId },
          }
        )
          .then(() => {
            res.status(200).json({
              message:
                "Désolé que vous n'aimiez pas cette sauce, votre avis a été pris en compte !",
            });
          })
          .catch((error) => {
            res.status(400).json({ error: error });
          });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

/*
L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié,
en gardant une trace de ses préférences et en l'empêchant
d'aimer ou de ne pas aimer la même sauce plusieurs fois.
Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
*/
