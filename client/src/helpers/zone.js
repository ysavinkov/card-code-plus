export default class Zone {
    constructor(scene) {
        this.renderZone = () => {
            const width = 800;
            const height = 325;
            const centerY = 450;

            // Create two separate drop zones, one for your cards and one for enemy cards
            const playerDropZone = scene.add.zone(775, centerY, width, height / 2).setRectangleDropZone(width, height / 2);
            const opponentDropZone = scene.add.zone(775, centerY - height / 2, width, height / 2).setRectangleDropZone(width, height / 2);

            // Set data for each drop zone to keep track of cards
            playerDropZone.setData({ cards: 0 });
            opponentDropZone.setData({ cards: 0 });

            // Return both drop zones as an object
            return { playerDropZone, opponentDropZone };
        };

        this.renderBackground = (dropZone, color) => {
            const dropZoneColor = scene.add.graphics();
            dropZoneColor.fillStyle(color, 1);
            dropZoneColor.fillRect(
                dropZone.x - dropZone.input.hitArea.width / 2,
                dropZone.y - dropZone.input.hitArea.height / 2,
                dropZone.input.hitArea.width,
                dropZone.input.hitArea.height
            );
        };

        this.renderOutline = (dropZone, color) => {
            const dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(6, color);
            dropZoneOutline.strokeRect(
                dropZone.x - dropZone.input.hitArea.width / 2,
                dropZone.y - dropZone.input.hitArea.height / 2,
                dropZone.input.hitArea.width,
                dropZone.input.hitArea.height
            );
        };
    }
}

// export default class Zone {
//     constructor(scene) {
//         this.renderZone = () => {
//             const width = 800;
//             const height = 325;
//             const centerY = 450;

//             // Create two separate drop zones, one for your cards and one for enemy cards
//             const playerDropZone = scene.add
//                 .zone(775, centerY, width, height / 2)
//                 .setRectangleDropZone(width, height / 2);
//             const opponentDropZone = scene.add
//                 .zone(775, centerY - 4 - height / 2, width, height / 2)
//                 .setRectangleDropZone(width, height / 2);

//             // Set data for each drop zone to keep track of cards
//             playerDropZone.setData({ cards: 0 });
//             opponentDropZone.setData({ cards: 0 });

//             // Return both drop zones as an object
//             return { playerDropZone, opponentDropZone };
//         };

//         // blue - 0xadd8e6
//         // red - 0xff69b4
//         this.renderOutline = (dropZone, color) => {
//             const dropZoneOutline = scene.add.graphics();
//             dropZoneOutline.lineStyle(4, color);
//             dropZoneOutline.strokeRect(
//                 dropZone.x - dropZone.input.hitArea.width / 2,
//                 dropZone.y - dropZone.input.hitArea.height / 2,
//                 dropZone.input.hitArea.width,
//                 dropZone.input.hitArea.height
//             );
//         };
//     }
// }
