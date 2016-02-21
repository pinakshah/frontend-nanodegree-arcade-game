/**
 * @description Game class to manage game information and status
 */
var Game = function() {
    // Status messages
    this.messages = {
        0: 'Congratulations! You win. Play again.',
        1: 'Oops! You lost the game. Try again.',
        2: 'Timeout! You lost the game. Try again.'
    }
    // Game - active /inactive
    this.active = true;
    // total time in seconds
    this.total_time = 120;
    this.current_time = this.total_time;
    this.total_gems = 20;
};

/**
 * @description Stop the game with game status and display result message
 * @parameter: {number} status - status of the game (0-Win, 1-Loose, 2-Timeout)
 */
Game.prototype.stop = function(status) {
    this.active = false;
    drawTitle(ctx, this.messages[status], ctx.canvas.width/2 , 30);
    drawInfo(ctx, 'Enter "SPACE" to restart the game.', ctx.canvas.width/2 , 48);
};

/**
 * @description Reset game information ans status
 */
Game.prototype.reset = function() {
    this.current_time = this.total_time;
    this.active = true;
};

/**
 * @description Update game timing
 */
Game.prototype.start = function() {
    if(!this.active) {
        game.reset();
        allEnemies.forEach(function(enemy) {
            enemy.reset();
        });
        player.reset();
        ctx.clearRect(0, 0, ctx.canvas.width, 50);
    }
};

/**
 * @description Update game timing
 * @parameter: {number} dt - a time delta between ticks
 */
Game.prototype.update = function(dt) {
    this.current_time -= dt;
    // End game if current time is 0 or less than 0
    if(this.active && this.current_time <= 0) {
        this.stop(2);
    }
};

/**
 * @description Draw the game information and status
 */
Game.prototype.render = function() {
    if(this.active) {
        ctx.clearRect(0, 0, ctx.canvas.width, 50);
        drawInfo(ctx, 'Time: ' + secondsToHMS(this.current_time),
            ctx.canvas.width , 48, 'right');
        drawInfo(ctx, 'Score: ' + player.gem_counter + ' / ' + this.total_gems,
            0 , 48, 'left');
    }
};

/**
 * @description Enemies our player must avoid
 */
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
    this.initial_y = (row * 83) - this.top_offset + 50 +
        Math.round((83 - this.height) / 2) ;
    // Variables to manage enemy location
    this.x = this.initial_x;
    this.y = this.initial_y;
    // select random speed for enemy
    this.speed = this.getRandomSpeed();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/**
 * @description Update the enemy's position, required method for game
 * @parameter: {number} dt - a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    if(!game.active) {
        return;
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);
    if(this.x > ctx.canvas.width) {
        // Reset to start position
        this.x = this.initial_x;
        // select random speed for enemy
        this.speed = this.getRandomSpeed();
    }

    // Handles enemy collision with the player
    if(player.hasCollision(this)) {
        game.stop(1); // End game
    }
};

/**
 * @description Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // display enemy area on the canvas with border
    // ctx.strokeRect(this.x + (101 - this.width)/2, this.y + this.top_offset,
    //     this.width, this.height);
};

/**
 * @description Reset the enemy position to reset the game.
 */
Enemy.prototype.reset = function() {
    this.x = this.initial_x;
    this.y = this.initial_y;
    this.speed = this.getRandomSpeed();
};

 /**
 * @description This function is used to get the random speed for the enemy.
 * @returns {number} random speed number for enemy
 */
Enemy.prototype.getRandomSpeed = function() {
    return randomNumber(200) + 20;
};

/**
 * @description Rocks our player must avoid
 */
var Rock = function(row) {
    this.row = row;
    // Position for Rock
    this.top_offset = 66;
    this.side_offset = 7;
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

// Extend enemy object as Rock is kind of enemy and if player collide with it,
// Player will loose the game.
Rock.prototype = Object.create(Enemy.prototype);

/**
 * @description Update the rock's position, required method for game
 * @parameter: {number} dt - a time delta between ticks
 */
Rock.prototype.update = function(dt) {
    if(!game.active) {
        return;
    }

    //Handles rock collision with the player
    if(player.hasCollision(this)) {
        game.stop(1); // End game
    }
};

/**
 * @description Reset the rock position to reset the game.
 */
Rock.prototype.reset = function() {
    this.x = randomNumber(404);
};

// Type of Gem type
var GEM_TYPES = ['Blue', 'Green', 'Orange'];

/**
 * @description Gems our player will collect
 */
var Gem = function() {
    this.row = randomNumber(4);
    this.gem_index = randomNumber(3);
    this.type = GEM_TYPES[this.gem_index];

    // Position for Rock
    this.top_offset = 58;
    this.side_offset = 3;
    // width & height
    this.width = 95;
    this.height = 105;
    // Variables to manage gem location
    this.x = randomNumber(404);
    this.y = (this.row * 83) - this.top_offset + 50;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Gem ' + this.type + '.png';
};

/**
 * @description collect and generate new gem
 */
Gem.prototype.update = function(dt) {
    if(!game.active) {
        return;
    }

    //Handles gem collision with the player
    if(player.hasCollision(this)) {
        gems.splice(gems.indexOf(this), 1);
        // Collect the gem
        ctx.clearRect(this.x, this.y, this.width, this.height);
        // increment the gem counter
        player.gem_counter += 1;
        // Create a new gem.
        gems.push(new Gem());
    }
};

/**
 * @description Draw the gem on the screen, required method for game
 */
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // ctx.strokeRect(this.x + (101 - this.width)/2, this.y + this.top_offset,
    //     this.width, this.height);
};

/**
 * @description Player class
 */
var Player = function() {
    // Image offset
    this.top_offset = 60;
    this.side_offset = 17;
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
    // Movement of player based on the user input
    this.move_x = -1;
    this.move_y = -1;
    // Gem collection count
    this.gem_counter = 0;
    // The image/sprite for our player
    this.sprite = 'images/char-boy.png';
};

/**
 * @description Update the player's position, required method for game
 */
Player.prototype.update = function() {
    if(!game.active) {
        return;
    }
    // Update the player location
    if(this.move_x !== -1) {
        this.x = this.move_x;
        this.move_x = -1;
    }

    if(this.move_y !== -1) {
        this.y = this.move_y;
        this.move_y = -1;
    }

    // Reset the game if player reaches the water & required gems are collected.
    if(this.y === -10 && this.gem_counter >= game.total_gems) {
        game.stop(0);
    }
};

/**
 * @description Draw the player on the screen, required method for game
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // display player area on the canvas with border
    // ctx.strokeRect(this.x + (this.step_x - this.width)/2, this.y + 60,
    //     this.width, this.height);
};

/**
 * @description Handle users inputs to move player left/right/up/down within
 * screen size.
 */
Player.prototype.handleInput = function(control) {
    if(!game.active && !control) {
        return;
    }

    switch (control) {
        case 'space':
            game.start();
            break;
        case 'left':
            this.move_x = (this.x - this.step_x >= 0 ? this.x - this.step_x : -1);
            break;
        case 'up':
            this.move_y = (this.y - this.step_y >= -10 ? this.y - this.step_y : -1);
            break;
        case 'right':
            this.move_x = (this.x + this.step_x < ctx.canvas.width ? this.x
                + this.step_x : -1);
            break;
        case 'down':
            this.move_y = (this.y + this.step_y < 488 ? this.y + this.step_y : -1);
            break;
    }
};

/**
 * @description This function is used to check the collision of the player with
 * enemy, rock and gems. This will check player with single game object and
 * return true if collision occurs otherwise return false.
 * @parameter {object} object - Enemy/Rock/Gem
 * @returns {boolean} true/false - if has collision or not.
 */
Player.prototype.hasCollision = function(object) {
    if (object.x + object.side_offset < this.x + this.width + this.side_offset
        && object.x + object.width + object.side_offset > this.x + this.side_offset
        && object.y < (this.y + this.height - 17)
        && object.y + this.height > this.y) {
            return true;
    }
    return false;
};

/**
 * @description Reset the player position to reset the game.
 */
Player.prototype.reset = function() {
    this.x = this.initial_x;
    this.y = this.initial_y;
    this.gem_counter = 0;
};

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
// Add two gems initially
var gems = [];
gems.push(new Gem());
gems.push(new Gem());

// Place the player object in a variable called player
var player = new Player();

/**
 * @description This listens for key presses and sends the keys to your
 * Player.handleInput() method. You don't need to modify this.
 * collision occurs otherwise return false.
 */
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

/**
 * @description This function is used to get the random number for the
 * provided maximum number
 * @returns {number} random number
 */
function randomNumber(max_number) {
    return Math.floor(Math.random() * max_number);
}

/**
 * @description This function is used to display title text on the canvas.
 * @parameter {context} context of the canvas
 * @parameter {string} text to be displayed
 * @parameter {number} x position
 * @parameter {number} y position
 */
function drawTitle(ctx, text, x, y) {
    ctx.font = '24pt Impact';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.fillText(text, x , y);
    ctx.strokeText(text, x, y);
}

/**
 * @description This function is used to display info text on the canvas.
 * @parameter {context} context of the canvas
 * @parameter {string} text to be displayed
 * @parameter {number} x position
 * @parameter {number} y position
 * @parameter {string} text alignment
 */
function drawInfo(ctx, text, x, y, textAlign) {
    ctx.font = '12pt Arial';
    ctx.textAlign = (textAlign !== '' ? textAlign : 'center');
    ctx.fillStyle = '#000';
    ctx.fillText(text, x , y);
}

/**
 * @description This function is used to convert time in string format(HH:MM:SS)
 * @parameter {number} d
 * @returns {string} string in hh:mm:ss or mm:ss format
 */
function secondsToHMS(d) {
    d = Number(d);
    var h = Math.floor(d / (60 * 60));
    var m = Math.floor(d % (60 * 60) / 60);
    var s = Math.floor(d % (60 * 60) % 60);
    return ((h > 0 ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' +
        (s < 10 ? '0' : '') + s);
}