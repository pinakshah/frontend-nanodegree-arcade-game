// Enemies our player must avoid
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // Initial location
    this.initial_x = -101;
    // Variables to manage enemy location
    this.x = this.initial_x;
    this.y = row * 83;
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
    this.x = this.start_x;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Initial location
    this.start_x = 202;
    this.start_y = (5 * 83);
    // Variables to manage enemy location
    this.x = this.start_x;
    this.y = this.start_y;
    this.step_x = 101;
    this.step_y = 83;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
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
    return randomNumber(100) + 20;
}

// This function is used to get the random number for the
// provided maximum number
function randomNumber(max_number) {
    return Math.floor(Math.random() * max_number);
}