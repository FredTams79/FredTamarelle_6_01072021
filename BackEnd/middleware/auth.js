const jwt = require("jsonwebtoken"); //Importation de jsnwebtoken pour le système de token

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //Récupération du token provenant de la requête
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //Fonction pour décoder le token
    const userId = decodedToken.userId; //récupération du user ID
    if (req.body.userId && req.body.userId !== userId) {
      //Si user Id de la requête différent du userId du token
      throw "user ID non valable !";
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error("Requête non authentifiée !") });
  }
};
