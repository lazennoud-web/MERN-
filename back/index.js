
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Modèle
const Item = mongoose.model('Item', new mongoose.Schema({
    name: { type: String, required: true },
    description: String
}));

// GET : vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'Serveur fonctionne'
    });
});

// GET : afficher les éléments
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
});

// POST : ajouter un élément
app.post('/api/items', async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Nom obligatoire'
            });
        }

        const item = await Item.create({
            name: name.trim(),
            description
        });

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connexion MongoDB réussie');

        app.listen(PORT, () => {
            console.log(`Serveur lancé sur le port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erreur de connexion MongoDB :', err.message);
    });
