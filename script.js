document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const editButton = document.getElementById("edit-grid");
    const confirmButton = document.getElementById("confirm-grid");
    const restartButton = document.getElementById("restart-game");
    const gameStatus = document.getElementById("game-status");
    const shapeContainer = document.getElementById("shape-container");

    let gridData = Array(64).fill(0); // Représentation de la grille vide
    let editing = false;

    // Créer et afficher la grille
    function createGrid() {
        grid.innerHTML = "";
        gridData.forEach((cell, index) => {
            const div = document.createElement("div");
            div.classList.toggle("filled", cell === 1);
            div.addEventListener("click", () => toggleCell(index));
            grid.appendChild(div);
        });
    }

    // Basculer l'état d'une case pendant l'édition
    function toggleCell(index) {
        if (!editing) return;
        gridData[index] = gridData[index] === 0 ? 1 : 0;
        createGrid();
    }

    // Charger les formes depuis formes.json
    function loadShapes() {
        fetch("formes.json")
            .then((response) => response.json())
            .then((shapes) => {
                shapeContainer.innerHTML = "";
                shapes.forEach((shape) => {
                    const div = document.createElement("div");
                    div.textContent = shape.name;
                    div.dataset.blocks = JSON.stringify(shape.blocks);
                    shapeContainer.appendChild(div);
                });
            });
    }

    // Actions des boutons
    editButton.addEventListener("click", () => {
        editing = true;
        confirmButton.disabled = false;
        gameStatus.textContent = "Statut : Édition de la grille";
    });

    confirmButton.addEventListener("click", () => {
        editing = false;
        confirmButton.disabled = true;
        gameStatus.textContent = "Statut : Grille confirmée";
    });

    restartButton.addEventListener("click", () => {
        gridData = Array(64).fill(0);
        createGrid();
        gameStatus.textContent = "Statut : Jeu réinitialisé";
    });

    // Initialisation
    createGrid();
    loadShapes();
});
