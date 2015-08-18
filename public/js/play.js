var keys = ['arrow', 'cloud', 'diamond', 'face', 'moon', 'poop', 'ring'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandom(min, max) {
  return (Math.random() * (max - min)) + min;
}

function getRandomValue(arr) {
  return arr[getRandomInt(0, arr.length)];
}

function same(arr) {
  var first = arr[0];
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] != first) {
      return false;
    }
  }
  return true;
}

function clamp(x, min, max) {
  if (x > max) {
    return max;
  } else if (x < min) {
    return min;
  } else {
    return x;
  }
}

var spawnInterval = 1;

var speed = 1500;
var maxSpeed = 5000;
var drag = 0.95;

function Play(phaserGame) {
  this.game = phaserGame;
  this.score = 0;
  this.lastSpawnTime = 0;
  this.bucket = [];
}

Play.prototype.preload = function() {
  this.game.stage.backgroundColor = '#fff';
  this.game.load.image('spaceship', 'images/spaceship.png');
  this.game.load.image('platform', 'images/platform.png');
  this.game.load.image('arrow', 'images/arrow.png');
  this.game.load.image('cloud', 'images/cloud.png');
  this.game.load.image('diamond', 'images/diamond.png');
  this.game.load.image('face', 'images/face.png');
  this.game.load.image('moon', 'images/moon.png');
  this.game.load.image('poop', 'images/poop.png');
  this.game.load.image('ring', 'images/ring.png');
};

Play.prototype.spawnObject = function(x, y, name) {
  var obj = this.objects.create(x, y, name);
  obj.name = name;
  obj.anchor.setTo(0.5, 0.5);
  obj.scale.setTo(0.4, 0.4);
  obj.body.velocity.y = 250;
  return obj;
};

Play.prototype.checkMatch = function() {
  if (this.bucket.length != 3) {
    return;
  }

  console.log(this.bucket);

  if (same(this.bucket)) {
    this.score += 1000;
    this.bucket.length = 0;
  } else {
    this.bucket.shift();
  }
};

Play.prototype.collect = function(player, obj) {
  this.bucket.push(obj.name);
  obj.kill();

  this.checkMatch();

  this.score += 10;
  this.scoreText.text = "Score: " + this.score;
};

Play.prototype.create = function() {
  this.cursors = this.game.input.keyboard.createCursorKeys();

  // The player and its settings
  this.player = this.game.add.sprite(
    this.game.world.width / 2, // Center of canvas
    this.game.world.height - 32, // Bottom of screen
    'spaceship');

  this.player.anchor.setTo(0.5, 0.5); // Move anchor to center
  this.player.scale.setTo(0.4, 0.4); // Scale to 10%
  this.player.rotation = -Math.PI / 2; // Rotate 90deg

  // We need to enable physics on the player
  this.game.physics.arcade.enable(this.player);

  // Player physics properties
  this.player.body.collideWorldBounds = true;

  this.scoreText = this.game.add.text(16, 16, 'score: 0', {
    fontSize: '18px',
    fill: '#333'
  });

  this.objects = this.game.add.group();
  this.objects.enableBody = true;
};

Play.prototype.update = function() {
  // this.game.physics.arcade.collide(this.player, this.objects);
  this.game.physics.arcade.overlap(this.player, this.objects, this.collect, null, this);

  var now = this.game.time.totalElapsedSeconds();
  if (now - this.lastSpawnTime > spawnInterval) {
    this.spawnObject(getRandom(0, this.game.world.width), -8, getRandomValue(keys));
    this.lastSpawnTime = now;
  }

  var x = this.player.body.velocity.x;
  var deltaTime = this.game.time.physicsElapsed;

  if (this.cursors.left.isDown) {
    x -= speed * deltaTime;
  }

  if (this.cursors.right.isDown) {
    x += speed * deltaTime;
  }

  this.player.body.velocity.x = clamp(x * drag, -maxSpeed, maxSpeed);
};
