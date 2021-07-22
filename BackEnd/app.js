///-----importer dependencies-----///
const express = require("express"); //importation d'express => Framework basé sur node.js
const bodyParser = require("body-parser"); //Permet d'extraire l'objet JSON des requêtes POST
const mongoose = require("mongoose"); // Plugin Mongoose pour se connecter à la data base Mongo Db

const path = require("path"); // Plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier.
const helmet = require("helmet"); // Plugin qui permet de protéger l'application de certaines vulnérabilités en configurant de manière appropriée des en-têtes HTTP.
//helmet = collection de 9 middleware : csp, hidePoweredBy, hsts, ieNoOpen, noCache, noSniff, frameguard, xssFilter
//csp = protection contre les attaques de type cross-site scripting et autres injections intersites
//frameguard = Protection contre les attaques de clickjacking.....
const dotenv = require("dotenv").config(); // Dotenv est un module sans dépendance qui charge des variables d'environnement à partir d'un fichier ".env"  dans "process.env".

//Pour un serveur API uniquement où le limiteur de débit doit être appliqué à toutes les requêtes :
const rateLimit = require("express-rate-limit"); // Middleware de base à limitation de débit pour Express. À utiliser pour limiter les demandes répétées aux API publiques et/ou aux points de terminaison tels que la réinitialisation de mot de passe.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // // limite chaque IP à 100 requêtes par windowMs
});

const saucesRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

///-----CONNEXION À LA BASE MONGODB-----///
// pensez à remplacer les noms de variables par vos données de MongoDB dans le fichier ".envExemple" et de le renommer ".env" ^^
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterft.72nk6.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`, //`mongodb+srv://BumbleBrice:bGe5eSp4twrEKTN@cluster0.bdqfu.mongodb.net/<dbname>?retryWrites=true&w=majority`,
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

app.use(helmet()); // L'application utilise toutes les protections helmet
app.use(limiter); // S'applique à toutes les demandes rateLimit
app.use(bodyParser.json()); // L'application utilise bodyparser

app.use("/images", express.static(path.join(__dirname, "images"))); //L'application utilise des images

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app; // exporter cette application pour déclaration dans server.js
