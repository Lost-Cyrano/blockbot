// Configuration initiale
const grid = Array(64).fill(0); // Grille 8x8 sous forme de liste
const shapes = [
    [0, 1, 9, 10],        // Carré 2x2
    [0, 1, 2],            // Ligne horizontale 3 cases
    [0, 8, 16],           // Ligne verticale 3 cases
    [0, 1, 8],            // L en bas à gauche
];

// Initialisation de la grille
const gridContainer = document.getElementById('grid');
grid.forEach((_, index) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', index);
    gridContainer.appendChild(cell);
});

// Afficher les formes
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

// Placer une forme sur la grille
function placeShape(shape, startIndex) {
    const canPlace = shape.every(offset => {
        const targetIndex = startIndex + offset;
        return grid[targetIndex] === 0;
    });

    if (canPlace) {
        shape.forEach(offset => {
            const targetIndex = startIndex + offset;
            grid[targetIndex] = 1;
            const cell = document.querySelector(`[data-index='${targetIndex}']`);
            cell.classList.add('filled');
        });
        return true;
    }
    return false;
}

// Écoute des clics sur la grille
gridContainer.addEventListener('click', event => {
    const cell = event.target;
    if (!cell.classList.contains('cell')) return;

    const index = parseInt(cell.getAttribute('data-index'), 10);
    const shape = shapes[0]; // Choisir une forme pour tester
    const placed = placeShape(shape, index);

    if (!placed) {
        document.getElementById('status').textContent = "Impossible de placer la forme ici.";
    } else {
        document.getElementById('status').textContent = "";
    }
});
