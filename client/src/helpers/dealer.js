import Card from './card';

let weights = [0.075, 0.075, 0.1, 0.05, 0.1, 0.05, 0.1, 0.05, 0.075, 0.1, 0.075, 0.1, 0.025, 0.025]; // probabilities
let results = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // values to return

function getRandom() {
    let num = Math.random(),
        s = 0,
        lastIndex = weights.length - 1;

    for (let i = 0; i < lastIndex; ++i) {
        s += weights[i];
        if (num < s) {
            return results[i];
        }
    }

    return results[lastIndex];
}

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            for (let i = 0; i < 5; i++) {
                if (scene.yourCards[i] !== true) {
                    let playerCard = new Card(scene);
                    let cardIndex = getRandom();
                    playerCard = playerCard.render(475 + i * 150, 625, 'cards', 0.3, cardIndex);
                    playerCard.position = i;
                    scene.yourCards[i] = true;
                }
                scene.opponentBacks[i].visible = true;
            }
        };
    }
}

// import Card from './card';

// function getRandomInt(max) {
//     max = Math.floor(max);
//     return Math.floor(Math.random() * max);
// }

// export default class Dealer {
//     constructor(scene) {
//         this.dealCards = () => {
//             for (let i = 0; i < 5; i++) {
//                 if (scene.yourCards[i] !== true) {
//                     let playerCard = new Card(scene);
//                     let cardIndex = getRandomInt(13);
//                     playerCard = playerCard.render(475 + i * 150, 625, 'cards', 0.3, cardIndex);
//                     playerCard.position = i;
//                     scene.yourCards[i] = true;
//                 }

//                 let opponentCard = new Card(scene);
//                 scene.opponentCards.push(
//                     opponentCard.render(475 + i * 150, 100, 'cards', 0.3, 14).disableInteractive()
//                 );
//             }
//         };
//     }
// }
