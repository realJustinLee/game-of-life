import React, {useState} from "react";
import './css/App.css'
import GameBoard from "./component/GameBoard";

let timer = null;
let playing = false;

export default function App() {

    const [rows, setRows] = useState(Math.round(process.env.REACT_APP_DEFAULT_ROWS));
    const [cols, setCols] = useState(Math.round(process.env.REACT_APP_DEFAULT_COLS));
    const [reproductionTime, setReproductionTime] = useState(Math.round(process.env.REACT_APP_DEFAULT_REPRODUCTION_TIME));

    const [grid, setGrid] = useState(() => {
        let grid = [];
        for (let i = 0; i < rows; i++) {
            grid[i] = Array(cols).fill(0);
        }
        return grid;
    });
    const [nextGrid, setNextGrid] = useState(() => {
        let nextGrid = [];
        for (let i = 0; i < rows; i++) {
            nextGrid[i] = Array(cols).fill(0);
        }
        return nextGrid;
    });

    const [startBtnText, setStartBtnText] = useState("start");
    const [newRows, setNewRows] = useState(rows);
    const [newCols, setNewCols] = useState(cols);
    const [newReproductionTime, setNewReproductionTime] = useState(reproductionTime)

    function resetGrids() {
        let newGrid = grid.slice();
        let newNextGrid = nextGrid.slice();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                newGrid[i][j] = 0;
                newNextGrid[i][j] = 0;
            }
        }
        setGrid(newGrid);
        setNextGrid(newNextGrid);
    }

    function copyAndResetGrid() {
        let newGrid = grid.slice();
        let newNextGrid = nextGrid.slice();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                newGrid[i][j] = nextGrid[i][j];
                newNextGrid[i][j] = 0;
            }
        }
        setGrid(newGrid);
        setNextGrid(newNextGrid);
    }

    function cellClickHandler(i, j) {
        console.log("Flip cell: " + i + "_" + j);
        let newGrid = grid.slice();
        if (newGrid[i][j] === 1) {
            newGrid[i][j] = 0;
        } else {
            newGrid[i][j] = 1;
        }
        setGrid(newGrid);
    }

    function randomButtonHandler() {
        if (playing) return;
        clearButtonHandler();
        let newGrid = grid.slice();
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let isLive = Math.round(Math.random());
                if (isLive === 1) {
                    newGrid[i][j] = 1;
                }
            }
        }
        setGrid(newGrid);
    }

    function clearButtonHandler() {
        console.log("Clear the game: stop playing, clear the grid");
        setStartBtnText("start");
        playing = false;
        clearTimeout(timer);
        resetGrids();
    }

    function startButtonHandler() {
        if (playing) {
            console.log("Pause the game");
            setStartBtnText("continue");
            playing = false;
        } else {
            console.log("Continue the game");
            setStartBtnText("pause");
            playing = true;
            play();
        }
    }

    function play() {
        console.log("Play the game");
        computeNextGen();
        if (playing) {
            timer = setTimeout(() => play(), reproductionTime);
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
    }

    // RULES
    // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overcrowding.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    function applyRules(row, col) {
        let numNeighbors = countNeighbors(row, col)
        let newNextGrid = nextGrid.slice();
        if (grid[row][col] === 1) {
            if (numNeighbors < 2) {
                newNextGrid[row][col] = 0;
            } else if (numNeighbors === 2 || numNeighbors === 3) {
                newNextGrid[row][col] = 1;
            } else if (numNeighbors > 3) {
                newNextGrid[row][col] = 0;
            }
        } else if (grid[row][col] === 0) {
            if (numNeighbors === 3) {
                newNextGrid[row][col] = 1;
            }
        }
        setNextGrid(newNextGrid);
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

    function resizeRowsHandler(event) {
        event.preventDefault();
        setNewRows(event.target.value);
    }

    function resizeColsHandler(event) {
        event.preventDefault();
        setNewCols(event.target.value);
    }

    function resizeHandler(event) {
        event.preventDefault();
        alert('Resetting Game with new cols ' + newRows + ', rows ' + newCols + '.');
        let newGrid = new Array(newRows);
        let newNextGrid = new Array(newRows);
        for (let i = 0; i < newRows; i++) {
            newGrid[i] = new Array(newCols);
            newNextGrid[i] = new Array(newCols);
            for (let j = 0; j < newCols; j++) {
                newGrid[i][j] = 0;
                newNextGrid[i][j] = 0;
            }
        }
        clearTimeout(timer);
        playing = false;
        setRows(newRows);
        setCols(newCols)
        setGrid(newGrid)
        setNextGrid(newNextGrid);
        setStartBtnText("start");
    }

    function changeReproductionTimeHandler(event) {
        event.preventDefault();
        setNewReproductionTime(event.target.value);
    }

    function changeReproductionHandler(event) {
        event.preventDefault();
        alert('Resetting Game with new reproduction time ' + reproductionTime + 'ms.');
        clearTimeout(timer);
        playing = false;
        setReproductionTime(newReproductionTime);
        setStartBtnText("continue");
    }

    return (<div>
        <GameBoard
            grid={grid}
            onClick={cellClickHandler}
        />
        <div className="controls">
            <button onClick={startButtonHandler}>{startBtnText}</button>
            <button onClick={clearButtonHandler}>clear</button>
            <button
                onClick={randomButtonHandler}
                disabled={playing}
            >
                random
            </button>
        </div>
        <div>
            <form onSubmit={resizeHandler}>
                <label>
                    Rows:&nbsp;
                    <input
                        name="newRows"
                        type="number"
                        value={newRows}
                        onChange={resizeRowsHandler}
                    />
                </label>
                <label>
                    Cols:&nbsp;
                    <input
                        name="newCols"
                        type="number"
                        value={newCols}
                        onChange={resizeColsHandler}
                    />
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
        <div>
            <form onSubmit={changeReproductionHandler}>
                <label>
                    Reproduction time:&nbsp;
                    <input
                        name="newRows"
                        type="number"
                        value={newReproductionTime}
                        onChange={changeReproductionTimeHandler}
                    />
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
        <div>
            ™ and © 1997-2024 Justin Lee. All Rights Reserved.
        </div>
    </div>);
}