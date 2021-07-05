///-----importer dependencies-----///
const express = require("express"); //importation d'express => Framework basé sur node.js
const bodyParser = require("body-parser"); //Permet d'extraire l'objet JSON des requêtes POST
const mongoose = require("mongoose"); // Plugin Mongoose pour se connecter à la data base Mongo Db

const path = require("path"); // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier.

const saucesRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

///-----CONNEXION À LA BASE MONGODB-----///
mongoose
  .connect(
    "mongodb+srv://FredTams:ElliotNina2433@clusterft.72nk6.mongodb.net/FTDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express(); // app = notre application et l'application utilise le framework express

///-----CORS-----///
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // accéder à l'API depuis toutes origines
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization" //Tous les headers de requêtes autorisés vers l'API
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS" //Toutes les méthodes de requêtes autorisées
  );
  next();
});

app.use(bodyParser.json()); // L'application utilise bodyparser

app.use("/images", express.static(path.join(__dirname, "images"))); //L'application utilise des images

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app; // exporter cette application pour déclaration dans server.js
