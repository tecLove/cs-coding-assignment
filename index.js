const utils = require("./utils");
const rdline = require("readline");

const rl = rdline.createInterface(process.stdin, process.stdout);
let canvas;

console.log(`
  Command         Description
  C w h           Creates a new canvas of width w and height h.
  L x1 y1 x2 y2   Creates a new line from (x1, y1) to (x2, y2). Currently only
                  horizontal or vertical lines are supported. Horizontal and vertical lines
                  will be drawn using the "x" character.
  R x1 y1 x2 y2   Creates a new rectangle, whose upper left corner is (x1, y1) and
                  lower right corner is (x2, y2). Horizontal and vertical lines will be drawn
                  using the 'x' character.
  B x y c         Fills the entire area connected to (x, y) with "colour" c. The
                  behaviour of this is the same as that of the "bucket fill" tool in paint
                  programs.
  Q               Quits the program.
`);

rl.setPrompt("enter command:");
rl.prompt();
rl.on("line", (line) => {
  const args = line.split(" ");
  const command = args[0];

  try {
    switch (command.toUpperCase()) {
      case "C": {
        const width = parseInt(args[1], 10);
        const height = parseInt(args[2], 10);

        canvas = utils.createCanvas(width, height);
        drawCanvas(canvas, rl);
        break;
      }
      case "L": {
        handleNoCanvasFoundError(canvas);

        const x1 = parseInt(args[1], 10);
        const y1 = parseInt(args[2], 10);
        const x2 = parseInt(args[3], 10);
        const y2 = parseInt(args[4], 10);

        canvas = utils.drawLine(canvas, x1, y1, x2, y2);
        drawCanvas(canvas, rl);
        break;
      }
      case "R": {
        handleNoCanvasFoundError(canvas);

        const x1 = parseInt(args[1], 10);
        const y1 = parseInt(args[2], 10);
        const x2 = parseInt(args[3], 10);
        const y2 = parseInt(args[4], 10);

        canvas = utils.drawRectangle(canvas, x1, y1, x2, y2);
        drawCanvas(canvas, rl);
        break;
      }
      case "B": {
        handleNoCanvasFoundError(canvas);

        const x = parseInt(args[1], 10);
        const y = parseInt(args[2], 10);
        const color = args[3];

        canvas = utils.fillArea(canvas, x, y, color);
        drawCanvas(canvas, rl);
        break;
      }
      case "Q":
        process.exit(0);
      default:
        console.log(
          "Entered command does not exist. Available commands are C, L, R, B, Q."
        );
    }
  } catch (e) {
    console.log("There was an error encountered", e.message);
    rl.prompt();
  }
});

/**
 * Renders the canvas on the console and waits for the next command.
 * @param {string[][]} canvas - The canvas.
 * @param {object} interface - The readline interface.
 */
function drawCanvas(canvas, interface) {
  console.log(utils.drawCanvas(canvas));
  interface.prompt();
}

/**
 * Handles the error when a draw command is used without an existing canvas.
 * @param {string[][]} canvas - The canvas.
 * @param {object} interface - The readline interface.
 */
function handleNoCanvasFoundError(canvas) {
  if (!canvas) {
    throw new Error("Set canvas first.");
  }
}
