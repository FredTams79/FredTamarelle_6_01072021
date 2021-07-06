const express = require("express"); //importation d' Express
const router = express.Router(); //Importation du router Express

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config"); //Importation de multer pour la gestion des images

const sauceCtrl = require("../controllers/sauce");

router.post("/", auth, multer, sauceCtrl.createSauce);

router.post("/:id/like", auth, multer, sauceCtrl.likeSauce); // en cours de création

router.put("/:id", auth, multer, sauceCtrl.modifySauce);

router.delete("/:id", auth, sauceCtrl.deleteSauce);

router.get("/:id", auth, sauceCtrl.getOneSauce);

router.get("/", auth, sauceCtrl.getAllSauces);

module.exports = router; // exporter cette application
