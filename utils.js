/**
 * creates a canvas with dimensions:  w x h
 * @param {number} width - The width of the canvas
 * @param {number} height - The height of the canvas
 * @returns {string[][]} - The canvas grid
 */
function createCanvas(width, height) {
  if (!width || !height || width < 1 || height < 1) {
    throw new Error("Invalid dimension(s)");
  }

  const canvas = [];

  for (let i = 0; i < height; i++) {
    const row = new Array(width).fill(" ", 0);
    canvas.push(row);
  }
  return canvas;
}

/**
 * Draws the canvas
 * @param {string[][]} grid
 * @returns string
 */
function drawCanvas(grid) {
  const canvas = [];

  canvas.push(drawHorizontalLine(grid[0].length));
  grid.forEach((row) => canvas.push(["|", ...row, "|"]));
  canvas.push(drawHorizontalLine(grid[0].length));

  return canvas
    .reduce((rows, row) => {
      rows.push(row.join(""));

      return rows;
    }, [])
    .join("\n");
}

/**
 * Draws a horizontal or vertical line based on coordinates given
 * @param {string[][]} cells - The canvas array with row and columns
 * @param {number} x1 - x coordinate of starting position
 * @param {number} y1 - y coordinate of starting position
 * @param {number} x2 - x coordinate of ending position
 * @param {number} y2 - y coordinate of ending position
 * @returns
 */
function drawLine(cells, x1, y1, x2, y2) {
  if (
    [x1, y1, x2, y2].some((point) => point < 1) ||
    x1 > cells[0].length ||
    x2 > cells[0].length ||
    y1 > cells.length ||
    y2 > cells.length
  ) {
    throw new Error("Draw inside the canvas.");
  }

  if (x1 !== x2 && y1 !== y2) {
    throw new Error("Only vertical or horizontal lines are supported.");
  }

  const updatedCells = cells.map((row) => row.slice(0));

  // Horizontal
  if (x1 !== x2) {
    // Switch coordinates if x1 is greater than x2.
    if (x1 > x2) {
      [x1, x2] = [x2, x1];
    }

    updatedCells[y1 - 1].fill("x", x1 - 1, x2);

    return updatedCells;
  }

  // Vertical
  // Switch coordinates if y1 is greater than y2.
  if (y1 > y2) {
    [y1, y2] = [y2, y1];
  }

  for (let i = y1 - 1; i < y2; i++) {
    updatedCells[i][x1 - 1] = "x";
  }

  return updatedCells;
}

/**
 * Draws an array of dashes(`-`) to be used as an top/ bottom border
 * @param {number} length - Number of columns in canvas
 * @returns string[] - An array of dashes(`-`)
 */
function drawHorizontalLine(length) {
  const border = new Array(length + 2);

  border.fill("-");

  return border;
}

/**
 * Fills the entire area connected to x, y with "color" that is bound by other shapes.
 * (Behaves like Paint's "bucket fill" tool.)
 * @param {string[][]} cells - The cells of the canvas.
 * @param {number} x - The x coordinate of the point.
 * @param {number} y - The y coordinate of the point.
 * @param {string} color - The "color" to fill the area with, i.e., "c", fills the space with "c".
 * @returns {string[][]} The updated array of cells.
 */
function fillArea(cells, x, y, color) {
  const updatedCells = cells.map((row) => row.slice(0));

  fill(updatedCells, x, y, cells[y][x], color);

  return updatedCells;
}

/**
 * Draws a rectangle from the upper left corner (x1, y1) to its lower
 * right corner (x2, y2).
 * @param {string[][]} cells - The cells of the canvas.
 * @param {number} x1 - The x coordinate of the upper left corner.
 * @param {number} y1 - The y coordinate of the upper left corner.
 * @param {number} x2 - The x coordinate of the lower right corner.
 * @param {number} y2 - The y coordinate of the lower right corner.
 * @returns {string[][]} The updated array of cells.
 */
function drawRectangle(cells, x1, y1, x2, y2) {
  let updated = drawLine(cells, x1, y1, x2, y1);
  updated = drawLine(updated, x2, y1, x2, y2);
  updated = drawLine(updated, x2, y2, x1, y2);
  return drawLine(updated, x1, y2, x1, y1);
}

/**
 * Fills the entire area connected to x, y with "color" that is bound by other shapes.
 * (Behaves like Paint's "bucket fill" tool.)
 * @param {string[][]} cells - The cells of the canvas.
 * @param {number} x - The x coordinate of the point.
 * @param {number} y - The y coordinate of the point.
 * @param {string} previousColor - The previous "color".
 * @param {string} newColor - The "color" to fill the area with, i.e., "c", fills the space with "c".
 */
function fill(cells, x, y, previousColor, newColor) {
  if (
    x < 0 ||
    y < 0 ||
    x >= cells[0].length ||
    y >= cells.length ||
    cells[y][x] !== previousColor
  ) {
    return;
  }

  cells[y][x] = newColor;

  fill(cells, x + 1, y, previousColor, newColor);
  fill(cells, x - 1, y, previousColor, newColor);
  fill(cells, x, y + 1, previousColor, newColor);
  fill(cells, x, y - 1, previousColor, newColor);
}

module.exports = {
  createCanvas,
  drawCanvas,
  drawLine,
  drawRectangle,
  drawHorizontalLine,
  fillArea,
};
