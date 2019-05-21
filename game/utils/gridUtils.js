/**
 * game/utils/gridUtils.js
 * 
 * What it Does:
 *   This file contains grid related utilities for the game
 * 
 *   getCellSize: return maximum cell size for constrains (width, height, rows, cols)
 * 
 *   gridCell: returns the value of the grid at x and y cell position
 * 
 *   gridCol: returns all cells in col x
 * 
 *   gridRow: returns all cells in row y
 * 
 *   setGridCell: sets a value in grid at cell
 * 
 *   neighborLeft: check if there is a neighbor on the left of cell
 * 
 *   neighborRight: check if there is a neighbor on the right of cell
 * 
 *   neighborDown: check if there is a neighbor on the down of cell
 * 
 * What to Change:
 *   Add any new methods that don't fit anywhere else
 *   eg. 
 * 
 */

const getCellSize = (width, height, rows, cols) => {
    let sizeByWidth = Math.round(width / cols);
    let sizeByHeight = Math.round(height / rows);

    return Math.min(sizeByWidth, sizeByHeight);
}

const gridCell = (grid, x, y) => {
    let cell =  grid &&
    grid[x] &&
    grid[x][y];

    return cell || false;
}

const gridCol = (grid, x) => {
    return grid && grid[x];
}

const gridRow = (grid, y) => {
    return grid && grid
    .filter(x => x && x[y])
    .map(x => x[y])
}

const setGridCell = (grid, cell, value) => {
    let { x, y } = cell;

    // allocate space on grid
    if (typeof grid[x] === 'undefined') { grid[x] = []; }
    if (typeof grid[x][y] === 'undefined') { grid[x][y] = false; }

    grid[x][y] = value; // set value
    return grid;
}

const neighborLeft = (grid, cell) => {
    return gridCell(grid, cell.x - 1, cell.y);
}

const neighborRight = (grid, cell) => {
    return gridCell(grid, cell.x + 1, cell.y);
}

const neighborUp = (grid, cell) => {
    return gridCell(grid, cell.x, cell.y - 1);
}

const neighborDown = (grid, cell) => {
    return gridCell(grid, cell.x, cell.y + 1);
}

export {
    gridCell,
    gridCol,
    gridRow,
    setGridCell,
    neighborLeft,
    neighborRight,
    neighborUp,
    neighborDown,
    getCellSize
};