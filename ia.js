// Fonction principale pour déterminer la meilleure position
self.onmessage = async function (event) {
    const { grid, form } = event.data;

    const bestMove = findBestMove(grid, form);

    postMessage({ position: bestMove });
};

function findBestMove(grid, form) {
    let bestScore = -Infinity;
    let bestPosition = null;

    // Parcourir toutes les positions possibles
    for (let y = 0; y <= 8 - form.pattern.length; y++) {
        for (let x = 0; x <= 8 - form.pattern[0].length; x++) {
            if (canPlace(grid, form.pattern, x, y)) {
                const simulatedGrid = simulatePlacement(grid, form.pattern, x, y);
                const score = evaluateGrid(simulatedGrid);

                if (score > bestScore) {
                    bestScore = score;
                    bestPosition = { x, y };
                }
            }
        }
    }

    return bestPosition;
}

// Vérifier si une forme peut être placée
function canPlace(grid, pattern, startX, startY) {
    for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
            if (pattern[y][x] === 1 && grid[startY + y][startX + x] !== 0) {
                return false;
            }
        }
    }
    return true;
}

// Simuler le placement d'une forme
function simulatePlacement(grid, pattern, startX, startY) {
    const newGrid = grid.map(row => [...row]);

    pattern.forEach((row, y) => {
        row.forEach((block, x) => {
            if (block === 1) {
                newGrid[startY + y][startX + x] = 1;
            }
        });
    });

    return newGrid;
}

// Évaluer la grille
function evaluateGrid(grid) {
    let score = 0;

    // Bonus pour les suppressions potentielles
    grid.forEach(row => {
        if (row.every(cell => cell === 1)) score += 100;
    });

    for (let x = 0; x < 8; x++) {
        if (grid.every(row => row[x] === 1)) score += 100;
    }

    // Bonus pour les zones vides contiguës
    const emptyZones = findEmptyZones(grid);
    score += emptyZones.length * 10;

    return score;
}

// Trouver les zones vides contiguës
function findEmptyZones(grid) {
    const visited = Array(8).fill().map(() => Array(8).fill(false));
    const zones = [];

    function dfs(x, y) {
        if (x < 0 || y < 0 || x >= 8 || y >= 8 || visited[y][x] || grid[y][x] === 1) return 0;
        visited[y][x] = true;
        return 1 +
            dfs(x - 1, y) +
            dfs(x + 1, y) +
            dfs(x, y - 1) +
            dfs(x, y + 1);
    }

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (!visited[y][x] && grid[y][x] === 0) {
                zones.push(dfs(x, y));
            }
        }
    }

    return zones;
}
