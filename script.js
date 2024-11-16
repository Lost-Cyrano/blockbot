// Variables globales
const gridContainer = document.getElementById('grid');
const formsContainer = document.getElementById('forms-container');
const statusText = document.getElementById('game-status');
let grid = Array(8).fill().map(() => Array(8).fill(0));
let editMode = false;

// Initialisation de la grille
function createGrid() {
    gridContainer.innerHTML = '';
    grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            if (cell === 1) cellElement.classList.add('filled');
            cellElement.addEventListener('click', () => toggleCell(x, y));
            gridContainer.appendChild(cellElement);
        });
    });
}

function toggleCell(x, y) {
    if (!editMode) return;
    grid[y][x] = grid[y][x] === 0 ? 1 : 0;
    createGrid();
}

// Chargement des formes
async function loadForms() {
    const response = await fetch('formes.json');
    const forms = await response.json();
    displayForms(forms);
}

function displayForms(forms) {
    formsContainer.innerHTML = '';
    forms.forEach(form => {
        const shapeElement = document.createElement('div');
        shapeElement.classList.add('shape');
        form.pattern.forEach(row => {
            row.forEach(block => {
                const blockElement = document.createElement('div');
                blockElement.classList.add('block');
                if (block === 0) blockElement.style.backgroundColor = 'transparent';
                shapeElement.appendChild(blockElement);
            });
        });
        formsContainer.appendChild(shapeElement);
    });
}

// Événements des boutons
document.getElementById('edit-mode').addEventListener('click', () => {
    editMode = !editMode;
    statusText.textContent = editMode ? 'Mode édition activé' : 'Mode édition désactivé';
});

document.getElementById('start-game').addEventListener('click', () => {
    editMode = false;
    statusText.textContent = 'Partie commencée';
    // Logique future pour l'IA à ajouter ici.
});

document.getElementById('reset-grid').addEventListener('click', () => {
    grid = Array(8).fill().map(() => Array(8).fill(0));
    createGrid();
    statusText.textContent = 'Grille réinitialisée';
});

// Initialisation
createGrid();
loadForms();
