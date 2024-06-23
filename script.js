// game constants
let inputDir = { x: 0, y: 0 };
let foodSound = new Audio("musics/food.mp3");
let gameOverSound = new Audio("musics/gameover.mp3");
let moveSound = new Audio("musics/move.mp3");
let musicSound = new Audio("musics/music.mp3");
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let eatCount = 0; // Counter for tracking food consumption

// Game Function
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // Collision logic goes here
  // if snake bumps into itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  // if snake bumps into the wall
  if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
    return true;
  }

  return false;
}

function gameEngine() {
  // part 1: updating snake array

  // collide snake
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    score = 0;
    eatCount = 0; // Reset the eat counter on game over
    speed = 5; // Reset speed on game over
    scoreBox.innerHTML = "Score: 0";
    inputDir = { x: 0, y: 0 };
    alert("Game over. Press Enter key to play again....!");
    snakeArr = [{ x: 13, y: 15 }];
  }

  // if snake has eaten the food, increment score and regenerate the food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    eatCount += 1; // Increment the eat counter
    if (eatCount === 5) {
      speed += 1; // Increase speed
      eatCount = 0; // Reset the eat counter
    }
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "High Score: " + hiscoreval;
    }
    scoreBox.innerHTML = "Score: " + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y
    });
    generateFood();
  }

  // moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // part 2: Display Render the snake
  // Display Snake
  let board = document.getElementById('board');
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });
  // Displaying the food
  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

function generateFood() {
  let a = 2;
  let b = 16;
  let isFoodOnSnake = true;

  while (isFoodOnSnake) {
    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random())
    };

    isFoodOnSnake = snakeArr.some((segment) => segment.x === food.x && segment.y === food.y);
  }
}

// Main logic
let hiscore = localStorage.getItem("hiscore");
if (hiscore == null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "High Score: " + hiscore;
}
window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  moveSound.play();
  // musicSound.play();
  musicSound.loop = true;
  switch (e.key) {
    case "ArrowUp":
      if (inputDir.y !== 1) {
        inputDir.x = 0;
        inputDir.y = -1;
      }
      break;

    case "ArrowDown":
      if (inputDir.y !== -1) {
        inputDir.x = 0;
        inputDir.y = 1;
      }
      break;

    case "ArrowLeft":
      if (inputDir.x !== 1) {
        inputDir.x = -1;
        inputDir.y = 0;
      }
      break;

    case "ArrowRight":
      if (inputDir.x !== -1) {
        inputDir.x = 1;
        inputDir.y = 0;
      }
      break;

    default:
      break;
  }
});
