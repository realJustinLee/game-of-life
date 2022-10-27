import React, {Component} from "react";
import './css/App.css'
import GameBoard from "./component/GameBoard";

class App extends Component {
    constructor(props) {
        super(props);

        let rows = Math.round(process.env.REACT_APP_DEFAULT_ROWS);
        let cols = Math.round(process.env.REACT_APP_DEFAULT_COLS);
        let grid = new Array(rows);
        this.nextGrid = new Array(rows);
        for (let i = 0; i < rows; i++) {
            grid[i] = new Array(cols).fill(0);
            this.nextGrid[i] = new Array(cols).fill(0);
        }

        this.playing = false;

        this.state = {
            rows: rows,
            cols: cols,
            reproductionTime: Math.round(process.env.REACT_APP_DEFAULT_REPRODUCTION_TIME),
            grid: grid,
            startBtnText: "start",
            newRows: rows,
            newCols: cols,
        }

        this.resetGrids = this.resetGrids.bind(this);
        this.copyAndResetGrid = this.copyAndResetGrid.bind(this);
        // this.setupControlButtons = this.setupControlButtons.bind(this);

        this.cellClickHandler = this.cellClickHandler.bind(this);
        this.startButtonHandler = this.startButtonHandler.bind(this);
        this.clearButtonHandler = this.clearButtonHandler.bind(this);
        this.randomButtonHandler = this.randomButtonHandler.bind(this);

        this.resizeValueHandler = this.resizeValueHandler.bind(this);
        this.resizeHandler = this.resizeHandler.bind(this);

        this.play = this.play.bind(this);
    }

    componentDidMount() {
        this.resetGrids();
    }

    resetGrids() {
        let grid = this.state.grid;
        for (let i = 0; i < this.state.rows; i++) {
            for (let j = 0; j < this.state.cols; j++) {
                grid[i][j] = 0;
                this.nextGrid[i][j] = 0;
            }
        }
        this.setState({
            grid: grid,
        })
    }

    copyAndResetGrid() {
        let grid = this.state.grid;
        for (let i = 0; i < this.state.rows; i++) {
            for (let j = 0; j < this.state.cols; j++) {
                grid[i][j] = this.nextGrid[i][j];
                this.nextGrid[i][j] = 0;
            }
        }
        this.setState({
            grid: grid,
        })
    }

    cellClickHandler(i, j) {
        const grid = this.state.grid;
        if (this.state.grid[i][j] === 1) {
            console.log("Flip cell: " + i + "_" + j);
            grid[i][j] = 0;
        } else {
            grid[i][j] = 1;
        }
        this.setState({
            grid: grid
        })
    }

    randomButtonHandler() {
        if (this.playing) return;
        this.clearButtonHandler();
        let grid = this.state.grid;
        for (let i = 0; i < this.state.rows; i++) {
            for (let j = 0; j < this.state.cols; j++) {
                let isLive = Math.round(Math.random());
                if (isLive === 1) {
                    grid[i][j] = 1;
                }
            }
        }
        this.setState({
            grid: grid
        })
    }

    clearButtonHandler() {
        console.log("Clear the game: stop playing, clear the grid");
        this.setState({
            startBtnText: "start"
        })
        this.playing = false;
        clearTimeout(this.timer);
        this.resetGrids();
    }

    startButtonHandler() {
        if (this.playing) {
            console.log("Pause the game");
            this.setState({
                startBtnText: "continue",
            })
            this.playing = false;
        } else {
            console.log("Continue the game");
            this.setState({
                startBtnText: "pause",
            })
            this.playing = true;
            this.play();
        }
    }

    play() {
        console.log("Play the game");
        this.computeNextGen();
        if (this.playing) {
            this.timer = setTimeout(() => this.play(), this.state.reproductionTime);
        }
    }

    computeNextGen() {
        for (let i = 0; i < this.state.rows; i++) {
            for (let j = 0; j < this.state.cols; j++) {
                this.applyRules(i, j);
            }
        }
        // clear out the current array
        this.copyAndResetGrid();
    }

    // RULES
    // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overcrowding.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    applyRules(row, col) {
        let numNeighbors = this.countNeighbors(row, col)
        if (this.state.grid[row][col] === 1) {
            if (numNeighbors < 2) {
                this.nextGrid[row][col] = 0;
            } else if (numNeighbors === 2 || numNeighbors === 3) {
                this.nextGrid[row][col] = 1;
            } else if (numNeighbors > 3) {
                this.nextGrid[row][col] = 0;
            }
        } else if (this.state.grid[row][col] === 0) {
            if (numNeighbors === 3) {
                this.nextGrid[row][col] = 1;
            }
        }
    }

    countNeighbors(row, col) {
        let count = 0;
        if (row - 1 >= 0) {
            if (this.state.grid[row - 1][col] === 1) count++;
        }
        if (row - 1 >= 0 && col - 1 >= 0) {
            if (this.state.grid[row - 1][col - 1] === 1) count++;
        }
        if (row - 1 >= 0 && col + 1 < this.state.cols) {
            if (this.state.grid[row - 1][col + 1] === 1) count++;
        }
        if (col - 1 >= 0) {
            if (this.state.grid[row][col - 1] === 1) count++;
        }
        if (col + 1 < this.state.cols) {
            if (this.state.grid[row][col + 1] === 1) count++;
        }
        if (row + 1 < this.state.rows) {
            if (this.state.grid[row + 1][col] === 1) count++;
        }
        if (row + 1 < this.state.rows && col - 1 >= 0) {
            if (this.state.grid[row + 1][col - 1] === 1) count++;
        }
        if (row + 1 < this.state.rows && col + 1 < this.state.cols) {
            if (this.state.grid[row + 1][col + 1] === 1) count++;
        }
        return count;
    }

    resizeValueHandler(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    resizeHandler(event) {
        event.preventDefault();
        alert('Resting Game with new cols ' + this.state.newRows + ", rows " + this.state.newCols + ".");
        let rows = this.state.newRows;
        let cols = this.state.newCols;
        let grid = new Array(rows);
        this.nextGrid = new Array(rows);
        for (let i = 0; i < rows; i++) {
            grid[i] = new Array(cols);
            this.nextGrid[i] = new Array(cols);
            for (let j = 0; j < cols; j++) {
                grid[i][j] = 0;
                this.nextGrid[i][j] = 0;
            }
        }
        clearTimeout(this.timer);
        this.playing = false;
        this.setState({
            rows: rows, cols: cols, grid: grid, startBtnText: "start",
        })
    }

    render() {
        return (<div>
            <GameBoard
                grid={this.state.grid}
                onClick={this.cellClickHandler}
            />
            <div className="controls">
                <button onClick={() => this.startButtonHandler()}>{this.state.startBtnText}</button>
                <button onClick={() => this.clearButtonHandler()}>clear</button>
                <button
                    onClick={() => this.randomButtonHandler()}
                    disabled={this.playing}
                >
                    random
                </button>
            </div>
            <div>
                <form onSubmit={this.resizeHandler}>
                    <label>
                        Rows:
                        <input
                            name="newRows"
                            type="number"
                            value={this.state.newRows}
                            onChange={this.resizeValueHandler}
                        />
                    </label>
                    <label>
                        Cols:
                        <input
                            name="newCols"
                            type="number"
                            value={this.state.newCols}
                            onChange={this.resizeValueHandler}
                        />
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        </div>);
    }
}

export default App;
