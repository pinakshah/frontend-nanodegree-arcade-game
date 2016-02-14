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
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
};

// Handle users inputs to move player left/right/up/down within screen size.
Player.prototype.handleInput = function(control) {
    if(control){
        switch (control) {
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
};

// Reset the player position to reset the game.
Player.prototype.reset = function() {
    this.x = this.initial_x;
    this.y = this.initial_y;
};

// Now instantiate your objects.
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