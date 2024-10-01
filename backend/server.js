// backend/server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
// const connectDB = require('./config/db'); // Supprimé car nous n'utilisons plus MongoDB

dotenv.config();

// connectDB(); // Supprimé car nous n'utilisons plus MongoDB

const app = express();

// Middleware CORS
app.use(cors({
    origin: 'http://localhost:8080', // URL du frontend Vue.js
    credentials: true
}));

// Middleware pour parser les corps de requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const userRoutes = require('./app/routes/userRoutes');
app.use('/api/users', userRoutes);

// Route par défaut
app.get('/', (req, res) => {
    res.send('API Backend avec CSV');
});

// Gérer les routes non définies
app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur le port ${PORT}`);
});
