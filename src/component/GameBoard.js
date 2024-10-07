import React from "react";

export default function GameBoard({grid, onClick}) {
    const cells = grid.map((row, i) => {
        const rowCells = row.map((cell, j) => {
            return (
                <td
                    key={"cell_" + i + "_" + j}
                    onClick={() => onClick(i, j)}
                    className={cell === 0 ? "dead" : "live"}
                />
            );
        });

        return (
            <tr key={"row_" + i}>
                {rowCells}
            </tr>
        );
    });


    return (
        <div id="gridContainer">
            <table>
                <tbody>
                {cells}
                </tbody>
            </table>
        </div>
    );
}