
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Permet au serveur de lire les données JSON envoyées par le client
app.use(express.json());

// Modèle Item : structure des éléments enregistrés dans MongoDB
const Item = mongoose.model(
    'Item',
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ''
        }
    })
);

// GET : vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'Serveur fonctionne'
    });
});

// GET : récupérer tous les éléments depuis MongoDB
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
});

// POST : ajouter un élément dans MongoDB
app.post('/api/items', async (req, res) => {
    try {
        const { name, description } = req.body;

        // Vérifier que le nom est fourni et valide
        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({
                message: 'Le nom est obligatoire'
            });
        }

        // Vérifier la description si elle est fournie
        if (
            description !== undefined &&
            typeof description !== 'string'
        ) {
            return res.status(400).json({
                message: 'La description doit être un texte'
            });
        }

        // Créer et enregistrer l'élément
        const item = await Item.create({
            name: name.trim(),
            description: description || ''
        });

        res.status(201).json(item);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: 'Erreur serveur'
        });
    }
});

// Connexion à MongoDB Atlas avant le démarrage du serveur
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connexion à MongoDB réussie');

        app.listen(PORT, () => {
            console.log(`Serveur lancé sur ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erreur de connexion MongoDB :', err.message);
        process.exit(1);
    });
