var scoreText;
var platforms;
var items;
var rings;
var cursors;
var score = 0;
var itemArr = ['arrow', 'diamond', 'face', 'moon', 'poop', 'ring'];
var gameEl = document.getElementById('game');
var scaleRatio = window.devicePixelRatio / 3;

var killEnemy = function() {
  this.kill();
  score += this.score;
  scoreText.text = 'Score: ' + score;
}

var createEnemys = function(group, total) {
  var row = 10;
  var padding = 2;
  var offset = gameEl.innerWidth / (row + padding); // enemys per row + padding
  var xPos, yPos;

  for (var i = 0; i < total; i++) {

    xPos = (i % row) * offset + offset;
    yPos = (i % row == 1) ? yPos + offset : yPos;

    var item = group.create(xPos, yPos, 'face');
    item.width = offset;
  }
};

var preload = function() {
  game.stage.backgroundColor = '#fff';
  game.load.image('spaceship', 'images/spaceship.png');
  game.load.image('platform', 'images/platform.png');
  game.load.image('arrow', 'images/arrow.png');
  game.load.image('cloud', 'images/cloud.png');
  game.load.image('diamond', 'images/diamond.png');
  game.load.image('face', 'images/face.png');
  game.load.image('moon', 'images/moon.png');
  game.load.image('poop', 'images/poop.png');
  game.load.image('ring', 'images/ring.png');
}

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var create = function() {
  platforms = game.add.group();
  platforms.enableBody = true;

  items = game.add.group();

  var row = 5;
  var padding = 2;
  var offset = game.width / (row + padding); // enemys per row + padding
  var xPos, yPos = 0;
  var item, sprite;

  for (var i = 0; i < 12; i++) {
    sprite = itemArr[getRandomInt(0, itemArr.length)];

    xPos = (i % row) * offset + offset;
    yPos = (i % row == 0) ? yPos + offset : yPos;

    item = items.create(xPos, yPos, sprite);
    item.width = offset - 5;
    item.height = offset - 5;

    console.log(game.width, item.width, xPos, yPos);
  }

  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '18px', fill: '#333' });
}

var update = function() {

}

var game = new Phaser.Game(
  300, // * window.devicePixelRatio,
  450, // * window.devicePixelRatio,
  Phaser.CANVAS,
  'game',
  {
    preload: preload,
    create: create,
    update: update
  }
);