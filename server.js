const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API pour les utilisateurs (exemple)
app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: "Jean Dupont", email: "jean.dupont@exemple.com", role: "admin" },
        { id: 2, name: "Marie Martin", email: "marie.martin@exemple.com", role: "user" }
    ];
    res.json(users);
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Accédez à l'application: http://localhost:${PORT}`);
});