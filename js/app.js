var Game = function() {
    this.active = true;
}

Game.prototype.stop = function() {
    this.active = false;
}

Game.prototype.start = function() {
    this.active = true;
}


// Enemies our player must avoid
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // Image offset
    this.top_offset = 76;
    this.side_offset = 2;
    // Width and height of enemy
    this.width = 97;
    this.height = 70;
    // Initial location
    this.initial_x = -101;
    this.initial_y = (row * 83) - this.top_offset + 50 + Math.round((83 - this.height) / 2) ;
    // Variables to manage enemy location
    this.x = this.initial_x;
    this.y = this.initial_y;
    // select random speed for enemy
    this.speed = randomSpeed();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(!game.active) {
        return;
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);
    if(this.x > ctx.canvas.width){
        // Reset to start position
        this.x = this.initial_x;
        // select random speed for enemy
        this.speed = randomSpeed();
    }

    // Handles enemy collision with the player
    if (this.x + this.side_offset - player.side_offset < player.x + player.width
        && this.x + this.width + this.side_offset > player.x + player.side_offset
        && this.y < (player.y + player.height - 17)
        && this.y + this.height > player.y) {
        // The objects are touching
        endGame(0);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // display enemy area on the canvas with border
    //ctx.strokeRect(this.x + (101 - this.width)/2, this.y + this.top_offset, this.width, this.height);
};

// Reset the enemy position to reset the game.
Enemy.prototype.reset = function() {
    this.x = this.initial_x;
    this.y = this.initial_y;
};

// Rocks our player must avoid
var Rock = function(row) {
    // Position for Rock
    this.top_offset = 66;
    this.side_offset = 6;
    // width & height
    this.width = 88;
    this.height = 88;
    // Variables to manage rock location
    this.x = randomNumber(404);
    this.y = (row * 83) - this.top_offset + 50;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Rock.png';
};

Rock.prototype = Object.create(Enemy.prototype);

// Update the rock's position, required method for game
// Parameter: dt, a time delta between ticks
Rock.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //Handles rock collision with the player
    if (this.x + this.side_offset - player.side_offset < player.x + player.width
        && this.x + this.width + this.side_offset > player.x + player.side_offset
        && this.y < (player.y + player.height - 17)
        && this.y + this.height > player.y) {
        // The objects are touching
        endGame(0);
    }
};

// Reset the rock position to reset the game.
Rock.prototype.reset = function() {
    this.x = randomNumber(404);
};

// Player class
var Player = function() {
    // Image offset
    this.top_offset = 60;
    this.side_offset = 15;
    // width & height of the player
    this.width = 70;
    this.height = 81;
    // Initial location
    this.initial_x = 202;
    this.initial_y = (5 * 83)- this.top_offset + 50;
    // Variables to manage player location
    this.x = this.initial_x;
    this.y = this.initial_y;
    this.step_x = 101;
    this.step_y = 83;
    // The image/sprite for our player
    this.sprite = "images/char-boy.png";
};

// Update the player's position, required method for game
Player.prototype.update = function() {
    // TODO update the player location

    // TODO Handles collision with the Enemies
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // display player area on the canvas with border
    //ctx.strokeRect(this.x + (this.step_x - this.width)/2, this.y + 60, this.width, this.height);
};

// Handle users inputs to move player left/right/up/down within screen size.
Player.prototype.handleInput = function(control) {
    if(control){
        switch (control) {
            case 'space':
                restartGame();
                break;
            case 'left':
                this.x = (this.x - this.step_x >= 0 ? this.x - this.step_x : this.x);
                break;
            case 'up':
                this.y = (this.y - this.step_y >= -10 ? this.y - this.step_y : this.y);
                break;
            case 'right':
                this.x = (this.x + this.step_x < ctx.canvas.width ? this.x + this.step_x : this.x);
                break;
            case 'down':
                this.y = (this.y + this.step_y < 488 ? this.y + this.step_y : this.y);
                break;
        }
    }
    // Reset the game if player reaches the water
    if(this.y === -10){
        endGame(1);
    }
};

// Reset the player position to reset the game.
Player.prototype.reset = function() {
    this.x = this.initial_x;
    this.y = this.initial_y;
};

// Now instantiate your objects.
// Initiate game
var game = new Game();
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
allEnemies.push(new Enemy(1));
allEnemies.push(new Enemy(2));
allEnemies.push(new Enemy(3));
allEnemies.push(new Rock(4));
allEnemies.push(new Rock(0));
setTimeout(function() {
    allEnemies.push(new Enemy(1));
    allEnemies.push(new Enemy(2));
    allEnemies.push(new Enemy(3));
}, 3000);

// Place the player object in a variable called player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// This function is used to get the random speed for the enemy.
function randomSpeed() {
    return randomNumber(200) + 20;
}

// This function is used to get the random number for the
// provided maximum number
function randomNumber(max_number) {
    return Math.floor(Math.random() * max_number);
}

// This function is called when the player reaches the water.
// It will reset the player position as well as all enemies position.
function restartGame() {
    if(!game.active){
        game.start();
        player.reset();
        allEnemies.forEach(function(enemy) {
            enemy.reset();
        });
        ctx.clearRect(0, 0, ctx.canvas.width, 50);
    }
}

// This function is called when the player reaches the water.
// It will freeze the player position as well as all enemies position.
function endGame(status) {
    game.stop();
    if(status === 1){
        drawTitle(ctx, "Cogrates! You win. Play again.", ctx.canvas.width/2 , 32);
    }else {
        drawTitle(ctx, "Opps! You lost the game. Try again.", ctx.canvas.width/2 , 32);
    }
    drawInfo(ctx, "Enter 'SPACE' to restart the game.", ctx.canvas.width/2 , 48);
}

function drawTitle(ctx, text, x, y){
    ctx.font = "24pt Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.fillText(text, x , y);
    ctx.strokeText(text, x, y);
}

function drawInfo(ctx, text, x, y){
    ctx.font = "12pt Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.fillText(text, x , y);
}