let rows = 32;
let cols = 32;

// initialize
function initialize() {
    createTable();
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
    let classes = this.getAttribute("class");
    if (classes.indexOf('live') > -1) {
        this.setAttribute("class", "dead");
    } else {
        this.setAttribute("class", "live");
    }
}

// start everything
window.onload = initialize;