import Phaser from 'phaser';
import Game from './scenes/game';

const config = {
    type: Phaser.AUTO,
    scale: {
<<<<<<< HEAD
        mode: Phaser.Scale.FIT,
=======
        mode: Phaser.Scale.STRETCH,
>>>>>>> refs/remotes/origin/kontakt1
        parent: 'card-code-plus',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
    },
    scene: [Game],
};

const game = new Phaser.Game(config);
