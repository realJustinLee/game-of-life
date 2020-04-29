let rows = 32;
let cols = 32;

let playing = false;

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
    let rowcol = this.id.split("_");
    let row = rowcol[0];
    let col = rowcol[1];

    let classes = this.getAttribute("class");
    if (classes.indexOf('live') > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }
}

function setupControlButtons() {
    // button to start
    let startButton = document.getElementById("start");
    startButton.onclick = startButtonHandler;

    // button to clear
    let clearButton = document.getElementById("clear");
    clearButton.onclick = clearButtonHandler;
}

function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    playing = false;
    let startButton = document.getElementById("start")
    startButton.innerHTML = "start"

    // TODO: code here
    //  the action that clears the grid map
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
    // TODO: code here
    //  the game of life module
}

// start everything
window.onload = initialize;