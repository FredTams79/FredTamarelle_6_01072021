const multer = require("multer"); //Package qui permet de gérer les fichiers entrants dans les requêtes HTTP

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//on définit le dossier de destination, et on renomme le fichier
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //Paramètre la destination d'enregistrement des fichier
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    //Paramètre la méthode de nom des fichiers
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
