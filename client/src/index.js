import Phaser from 'phaser';
import Game from './scenes/game';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'card-code-plus',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
    },
    scene: [Game],
};

const game = new Phaser.Game(config);
