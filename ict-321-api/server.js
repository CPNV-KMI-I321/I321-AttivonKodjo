// Charger les variables d'environnement
require("dotenv").config();

const app = require("./app");

// Port du serveur
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
