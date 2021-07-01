///-------créer un serveur Node-------///
const http = require("http");
const app = require("./app"); // importer notre application

///------gestion du port------///
const normalizePort = (val) => {
  //la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000"); //configure le serveur : soit la variable d'environnement du port grâce à process.env.PORT : si la plateforme de déploiement propose un port par défaut || soit le port 3000

//importer le package HTTP natif de Node et utiliser pour créer un serveur, en passant une fonction qui sera exécutée à chaque appel effectué vers ce serveur. Cette fonction reçoit les objets request et response en tant qu'arguments
app.set("port", port);

///----gestion des erreurs-----///
const errorHandler = (error) => {
  //la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  //un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port); //configure le serveur pour qu'il écoute la variable d'environnement du port par défaut ou 3000
