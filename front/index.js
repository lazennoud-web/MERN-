
const API_BASE_URL = window.APP_CONFIG.API_BASE_URL;

// Récupérer les éléments HTML
const form = document.getElementById('item-form');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const message = document.getElementById('message');
const itemsList = document.getElementById('items-list');
const refreshButton = document.getElementById('refresh-button');

// Afficher un message à l'utilisateur
function showMessage(text, isError = false) {
    message.textContent = text;
    message.style.color = isError ? 'red' : 'green';
}

// Récupérer et afficher les éléments depuis le backend
async function loadItems() {
    itemsList.textContent = 'Chargement des éléments...';

    try {
        const response = await fetch(`${API_BASE_URL}/api/items`);

        if (!response.ok) {
            throw new Error('Impossible de récupérer les éléments.');
        }

        const items = await response.json();

        itemsList.replaceChildren();

        if (items.length === 0) {
            itemsList.textContent = 'Aucun élément enregistré.';
            return;
        }

        items.forEach((item) => {
            const article = document.createElement('article');
            article.className = 'item';

            const title = document.createElement('h3');
            title.textContent = item.name;

            const description = document.createElement('p');
            description.textContent = item.description || 'Aucune description';

            article.append(title, description);
            itemsList.appendChild(article);
        });
    } catch (error) {
        itemsList.textContent = error.message;
    }
}

// Envoyer le formulaire au backend pour ajouter un élément
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!name) {
        showMessage('Le nom est obligatoire.', true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de l’ajout.');
        }

        showMessage('Élément ajouté avec succès.');
        form.reset();

        await loadItems();
    } catch (error) {
        showMessage(error.message, true);
    }
});

// Actualiser la liste quand on clique sur le bouton
refreshButton.addEventListener('click', loadItems);

// Charger la liste dès l'ouverture de la page
loadItems();
