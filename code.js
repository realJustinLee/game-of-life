let rows = 32;
let cols = 32;
let playing = false;
let timer;
let reproductionTime = 100;

let grid = new Array(rows);
let nextGrid = new Array(rows)

function initializeGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

// initialize
function initialize() {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}

// lay out the board
function createTable() {
    let gridContainer = document.getElementById("gridContainer")
    if (!gridContainer) {
        // throw error
        console.error("Problem: no div fot the grid table!");
    }
    let table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = callClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

function callClickHandler() {
    let row_col = this.id.split("_");
    let row = row_col[0];
    let col = row_col[1];

    let classes = this.getAttribute("class");
    if (classes.indexOf('live') > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }
}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.getElementById(i + "_" + j);
            if (grid[i][j] === 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

function setupControlButtons() {
    // button to start
    let startButton = document.getElementById("start");
    startButton.onclick = startButtonHandler;

    // button to clear
    let clearButton = document.getElementById("clear");
    clearButton.onclick = clearButtonHandler;

    // button to set random initial state
    let randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let isLive = Math.round(Math.random());
            if (isLive === 1) {
                let cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    playing = false;
    let startButton = document.getElementById("start")
    startButton.innerHTML = "start"
    clearTimeout(timer);

    let cellsList = document.getElementsByClassName("live");
    // convert to array first, otherwise, you're working on a live node list
    // and the update doesn't work!
    let cells = [];
    for (let i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids();
}

function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false
        this.innerHTML = "continue";
    } else {
        console.log("Continue the game");
        playing = true
        this.innerHTML = "pause";
        play();
    }
}

function play() {
    console.log("Play the game");
    computeNextGen();
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    // clear out the current array
    copyAndResetGrid();
    // copy all 1 values to "live" in the table
    updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col)
    if (grid[row][col] === 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors === 2 || numNeighbors === 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] === 0) {
        if (numNeighbors === 3) {
            nextGrid[row][col] = 1;
        }
    }
}

function countNeighbors(row, col) {
    let count = 0;
    if (row - 1 >= 0) {
        if (grid[row - 1][col] === 1) count++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
        if (grid[row - 1][col - 1] === 1) count++;
    }
    if (row - 1 >= 0 && col + 1 < cols) {
        if (grid[row - 1][col + 1] === 1) count++;
    }
    if (col - 1 >= 0) {
        if (grid[row][col - 1] === 1) count++;
    }
    if (col + 1 < cols) {
        if (grid[row][col + 1] === 1) count++;
    }
    if (row + 1 < rows) {
        if (grid[row + 1][col] === 1) count++;
    }
    if (row + 1 < rows && col - 1 >= 0) {
        if (grid[row + 1][col - 1] === 1) count++;
    }
    if (row + 1 < rows && col + 1 < cols) {
        if (grid[row + 1][col + 1] === 1) count++;
    }
    return count;
}

// start everything
window.onload = initialize;