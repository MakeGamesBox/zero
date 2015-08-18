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
  this.duration = 30;
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

  if (same(this.bucket)) {
    this.duration += 10;
    this.score += 1000;
    this.bucket.length = 0;
  } else {
    this.bucket.pop();
  }
};

Play.prototype.updateHUD = function() {
  this.hud.forEach(function(obj) {
    obj.kill();
  });

  var startX = this.game.world.width / 2 - 100;
  for (var i = this.bucket.length - 1; i >= 0; i--) {
    var obj = this.hud.create(
      startX + (i * 100),
      this.game.world.height - 32,
      this.bucket[i]);
    obj.anchor.setTo(0.5, 0.5);
    obj.scale.setTo(0.2, 0.2);
  }
};

Play.prototype.collect = function(player, obj) {
  this.bucket.unshift(obj.name);
  obj.kill();

  this.updateHUD();
  this.checkMatch();

  this.score += 10;
  this.scoreText.text = "Score: " + this.score;
};

Play.prototype.create = function() {
  this.cursors = this.game.input.keyboard.createCursorKeys();

  // The player and its settings
  this.player = this.game.add.sprite(
    this.game.world.width / 2, // Center of canvas
    this.game.world.height - 64, // Bottom of screen
    'spaceship');

  this.player.anchor.setTo(0.5, 0.5); // Move anchor to center
  this.player.scale.setTo(0.3, 0.3); // Scale to 10%
  this.player.rotation = -Math.PI / 2; // Rotate 90deg

  // We need to enable physics on the player
  this.game.physics.arcade.enable(this.player);

  // Player physics properties
  this.player.body.collideWorldBounds = true;

  this.scoreText = this.game.add.text(16, 16, 'Score: 0', {
    fontSize: '18px',
    fill: '#333'
  });

  this.countdownText = this.game.add.text(this.game.world.width - 16, 16, 'Countdown: 0', {
    align: 'right',
    fontSize: '18px',
    fill: '#333'
  });
  this.countdownText.anchor.setTo(1.0, 0.0); // Move anchor to center

  this.startTime = this.game.time.totalElapsedSeconds();

  this.objects = this.game.add.group();
  this.objects.enableBody = true;

  this.hud = this.game.add.group();
};

Play.prototype.update = function() {
  // this.game.physics.arcade.collide(this.player, this.objects);
  this.game.physics.arcade.overlap(this.player, this.objects, this.collect, null, this);

  var now = this.game.time.totalElapsedSeconds();

  var countdown = Math.floor(this.duration - now);
  this.countdownText.text = "Countdown: " + countdown;

  if (now - this.lastSpawnTime > spawnInterval) {
    this.spawnObject(getRandom(0, this.game.world.width), -8, getRandomValue(keys));
    this.lastSpawnTime = now;
  }

  var xVel = this.player.body.velocity.x;
  var yVel = this.player.body.velocity.y;
  var deltaTime = this.game.time.physicsElapsed;

  if (this.cursors.left.isDown) {
    xVel -= speed * deltaTime;
  }

  if (this.cursors.right.isDown) {
    xVel += speed * deltaTime;
  }

  if (this.cursors.up.isDown) {
    yVel -= speed * deltaTime;
  }

  if (this.cursors.down.isDown) {
    yVel += speed * deltaTime;
  }

  this.player.body.velocity.x = xVel * drag;
  this.player.body.velocity.y = yVel * drag;

  this.objects.forEach(function(obj) {
    if (!obj.inWorld) {
      obj.kill();
    }
  });

  var toDestroy = [];
  this.objects.forEachDead(function(obj) {
    toDestroy.push(obj);
  });

  var i = toDestroy.length - 1;
  while (i >= 0) {
    toDestroy[i].destroy();
    i--;
  }
};
