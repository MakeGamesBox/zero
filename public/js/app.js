var game = new Phaser.Game(300, 450, Phaser.CANVAS, 'game');
game.state.add("play", new Play(game));
game.state.start("play");
