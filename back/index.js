
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Modèle
const Item = mongoose.model('Item', new mongoose.Schema({
    name: { type: String, required: true },
    description: String
}));

// GET : vérifier le serveur
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Serveur fonctionne' });
});

// GET : afficher les éléments
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// POST : ajouter un élément
app.post('/api/items', async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: 'Nom obligatoire' });
        }

        const item = await Item.create({
            name: name.trim(),
            description
        });

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Serveur lancé sur ${PORT}`);
        });
    })
    .catch(err => console.log(err.message));
