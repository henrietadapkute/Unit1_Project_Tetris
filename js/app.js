function init() {
    // create grid
    const width = 10;
    const height = 20;
    const cellCount = document.getElementById("cellCount");
    let cells = [];
    let currentBlock = null;
  
    const blocks = [
      {
        name: "blockO",
        shape: [
          [0, 4],
          [0, 5],
          [1, 4],
          [1, 5],
        ],
        color: "yellow",
      },
      {
        name: "blockI",
        shape: [
          [0, 4],
          [0, 5],
          [0, 6],
          [0, 7],
        ],
        color: "green",
      },
      {
        name: "blockJ",
        shape: [
          [0, 5],
          [1, 5],
          [2, 5],
          [2, 4],
        ],
        color: "blue",
      },
      {
        name: "blockL",
        shape: [
          [0, 4],
          [1, 4],
          [2, 4],
          [2, 5],
        ],
        color: "orange",
      },
      {
        name: "blockS",
        shape: [
          [0, 5],
          [1, 5],
          [1, 4],
          [0, 6],
        ],
        color: "navy",
      },
      {
        name: "blockT",
        shape: [
          [1, 4],
          [1, 5],
          [1, 6],
          [0, 5],
        ],
        color: "purple",
      },
      {
        name: "blockZ",
        shape: [
          [0, 4],
          [0, 5],
          [1, 5],
          [1, 6],
        ],
        color: "red",
      },
    ];
  
    function getRandomSeed() {
      return Math.floor(Math.random() * (99999999 - 0 + 1)) + 0;
    }
  
    function getSeedRNG(seed) {
      return function () {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    }
    function getRandomSequence(seed) {
      const random = getSeedRNG(seed);
      const randomSequence = [];
  
      for (let i = 0; i < 10000; i++) {
        const index = Math.floor(random() * blocks.length);
        randomSequence.push(blocks[index]);
      }
  
      return randomSequence;
    }
    const sequence = getRandomSequence(getRandomSeed());
  
    function createGrid() {
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const cell = document.createElement("div");
          cell.classList.add("cell");
          cell.dataset.row = row;
          cell.dataset.col = col;
          cell.style.height = `${100 / height}%`;
          cell.style.width = `${100 / width}%`;
          cell.style.backgroundColor = "pink";
          cellCount.appendChild(cell);
          cells.push(cell);
        }
      }
    }
    createGrid();
  
    function renderGrid() {
      cells.forEach((cell, index) => {
        const row = Math.floor(index / width);
        const col = index % width;
        const color = gridArr[row][col] || "pink";
        cell.style.backgroundColor = color;
      });
  
    }
  
    
  
    const gridArr = Array.from({ length: height }, () =>
      Array(width).fill("pink")
    );
  
    points = 0;
    function blockClearing() {
      if (!currentBlock) return;
  
      // Calculate the rows to clear
      const rowsToClear = [];
      for (let row = 0; row < height; row++) {
          if (gridArr[row].every(cell => cell !== "pink")) {
              rowsToClear.push(row);
          }
      }
      console.log(rowsToClear);
  
      // Clear the rows and move everything down
      if (rowsToClear.length > 0) {
          const emptyRow = Array.from({ length: width }).fill("pink");
          rowsToClear.forEach(row => {
              gridArr.splice(row, 1);
              gridArr.unshift(emptyRow.slice()); 
          });
  
          points += rowsToClear.length * 100;
          const pointsDisplay = document.getElementById("points");
          pointsDisplay.textContent = `Points: ${points}`;
      }
  }
  
    function rotateBlock() {
      if (!currentBlock) return;
      let newShape = currentBlock.shape.map(([row, col]) => {
        // This rotates the shape from the first cell
        const relativeRow = row - currentBlock.shape[0][0];
        const relativeCol = col - currentBlock.shape[0][1];
    
        // adjusting rotation points
        return [
          currentBlock.shape[0][0] - relativeCol,
          currentBlock.shape[0][1] + relativeRow,
        ];
      });
    
      // collision
      if (isValidShape(newShape)) {
        // Clear the current block
        currentBlock.shape.forEach(([row, col]) => {
          gridArr[row][col] = "pink";
        });
        currentBlock.shape = newShape;
        currentBlock.shape.forEach(([row, col]) => {
          gridArr[row][col] = currentBlock.color;
        });
        renderGrid();
      }
    }
    
  function isValidShape(shape) {
      return shape.every(([row, col]) => {
          if (row < 0 || row >= height || col < 0 || col >= width) {
              return false;
          }
          return gridArr[row][col] === "pink" || isCellPartOfCurrentBlock(row, col);
      });
  }
  
  function isCellPartOfCurrentBlock(row, col) {
      return currentBlock.shape.some(([blockRow, blockCol]) => {
          return blockRow === row && blockCol === col;
      });
  }
    
  
   
    // left and right movements
    function moveBlockSides(key) {
      const sides = canBlockMoveSide();
      console.log(sides);
      if (!sides.includes("left") && key === "ArrowLeft") {
        for (let i = 0; i < currentBlock.shape.length; i++) {
          const row = currentBlock.shape[i][0];
          const col = currentBlock.shape[i][1];
          gridArr[row][col] = "pink";
        }
  
        // Update block's position
        for (let i = 0; i < currentBlock.shape.length; i++) {
          const row = currentBlock.shape[i][0];
          const col = currentBlock.shape[i][1];
          currentBlock.shape[i][1] -= 1; // Move the block to the left
        }
  
        // Set the new block position to its color
        for (let i = 0; i < currentBlock.shape.length; i++) {
          const row = currentBlock.shape[i][0];
          const col = currentBlock.shape[i][1];
          gridArr[row][col] = currentBlock.color;
        }
  
        // Render the grid
        renderGrid();
      }
      if (!sides.includes("right") && key === "ArrowRight") {
        for (let i = 0; i < currentBlock.shape.length; i++) {
          const row = currentBlock.shape[i][0];
          const col = currentBlock.shape[i][1];
          gridArr[row][col] = "pink";
        }
  

        for (let i = 0; i < currentBlock.shape.length; i++) {
          const row = currentBlock.shape[i][0];
          const col = currentBlock.shape[i][1];
          currentBlock.shape[i][1] += 1; // Move the block to the right
        }
  

        for (let i = 0; i < currentBlock.shape.length; i++) {
          const row = currentBlock.shape[i][0];
          const col = currentBlock.shape[i][1];
          gridArr[row][col] = currentBlock.color;
        }
  
       
        renderGrid();
      }
    }
  
    function canBlockMovesDown() {
      let directions = [];
  
      for (let i = 0; i < currentBlock.shape.length; i++) {
        const row = currentBlock.shape[i][0];
        const col = currentBlock.shape[i][1];
        if (row === 19) {
          directions.push("down");
        } else {
          const nextRow = row + 1;
          if (
            nextRow < height &&
            !currentBlock.shape.some(([r, c]) => r === nextRow && c === col) &&
            gridArr[nextRow][col] !== "pink"
          ) {
            directions.push("down");
          }
        }
      }
  
      return directions;
    }
  
  
    function renderNextBlock() {
      const nextBlockDisplay = document.getElementById("nextBlock");
      nextBlockDisplay.innerHTML = '';
  
      const nextBlock = sequence[1];
  
      // Create a mini grid to display the next block
      for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
              const cell = document.createElement("div");
              cell.classList.add("cell");
              cell.style.height = `${100}px`;
              cell.style.width = `${100}px`;
  
              // Determine if the current cell position matches any part of the next block's shape
              // Adjust for the 4x3 grid by considering the offset
              const isPartOfBlock = nextBlock.shape.some(shapeCell => {
                  const shapeRow = shapeCell[0];
                  const shapeCol = shapeCell[1] - Math.min(...nextBlock.shape.map(s => s[1])); // Adjust the column based on the smallest column index of the block shape
                  return row === shapeRow && col === shapeCol;
              });
  
              cell.style.backgroundColor = isPartOfBlock ? nextBlock.color : "black";
  
              nextBlockDisplay.appendChild(cell);
          }
      }
  }
    
  
    function canBlockMoveSide() {
      let canMoveLeft = true;
      let canMoveRight = true;
  
      for (let i = 0; i < currentBlock.shape.length; i++) {
        const row = currentBlock.shape[i][0];
        const col = currentBlock.shape[i][1];
  
        // Check left
        if (
          col === 0 ||
          (gridArr[row][col - 1] !== "pink" &&
            !currentBlock.shape.some(([r, c]) => r === row && c === col - 1))
        ) {
          canMoveLeft = false;
        }
  
        // Check right
        if (
          col === width - 1 ||
          (gridArr[row][col + 1] !== "pink" &&
            !currentBlock.shape.some(([r, c]) => r === row && c === col + 1))
        ) {
          canMoveRight = false;
        }
      }
  
      let directions = [];
      if (!(canMoveLeft)) directions.push("left");
      if (!(canMoveRight)) directions.push("right");
  
      return directions;
    }
  
    function moveDownBlock() {
      if (currentBlock === null) {
        if (!isGameOver()) {
            renderNextBlock();  
          }
        currentBlock = { ...sequence[0] };
        sequence.shift();
        
      }
    
      if (canBlockMovesDown().length === 0) {
        for (let i = 0; i < currentBlock.shape.length; i++) {
          const row = currentBlock.shape[i][0];
          const col = currentBlock.shape[i][1];
          gridArr[row][col] = "pink";
        }
        currentBlock.shape = [
          [currentBlock.shape[0][0] + 1, currentBlock.shape[0][1]],
          [currentBlock.shape[1][0] + 1, currentBlock.shape[1][1]],
          [currentBlock.shape[2][0] + 1, currentBlock.shape[2][1]],
          [currentBlock.shape[3][0] + 1, currentBlock.shape[3][1]],
        ];
        for (let i = 0; i < currentBlock.shape.length; i++) {
          const row = currentBlock.shape[i][0];
          const col = currentBlock.shape[i][1];
          gridArr[row][col] = currentBlock.color;
        }
      } else {
        if (!isGameOver()) {
          renderNextBlock();  
        }
        
        blockClearing();
          
  
        currentBlock = { ...sequence[0] };
        sequence.shift();
      }
    }
  
    function isGameOver() {
      for (let col = 0; col < width; col++) {
          if ((gridArr[1][col] !== "pink" && (gridArr[1][col] !== currentBlock.color)) || (gridArr[2][col] !== "pink" && (gridArr[2][col] !== currentBlock.color))) {
              return true;
          }
      }
      return false;
  }
  
  function gameLoop() {
      const renderInterval = setInterval(() => {
          renderGrid();
          if (isGameOver()) {
              clearInterval(renderInterval);
              showGameOverScreen();
          }
      }, 100);
  
      const moveInterval = setInterval(() => {
          moveDownBlock();
          if (isGameOver()) {
              clearInterval(moveInterval);
          }
      }, 500);
  }
  
  gameLoop();
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        moveDownBlock();
      }
      if (event.key === "ArrowLeft") {
        moveBlockSides("ArrowLeft");
      }
      if (event.key === "ArrowRight") {
        moveBlockSides("ArrowRight");
      }
      if (event.key === "ArrowUp") {
        rotateBlock()
      }
    });
    
  }
  
  function showStartScreen() {
      const startScreen = document.createElement("div");
      startScreen.id = "startScreen";
      startScreen.innerHTML = `
        <div class="start-container">
          <h1>Welcome to Tetris</h1>
          <button id="startButton">Start Game</button>
        </div>
      `;
      document.body.appendChild(startScreen);
    
      document.getElementById("startButton").addEventListener("click", function() {
        startScreen.style.display = "none";
        startGame();
      });
    }
  
    function showGameOverScreen() {
      const gameOverScreen = document.createElement("div");
      gameOverScreen.id = "gameOverScreen";
      gameOverScreen.innerHTML = `
        <div class="game-over-container">
          <h1>Game Over</h1>
          <button id="restartButton">Restart Game</button>
        </div>
      `;
      document.body.appendChild(gameOverScreen);
  
      document.getElementById("restartButton").addEventListener("click", function() {
          gameOverScreen.remove();
          const grid = document.getElementsByClassName("grid")[0];
          
          grid.innerHTML = "";
          startGame();
      });
  }
  
    function startGame() {
      init();

  
    }
  
  
  
    window.addEventListener("DOMContentLoaded", function() {
      showStartScreen(); 
    });