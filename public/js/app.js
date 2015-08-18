var game = new Phaser.Game(600, 800, Phaser.CANVAS, 'game');
game.state.add("play", new Play(game));
game.state.start("play");
