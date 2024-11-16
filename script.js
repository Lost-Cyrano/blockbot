// Configuration initiale
const gridSize = 8; // Taille de la grille
const grid = Array(gridSize * gridSize).fill(0); // Grille sous forme de liste (0 = vide, 1 = pleine)

// Formes prédéfinies avec des offsets relatifs à la case de départ
const shapes = [
    [0, 1, 9, 10],       // Carré 2x2
    [0, 1, 2],           // Ligne horizontale 3 cases
    [0, 8, 16],          // Ligne verticale 3 cases
    [0, 1, 8],           // L inversé en bas à gauche
    [0, 8, 9, 10],       // Z inversé
    [0, 1, 2, 8, 9],     // T
];

// Initialisation de la grille dans l'interface
const gridContainer = document.getElementById('grid');
grid.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', index);
    gridContainer.appendChild(cell);
});

// Affichage des formes dans l'interface
const shapesContainer = document.getElementById('shapes');
shapes.forEach((shape, shapeIndex) => {
    const shapeDiv = document.createElement('div');
    shapeDiv.classList.add('shape');
    shape.forEach(() => {
        const shapeCell = document.createElement('div');
        shapeCell.classList.add('shape-cell');
        shapeDiv.appendChild(shapeCell);
    });
    shapeDiv.setAttribute('data-shape', shapeIndex);
    shapesContainer.appendChild(shapeDiv);
});

// Vérifie si une forme peut être placée à une position donnée
function canPlaceShape(shape, startIndex) {
    return shape.every(offset => {
        const targetIndex = startIndex + offset;
        // Vérifie les limites et si les cases sont libres
        return (
            targetIndex >= 0 &&
            targetIndex < grid.length &&
            grid[targetIndex] === 0 &&
            Math.floor((startIndex + offset) / gridSize) === Math.floor((startIndex) / gridSize + Math.floor(offset / gridSize))
        );
    });
}

// Place une forme dans la grille
function placeShape(shape, startIndex) {
    if (!canPlaceShape(shape, startIndex)) return false;

    shape.forEach(offset => {
        const targetIndex = startIndex + offset;
        grid[targetIndex] = 1; // Marque la case comme pleine
        const cell = document.querySelector(`[data-index='${targetIndex}']`);
        cell.classList.add('filled');
    });

    // Supprime les lignes/colonnes pleines après placement
    clearFullLinesAndColumns();

    return true;
}

// Supprime les lignes et colonnes pleines
function clearFullLinesAndColumns() {
    // Vérifie les lignes
    for (let i = 0; i < gridSize; i++) {
        const startIndex = i * gridSize;
        const row = grid.slice(startIndex, startIndex + gridSize);
        if (row.every(cell => cell === 1)) {
            // Efface la ligne
            for (let j = 0; j < gridSize; j++) {
                grid[startIndex + j] = 0;
                const cell = document.querySelector(`[data-index='${startIndex + j}']`);
                cell.classList.remove('filled');
            }
        }
    }

    // Vérifie les colonnes
    for (let i = 0; i < gridSize; i++) {
        const column = Array.from({ length: gridSize }, (_, j) => grid[i + j * gridSize]);
        if (column.every(cell => cell === 1)) {
            // Efface la colonne
            for (let j = 0; j < gridSize; j++) {
                const targetIndex = i + j * gridSize;
                grid[targetIndex] = 0;
                const cell = document.querySelector(`[data-index='${targetIndex}']`);
                cell.classList.remove('filled');
            }
        }
    }
}

// Vérifie si le joueur peut placer au moins une forme
function canPlaceAnyShape() {
    for (const shape of shapes) {
        for (let i = 0; i < grid.length; i++) {
            if (canPlaceShape(shape, i)) return true;
        }
    }
    return false;
}

// Gestion des clics sur la grille
gridContainer.addEventListener('click', event => {
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;

    const index = parseInt(cell.getAttribute('data-index'), 10);
    const selectedShape = shapes[0]; // Par défaut, on utilise la première forme pour tester

    if (!placeShape(selectedShape, index)) {
        document.getElementById('status').textContent = "Impossible de placer la forme ici.";
    } else {
        document.getElementById('status').textContent = "";

        // Vérifie si le joueur peut continuer à jouer
        if (!canPlaceAnyShape()) {
            document.getElementById('status').textContent = "Game Over ! Aucune forme ne peut être placée.";
        }
    }
});

// Génère de nouvelles formes pour le tour (pourrait être lié à un futur système IA)
function generateNewShapes() {
    // Simule la génération de 3 formes aléatoires
    const randomShapes = [];
    for (let i = 0; i < 3; i++) {
        randomShapes.push(shapes[Math.floor(Math.random() * shapes.length)]);
    }
    return randomShapes;
}
