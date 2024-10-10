document.addEventListener('DOMContentLoaded', function() {
    const gameArena = document.getElementById('game-arena');
    const ArenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = {x:300, y:200}; // {x:15*20, y:10*20} ---> pixel
    let snake = [{x:160, y:200},{x:140, y:200},{x:120, y:200}];  //initial position of snake
    
    let dx = cellSize;
    let dy = 0;

    let intervalId;
    let gameSpeed = 200;

    function moveFood() {
        let newX, newY;

        do {

            newX = Math.floor(Math.random()*30) * cellSize;
            newY = Math.floor(Math.random()*30) * cellSize;

        } while(snake.some(snakeCell => {snakeCell.x === newX && snakeCell.y === newY}));

        food = {x: newX, y: newY}
    }

    function updateSnake() {
        const newHead = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(newHead); //add new head to snake
        if(newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            moveFood();

            if(gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed -= 10;
                gameLoop();
            }

        } else {
            snake.pop(); // remove tail from snake
        }
    }

    function changeDirection(e) {
        console.log("key pressed", e);
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
        if(e.key === "ArrowUp" && !isGoingDown) {
            dx = 0;
            dy = -cellSize;
        } else if(e.key === "ArrowDown" && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if(e.key === "ArrowRight" && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
        else if(e.key === "ArrowLeft" && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        }
    }

    function drawDiv(x,y,className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }


    function drawFoodAndSnake() {
        gameArena.innerHTML = ''; //clear everything and redraw in new positions

        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        });


        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);

    }

    function isGameOver() {
        //snake body collision
        for(let i=1; i<snake.length; i++) {
            if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true;
            }
        }


        //wall collision check
        const hitLeftwall = snake[0].x < 20;
        const hitRightwall = snake[0].x > ArenaSize - 2*cellSize;
        const hitTopwall = snake[0].y < 20;
        const hitDownwall = snake[0].y > ArenaSize - 2*cellSize;

        return hitDownwall || hitLeftwall || hitRightwall || hitTopwall;

    }

    function gameLoop() {
        intervalId = setInterval(() => {
            if(isGameOver()) {
                clearInterval(intervalId);
                alert("Game Over \n Your Score is "+ score);
                return;
            }
            updateSnake();
            drawFoodAndSnake();
            updateScore();
        },gameSpeed);
    }


    function runGame() {
        if(!gameStarted) {
            gameStarted = true;
            document.addEventListener('keydown', changeDirection);
            gameLoop();
        }
    }

    function updateScore() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`
    }

    function gameIntiated() {
        const scoreBoard = document.createElement('div'); // create new div element
        scoreBoard.id = "score-board";
        document.body.insertBefore(scoreBoard,gameArena); //append scoreBoard before gameArena in html

        const startButton = document.createElement('button');
        startButton.textContent = "Start Game"; //set button content
        startButton.classList = "start-button"; //add class to button

        startButton.addEventListener('click', function startGame() {
            startButton.style.display = 'none';  //hide start button
            runGame();
        });
        
        document.body.appendChild(startButton);

    }

    gameIntiated();


});