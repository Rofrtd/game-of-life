const CANVAS = document.querySelector("canvas");
const CTX = CANVAS.getContext("2d");

const RESOLUTION = 10;
CANVAS.width = 2600;
CANVAS.height = 2600;
const ROWS = CANVAS.width / RESOLUTION;
const COLS = CANVAS.height / RESOLUTION;

function matrix() {
  return new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(null)
        .map(() => Math.floor(Math.random() * 2))
    );
}

let grid = matrix();
let generation = 0;

requestAnimationFrame(update);

function update (){
    setTimeout(()=>{
    grid = nextGeneration(grid);
    render(grid);
    requestAnimationFrame(update);
    document.getElementById("gen").innerHTML = "GENERATION: " +generation++;
    }, 80);
}

render(grid);

function render() {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const CELL = grid[col][row];

      CTX.beginPath();
      CTX.rect(col * RESOLUTION, row * RESOLUTION, RESOLUTION, RESOLUTION);
      CTX.fillStyle = CELL ? "green" : "black";
      CTX.fill();
    }
  }
}

function nextGeneration(grid) {
  let newGeneration = grid.map(arr => [...arr]);
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const CELL = grid[col][row];
      let numNeighbours = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          const x_cell = col + i;
          const y_cell = row + j;

          if(x_cell >= 0 && y_cell >= 0 && x_cell < COLS && y_cell < ROWS){
            const currentNeighbor = grid[col + i][row + j];
            numNeighbours += currentNeighbor;
          }
          
        }
      }
      // RULES
      // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      // Any live cell with two or three live neighbours lives on to the next generation.
      // Any live cell with more than three live neighbours dies, as if by overpopulation.
      // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      if (CELL === 1 && numNeighbours < 2) {
        newGeneration[col][row] = 0;
      } else if (CELL === 1 && numNeighbours > 3) {
        newGeneration[col][row] = 0;
      } else if (CELL === 0 && numNeighbours === 3) {
        newGeneration[col][row] = 1;
      }
    }    
  }
  return newGeneration;
}


