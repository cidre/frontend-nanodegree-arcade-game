const numRows = 6, numCols = 5;

const cell = {
    width : 101,
    height : 83,
};

const randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomEnemyVelocity = () => randomIntegerInRange(80, 230);

const randomEnemyRow = () => randomIntegerInRange(2, 4);


// Enemies our player must avoid
var Enemy = function(velocity, row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.xVelocity = velocity;
    this.x = - cell.width;
    this.setOnRow(row);
};

Enemy.prototype.setOnRow = function(row) {
    this.y = 0.7 * cell.height + (row - 2 ) * cell.height;
    this.row = row;
}

Enemy.prototype.resetEnemy = function(row) {
    this.x = - cell.width;
    this.xVelocity = randomEnemyVelocity();
    this.setOnRow(randomEnemyRow()); 
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.xVelocity * dt;
    if (this.x > ctx.canvas.width){
        this.resetEnemy();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
    this.sprite = 'images/char-boy.png';
    this.column     = 0;
    this.row        = 0;
    this.columnStep = 0;
    this.rowStep    = 0;
}

Player.prototype.update = function(){
    if (this.columnStep != 0) {
        this.x += this.columnStep * cell.width; 
        this.column +=this.columnStep; 
        this.columnStep = 0;
    }
    
    if (this.rowStep != 0) {
        this.y += this.rowStep * cell.height; 
        this.row += this.rowStep;
        this.rowStep = 0;
    }
        
    if (this.collisionDetected()) { 
        this.resetPosition();
    }    

    if (this.y < 0) {
        this.resetPosition(); 
    }    
}

Player.prototype.collisionDetected = function(){
    for (var i = allEnemies.length - 1; i >= 0; i--) {
        if (allEnemies[i].row === this.row) {
            if (Math.abs(this.x - allEnemies[i].x) < (cell.width / 2)) {
                return true;
            }
        }
    }
    return false;
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key){
    switch (key) {
        case 'left':
            if (this.column > 1) {
                this.columnStep = - 1;
            } 
            break;

        case 'right':
            if (this.column < numCols) { 
                this.columnStep = 1; 
            }
            break;

        case 'up':
            this.rowStep = - 1;
            break;

        case 'down':
            if (this.row < numRows) { 
                this.rowStep = 1;
            }    
            break;
    }
        
}

Player.prototype.resetPosition = function(){
    this.x = 2 * cell.width; 
    this.y = 4.5 * cell.height;
    this.row = 6;
    this.column = 3;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();
player.resetPosition();

var allEnemies = [];
for (var i = 2; i <= 4; i++) {
    allEnemies.push(new Enemy(randomEnemyVelocity(), i));
}
    

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
