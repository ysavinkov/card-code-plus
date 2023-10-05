import io from 'socket.io-client';
import Card from '../helpers/card';
import Dealer from '../helpers/dealer';
import Zone from '../helpers/zone';

const PORT = process.env.PORT || 3000;

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game',
        });
    }

    preload() {
        this.load.image('avatar', 'src/assets/sticker.webp');
        this.load.spritesheet('cards', 'src/assets/cards.png', {
            frameWidth: 354.6,
            frameHeight: 497,
        });
    }

    create() {
        this.cameras.main.setBackgroundColor('#008080');

        this.scale.displaySize.setAspectRatio(this.game.config.width / this.game.config.height);
        this.scale.refresh();

        this.roomID;
        this.isPlayerA = false;
        this.isYourTurn;
        this.allCards = [];
        this.opponentBacks = [];
        this.yourCards = {};
        this.timesPressed;

        this.blueName;
        this.blueCode = 0;
        this.blueBugs = 0;
        this.blueEnergy = 7;

        this.redName;
        this.redCode = 0;
        this.redBugs = 0;
        this.redEnergy = 7;

        this.add.image(155, 620, 'avatar').setScale(0.4, 0.4);
        this.yourNameLabel = this.add.text(70, 480, '').setFontSize(24).setFontFamily('Trebuchet MS');

        this.add.image(1380, 100, 'avatar').setScale(0.4, 0.4);

        this.opponentNameLabel = this.add.text(1300, 220, '').setFontSize(24).setFontFamily('Trebuchet MS');

        // your energy bar
        this.yourEnergyBox = this.add.graphics();
        this.yourEnergyBarBack = this.add.graphics();
        this.yourEnergyBar = this.add.graphics();
        this.yourEnergyTiles = [];

        for (let i = 0; i <= 7; i++) {
            this.yourEnergyTiles[i] = this.add.graphics();
            this.yourEnergyTiles[i].fillStyle(0xc0c0c0, 1);
            this.yourEnergyTiles[i].fillRect(10, 705 - i * 35, 30, 10);
        }

        this.yourEnergyBox.fillStyle(0xc0c0c0, 1);
        this.yourEnergyBox.fillRect(0, 715, 50, -255);

        this.yourEnergyBarBack.clear();
        this.yourEnergyBarBack.fillStyle(0x000000, 1);
        this.yourEnergyBarBack.fillRect(10, 715, 30, -(35 * 7));

        this.yourEnergyBar.clear();
        this.yourEnergyBar.fillStyle(0x66ff00, 1);

        // your code bar
        this.yourCodesBox = this.add.graphics();
        this.yourCodesBarBack = this.add.graphics();
        this.yourCodesBar = this.add.graphics();
        this.yourCodesBarLabel = this.add.text(1415, 573, `0% code`).setFontSize(22).setFontFamily('Trebuchet MS').setColor('#000000');

        this.yourCodesBox.fillStyle(0xc0c0c0, 1);
        this.yourCodesBox.fillRect(1200, 560, 320, 50);

        this.yourCodesBarBack.clear();
        this.yourCodesBarBack.fillStyle(0x000000, 1);
        this.yourCodesBarBack.fillRect(1210, 570, 200, 30);

        this.yourCodesBar.clear();
        this.yourCodesBar.fillStyle(0xadd8e6, 1);

        // your bugs bar
        this.yourBugsBox = this.add.graphics();
        this.yourBugsBarBack = this.add.graphics();
        this.yourBugsBar = this.add.graphics();
        this.yourBugsBarLabel = this.add.text(1415, 653, `0% bugs`).setFontSize(22).setFontFamily('Trebuchet MS').setColor('#000000');

        this.yourBugsBox.fillStyle(0xc0c0c0, 1);
        this.yourBugsBox.fillRect(1200, 640, 320, 50);

        this.yourBugsBarBack.clear();
        this.yourBugsBarBack.fillStyle(0x000000, 1);
        this.yourBugsBarBack.fillRect(1210, 650, 200, 30);

        // opponent energy bar
        this.opponentEnergyBox = this.add.graphics();
        this.opponentEnergyBarBack = this.add.graphics();
        this.opponentEnergyBar = this.add.graphics();
        this.opponentEnergyTiles = [];

        for (let i = 0; i <= 7; i++) {
            this.opponentEnergyTiles[i] = this.add.graphics();
            this.opponentEnergyTiles[i].fillStyle(0xc0c0c0, 1);
            this.opponentEnergyTiles[i].fillRect(1486, 0 + i * 35, 50, 10);
        }

        this.opponentEnergyBox.fillStyle(0xc0c0c0, 1);
        this.opponentEnergyBox.fillRect(1486, 0, 50, 245);

        this.opponentEnergyBarBack.clear();
        this.opponentEnergyBarBack.fillStyle(0x000000, 1);
        this.opponentEnergyBarBack.fillRect(1496, 10, 30, 35 * 7);

        this.opponentEnergyBar.clear();
        this.opponentEnergyBar.fillStyle(0x66ff00, 1);

        // opponent code bar
        this.opponentCodesBox = this.add.graphics();
        this.opponentCodesBarBack = this.add.graphics();
        this.opponentCodesBar = this.add.graphics();
        this.opponentCodesBarLabel = this.add.text(240, 40, `0% code`).setFontSize(22).setFontFamily('Trebuchet MS').setColor('#000000');

        this.opponentCodesBox.fillStyle(0xc0c0c0, 1);
        this.opponentCodesBox.fillRect(25, 25, 320, 50);

        this.opponentCodesBarBack.clear();
        this.opponentCodesBarBack.fillStyle(0x000000, 1);
        this.opponentCodesBarBack.fillRect(35, 35, 200, 30);

        this.opponentCodesBar.clear();
        this.opponentCodesBar.fillStyle(0xadd8e6, 1);

        // opponent bugs bar
        this.opponentBugsBox = this.add.graphics();
        this.opponentBugsBarBack = this.add.graphics();
        this.opponentBugsBar = this.add.graphics();
        this.opponentBugsBarLabel = this.add.text(240, 120, `0% bugs`).setFontSize(22).setFontFamily('Trebuchet MS').setColor('#000000');

        this.opponentBugsBox.fillStyle(0xc0c0c0, 1);
        this.opponentBugsBox.fillRect(25, 105, 320, 50);

        this.opponentBugsBarBack.clear();
        this.opponentBugsBarBack.fillStyle(0x000000, 1);
        this.opponentBugsBarBack.fillRect(35, 115, 200, 30);

        this.opponentBugsBar.clear();
        this.opponentBugsBar.fillStyle(0xadd8e6, 1);

        this.zone = new Zone(this);

        // Render the drop zones and outlines
        const { playerDropZone, opponentDropZone } = this.zone.renderZone();
        this.playerDropZone = playerDropZone;
        this.opponentDropZone = opponentDropZone;

        this.backgroundPlayer = this.zone.renderBackground(this.playerDropZone, 0xf5f5f5);
        this.backgroundOpponent = this.zone.renderBackground(this.opponentDropZone, 0xf5f5f5);

        // Render the outlines for second player
        this.outlinePlayer = this.zone.renderOutline(this.playerDropZone, 0xc0c0c0);
        this.outlineOpponent = this.zone.renderOutline(this.opponentDropZone, 0xc0c0c0);

        this.playerCardsGroup = this.add.group();
        this.opponentCardsGroup = this.add.group();

        this.dealer = new Dealer(this);

        let self = this;

        this.socket = io(`http://localhost:${PORT}`, { transports: ['websocket'] });

        this.socket.on('connection', () => {
            console.log('Connected!');
        });

        this.socket.on('isPlayerA', () => {
            self.isPlayerA = true;
        });

        this.socket.on('setRoomId', (roomID) => {
            self.roomID = roomID;
            // self.roomLabel.setText(self.roomID);
        });

        this.socket.on('setCards', (cards) => {
            self.allCards = cards;
            self.timesPressed = 0;
            // setting backs
            for (let i = 0; i < 5; i++) {
                let opponentCard = new Card(self);
                opponentCard = opponentCard.render(475 + i * 150, 80, 'cards', 0.3, 14).disableInteractive();
                self.opponentBacks[i] = opponentCard;
            }
            // filling energy bars
            this.yourEnergyBar.fillRect(10, 715, 30, -(35 * 7));
            this.opponentEnergyBar.fillRect(1496, 10, 30, 35 * 7);
        });
        this.socket.on('setNames', (names) => {
            self.blueName = names[0];
            self.redName = names[1];
            if (self.blueName === self.redName) {
                self.isYourTurn = false;
                alert("You can't play versus yourself!");
                self.socket.emit('endGame', '');
            }
            if (self.isPlayerA) {
                self.yourNameLabel.setText(self.blueName).setColor('#add8e6');
                self.opponentNameLabel.setText(self.redName).setColor('#ff69b4');
            } else {
                self.yourNameLabel.setText(self.redName).setColor('#ff69b4');
                self.opponentNameLabel.setText(self.blueName).setColor('#add8e6');
            }
            console.log(` red: ${self.redName}\n blue: ${self.blueName}\n `);
        });

        this.socket.on('dealCards', () => {
            self.dealer.dealCards();
        });

        this.socket.on('updateTurn', (turn) => {
            self.endRound.setText('End Round');
            self.isYourTurn = turn;
            if (self.isYourTurn) {
                self.infoLabel.setText('Your Turn');
                self.endRound.setColor('#00ffff').setInteractive();
            } else {
                self.infoLabel.setText("Opponent's Turn");
                self.endRound.setColor('#c0c0c0').disableInteractive();
            }
        });

        this.socket.on('endRound', (timesPressed) => {
            // logic for ending turn
            self.timesPressed = timesPressed;
            if (self.isYourTurn) {
                self.wantsToEndRound.setText('Opponent pressed "End Round"!');
            }
            if (self.timesPressed == 2) {
                self.wantsToEndRound.setText('');
                self.blueEnergy = 7;
                self.redEnergy = 7;

                self.yourEnergyBar.fillRect(10, 715, 30, -(35 * self.blueEnergy));
                self.opponentEnergyBar.fillRect(1495, 10, 30, 35 * self.redEnergy);

                let diff;
                if (self.redCode > 75 && self.redBugs > 25) {
                    diff = self.redCode - 75;
                    self.redBugs -= diff;
                    self.redCode = 75;
                }
                if (self.redBugs > 25) {
                    diff = self.redBugs - 25;
                    self.redCode -= diff;
                    self.redBugs = 25;
                }

                if (self.blueCode > 75 && self.blueBugs > 25) {
                    diff = self.blueCode - 75;
                    self.blueBugs -= diff;
                    self.blueCode = 75;
                }

                if (self.blueBugs > 25) {
                    diff = self.blueBugs - 25;
                    self.blueCode -= diff;
                }

                if (self.blueCode < 0) {
                    self.blueCode = 0;
                }
                if (self.blueBugs < 0) {
                    self.blueBugs = 0;
                }

                if (self.redCode < 0) {
                    self.redCode = 0;
                }
                if (self.redBugs < 0) {
                    self.redBugs = 0;
                }

                if (self.blueCode > 100) {
                    self.blueCode = 100;
                }
                if (self.blueBugs > 100) {
                    self.blueBugs = 100;
                }

                if (self.redCode > 100) {
                    self.redCode = 100;
                }
                if (self.redBugs > 100) {
                    self.redBugs = 100;
                }

                updateProgressBars();

                if (self.blueCode === 100 && self.redCode === 100) {
                    alert('Friendship wins! (Tie)');
                    self.socket.emit('endGame', '');
                }
                if (self.blueCode === 100) {
                    // TODO: replace with username from db
                    alert(`${self.blueName} wins!`);
                    self.socket.emit('endGame', self.blueName);
                }
                if (self.redCode === 100) {
                    // TODO: replace with username from db
                    alert(`${self.redName} wins!`);
                    self.socket.emit('endGame', self.redName);
                }

                // console.log(`End
                // blue code : ${self.blueCode}\n
                // blue bugs : ${self.blueBugs}\n
                // blue energy : ${self.blueEnergy}\n
                // red code : ${self.redCode}\n
                // red bugs : ${self.redBugs}\n
                // red energy : ${self.redEnergy}\n`);

                if (self.blueBugs > 25 && self.blueCode > 50) {
                    diff = self.blueCode - self.blueBugs;
                    self.blueCode -= diff;

                    self.playerCardsGroup.clear(true, true);
                    self.opponentCardsGroup.clear(true, true);

                    self.socket.emit('dealCards');
                }
            }
        });

        this.socket.on('playerLeft', () => {
            self.isYourTurn = false;
            self.infoLabel.setText('The second player has left');
        });

        this.socket.on('endGame', (dest) => {
            console.log('dest:' + dest);
            window.location.href = dest;
        });

        this.socket.on('cardPlayed', (index, pos, isPlayerA) => {
            if (isPlayerA !== self.isPlayerA) {
                self.opponentBacks[pos].visible = false;

                self.opponentDropZone.data.values.cards++;
                changeParam(index, !self.isPlayerA);
                let cardObject = new Card(self);

                cardObject = cardObject
                    .render(
                        self.opponentDropZone.x - 450 + self.opponentDropZone.data.values.cards * 150,
                        self.opponentDropZone.y,
                        'cards',
                        0.3,
                        index
                    )
                    .disableInteractive();

                self.opponentCardsGroup.add(cardObject);
            }
        });

        this.infoLabel = this.add
            .text(25, 350, 'Waiting for the second player...')
            .setFontSize(24)
            .setFontFamily('Trebuchet MS')
            .setColor('#c0c0c0');

        this.endRound = this.add.text(1350, 350, '').setFontSize(24).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.wantsToEndRound = this.add.text(1185, 450, '').setFontSize(24).setFontFamily('Trebuchet MS').setColor('#00ffff');

        this.wantsToEndRound = this.add.text(1185, 450, '').setFontSize(24).setFontFamily('Trebuchet MS').setColor('#00ffff');

        this.endRound.on('pointerdown', () => {
            if (self.isYourTurn) {
                self.socket.emit('updateTurn', self.isYourTurn);
                self.socket.emit('endRound', self.timesPressed);
            }
        });

        this.endRound.on('pointerover', () => {
            self.endRound.setColor('#ff69b4');
        });

        this.endRound.on('pointerout', () => {
            self.endRound.setColor('#00ffff');
        });

        this.input.on('drag', (pointer, cardObject, dragX, dragY) => {
            if (self.isYourTurn) {
                cardObject.x = dragX;
                cardObject.y = dragY;
            }
        });

        this.input.on('dragstart', (pointer, cardObject) => {
            if (self.isYourTurn) {
                cardObject.setTint(0xc0c0c0);
                self.children.bringToTop(cardObject);
            }
        });

        this.input.on('dragend', (pointer, cardObject, dropped) => {
            cardObject.setTint();
            if (!dropped) {
                cardObject.x = cardObject.input.dragStartX;
                cardObject.y = cardObject.input.dragStartY;
            }
        });

        this.input.on('drop', function (pointer, cardObject, dropZone) {
            let energy = self.redEnergy;
            let selfHarm = false;
            if (self.allCards[cardObject.index].attributes.target == 'user') {
                selfHarm = true;
            }
            if (self.isPlayerA) {
                energy = self.blueEnergy;
            }

            // console.log(
            //     'Energy: ' +
            //         energy +
            //         ' self.allCards' +
            //         self.allCards[cardObject.index].attributes.energy +
            //         ' selfHarm ' +
            //         selfHarm +
            //         '\n'
            // );
            cardObject.setTint();
            if (
                dropZone === self.opponentDropZone ||
                !self.isYourTurn ||
                (selfHarm && energy + self.allCards[cardObject.index].attributes.energy < 0)
            ) {
                cardObject.x = cardObject.input.dragStartX;
                cardObject.y = cardObject.input.dragStartY;
                return;
            }

            self.playerDropZone.data.values.cards++;

            cardObject.x = dropZone.x - 450 + dropZone.data.values.cards * 150;
            cardObject.y = dropZone.y;

            cardObject.disableInteractive();
            self.playerCardsGroup.add(cardObject);
            self.yourCards[cardObject.position] = false;
            changeParam(cardObject.index, self.isPlayerA);
            self.socket.emit('cardPlayed', cardObject.index, cardObject.position, self.isPlayerA);

            if (!self.timesPressed) {
                self.socket.emit('updateTurn', self.isYourTurn);
            }

            if (self.playerDropZone.data.values.cards == 5) {
                self.socket.emit('updateTurn', self.isYourTurn);
                self.socket.emit('endRound', self.timesPressed);
            }
        });

        function changeParam(index, playerA) {
            //for(let i = 0; i < self.allCards.length; i++){
            //    console.log('card['+i+']:' + self.allCards[i].attributes.name + '\n');
            //}
            // console.log('card:' + self.allCards[index].attributes.name + '\n');
            let target, oppositeTarget;
            if (playerA) {
                target = 'user';
                oppositeTarget = 'enemy';
            } else {
                target = 'enemy';
                oppositeTarget = 'user';
            }

            if (self.allCards[index].attributes.target == target || self.allCards[index].attributes.target == 'all') {
                self.blueCode += self.allCards[index].attributes.codes;
                self.blueBugs += self.allCards[index].attributes.bugs;
                self.blueEnergy += self.allCards[index].attributes.energy;
            }
            if (self.allCards[index].attributes.target == oppositeTarget || self.allCards[index].attributes.target == 'all') {
                self.redCode += self.allCards[index].attributes.codes;
                self.redBugs += self.allCards[index].attributes.bugs;
                self.redEnergy += self.allCards[index].attributes.energy;
            }

            if (self.blueCode < 0) {
                self.blueCode = 0;
            }
            if (self.blueBugs < 0) {
                self.blueBugs = 0;
            }
            if (self.blueEnergy < 0) {
                self.blueEnergy = 0;
            }

            if (self.redCode < 0) {
                self.redCode = 0;
            }
            if (self.redBugs < 0) {
                self.redBugs = 0;
            }
            if (self.redEnergy < 0) {
                self.redEnergy = 0;
            }

            if (self.blueCode > 100) {
                self.blueCode = 100;
            }
            if (self.blueBugs > 100) {
                self.blueBugs = 100;
            }
            if (self.blueEnergy > 7) {
                self.blueEnergy = 7;
            }
            if (self.redCode > 100) {
                self.redCode = 100;
            }
            if (self.redBugs > 100) {
                self.redBugs = 100;
            }
            if (self.redEnergy > 7) {
                self.redEnergy = 7;
            }

            // console.log(`
            //     blue code : ${self.blueCode}\n
            //     blue bugs : ${self.blueBugs}\n
            //     blue energy : ${self.blueEnergy}\n
            //     red code : ${self.redCode}\n
            //     red bugs : ${self.redBugs}\n
            //     red energy : ${self.redEnergy}\n`);

            updateProgressBars();

            //self.allCards[index];
        }

        function updateProgressBars() {
            self.yourEnergyBar.clear();
            self.yourEnergyBar.fillStyle(0x66ff00, 1);

            self.opponentEnergyBar.clear();
            self.opponentEnergyBar.fillStyle(0x66ff00, 1);

            self.yourCodesBar.clear();
            self.yourCodesBar.fillStyle(0xadd8e6, 1);

            self.opponentCodesBar.clear();
            self.opponentCodesBar.fillStyle(0xadd8e6, 1);

            self.yourBugsBar.clear();
            self.yourBugsBar.fillStyle(0xff69b4, 1);

            self.opponentBugsBar.clear();
            self.opponentBugsBar.fillStyle(0xff69b4, 1);

            // console.log(self.blueCode);
            // console.log(self.redCode);
            if (self.isPlayerA) {
                self.yourEnergyBar.fillRect(10, 715, 30, -(35 * self.blueEnergy));
                self.opponentEnergyBar.fillRect(1496, 10, 30, 35 * self.redEnergy);

                self.yourCodesBar.fillRect(1210, 570, 2 * self.blueCode, 30);
                self.yourCodesBarLabel.setText(`${self.blueCode}% code`);

                self.opponentCodesBar.fillRect(35, 35, 2 * self.redCode, 30);
                self.opponentCodesBarLabel.setText(`${self.redCode}% code`);

                self.yourBugsBar.fillRect(1210, 650, 2 * self.blueBugs, 30);
                self.yourBugsBarLabel.setText(`${self.blueBugs}% bugs`);

                self.opponentBugsBar.fillRect(35, 115, 2 * self.redBugs, 30);
                self.opponentBugsBarLabel.setText(`${self.redBugs}% bugs`);
            } else {
                self.yourEnergyBar.fillRect(10, 715, 30, -(35 * self.redEnergy));
                self.opponentEnergyBar.fillRect(1496, 10, 30, 35 * self.blueEnergy);

                self.yourCodesBar.fillRect(1210, 570, 2 * self.redCode, 30);
                self.yourCodesBarLabel.setText(`${self.redCode}% code`);

                self.opponentCodesBar.fillRect(35, 35, 2 * self.blueCode, 30);
                self.opponentCodesBarLabel.setText(`${self.blueCode}% code`);

                self.yourBugsBar.fillRect(1210, 650, 2 * self.redBugs, 30);
                self.yourBugsBarLabel.setText(`${self.redBugs}% bugs`);

                self.opponentBugsBar.fillRect(35, 115, 2 * self.blueBugs, 30);
                self.opponentBugsBarLabel.setText(`${self.blueBugs}% bugs`);
            }
        }
    }

    update() {}
}
