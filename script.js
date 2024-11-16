// script.js

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const editButton = document.getElementById('edit-grid');
    const confirmButton = document.getElementById('confirm-grid');
    const restartButton = document.getElementById('restart-game');
    const formsContainer = document.getElementById('forms');
    const gameStatus = document.getElementById('game-status');
    
    let gridData = Array(64).fill(0); // Grille vide
    let isEditing = false;

    // Créer la grille
    function createGrid() {
        grid.innerHTML = '';
        gridData.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add(value === 1 ? 'filled' : '');
            cell.dataset.index = index;
            cell.addEventListener('click', () => toggleCell(index));
            grid.appendChild(cell);
        });
    }

    // Basculer l'état d'une case
    function toggleCell(index) {
        if (!isEditing) return;
        gridData[index] = gridData[index] === 0 ? 1 : 0;
        createGrid();
    }

    // Charger les formes
    function loadForms() {
        formsContainer.innerHTML = '';
        fetch('formes.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(form => {
                    const formDiv = document.createElement('div');
                    formDiv.textContent = form.name;
                    formDiv.dataset.blocks = JSON.stringify(form.blocks);
                    formsContainer.appendChild(formDiv);
                });
            });
    }

    // Écouteurs d'événements
    editButton.addEventListener('click', () => {
        isEditing = true;
        confirmButton.disabled = false;
        gameStatus.textContent = 'Statut : Édition de la grille';
    });

    confirmButton.addEventListener('click', () => {
        isEditing = false;
        gameStatus.textContent = 'Statut : Grille confirmée, prêt à jouer';
        confirmButton.disabled = true;
    });

    restartButton.addEventListener('click', () => {
        gridData.fill(0);
        createGrid();
        gameStatus.textContent = 'Statut : Jeu redémarré';
    });

    // Initialisation
    createGrid();
    loadForms();
});
