// Variables globales
const gridContainer = document.getElementById('grid');
const formsContainer = document.getElementById('forms-container');
const statusText = document.getElementById('game-status');
let grid = Array(8).fill().map(() => Array(8).fill(0));
let currentForm = null;

// Initialisation de la grille
function createGrid() {
    gridContainer.innerHTML = '';
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            if (cell === 1) cellElement.classList.add('filled');
            cellElement.dataset.x = x;
            cellElement.dataset.y = y;
            gridContainer.appendChild(cellElement);
        });
    });
}

// Afficher les formes disponibles
async function loadForms() {
    const response = await fetch('formes.json');
    const forms = await response.json();
    displayForms(forms);
}

function displayForms(forms) {
    formsContainer.innerHTML = '';
    forms.forEach((form, index) => {
        const formElement = document.createElement('div');
        formElement.classList.add('shape');
        form.pattern.forEach(row => {
            row.forEach(block => {
                const blockElement = document.createElement('div');
                blockElement.classList.add('block');
                if (block === 0) blockElement.style.backgroundColor = 'transparent';
                formElement.appendChild(blockElement);
            });
        });
        formElement.addEventListener('click', () => selectForm(form, index));
        formsContainer.appendChild(formElement);
    });
}

// Gestion des formes sélectionnées
function selectForm(form, index) {
    currentForm = form;
    statusText.textContent = `Forme sélectionnée : ${form.name}`;
    sendToIA(grid, form).then(position => {
        if (!position) {
            alert('Aucune position possible ! Vous avez perdu.');
            return;
        }
        placeFormOnGrid(position.x, position.y, form);
        updateGrid();
    });
}

// Placer une forme sur la grille
function placeFormOnGrid(x, y, form) {
    form.pattern.forEach((row, i) => {
        row.forEach((block, j) => {
            if (block === 1) {
                grid[y + i][x + j] = 1;
            }
        });
    });
    createGrid();
}

// Supprimer les lignes et colonnes pleines
function updateGrid() {
    let rowsToClear = [];
    let colsToClear = [];

    // Vérifier les lignes pleines
    grid.forEach((row, y) => {
        if (row.every(cell => cell === 1)) rowsToClear.push(y);
    });

    // Vérifier les colonnes pleines
    for (let x = 0; x < 8; x++) {
        if (grid.every(row => row[x] === 1)) colsToClear.push(x);
    }

    // Supprimer les lignes et colonnes pleines
    rowsToClear.forEach(y => {
        grid[y] = Array(8).fill(0);
    });
    colsToClear.forEach(x => {
        grid.forEach(row => row[x] = 0);
    });

    // Recréer la grille
    createGrid();
}

// Appeler l'IA
async function sendToIA(grid, form) {
    const response = await fetch('ia.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid, form })
    });
    const data = await response.json();
    return data.position;
}

// Initialisation
document.getElementById('reset-grid').addEventListener('click', () => {
    grid = Array(8).fill().map(() => Array(8).fill(0));
    createGrid();
    statusText.textContent = 'Grille réinitialisée';
});

createGrid();
loadForms();
