export default class Card {
    constructor(scene) {
        this.render = (x, y, key, scale, index) => {
            let card = scene.add.image(x, y, key, index).setScale(scale, scale).setInteractive();
            card.index = index;
            scene.input.setDraggable(card);
            return card;
        };
    }
}
