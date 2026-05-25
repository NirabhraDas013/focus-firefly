import * as Phaser from 'phaser';
import {
    createFirefly,
    startFireflyIdleAnimations
} from '../components/Firefly';

export class ModeSelect extends Phaser.Scene {
    constructor() {
        super('ModeSelect');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        this.cameras.main.setBackgroundColor('#10144a');

        // --- Page header ---
        this.add.text(centerX, 95, 'Mode Select', {
            fontFamily: 'Arial Black',
            fontSize: 46,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(centerX, 150, 'Choose a short visual attention challenge.', {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#cfd8ff'
        }).setOrigin(0.5);

        // --- Follow Mode card ---
        const cardX = centerX;
        const cardY = 335;
        const cardSize = 260;
        const cardPadding = 65;

        const followCard = this.add.rectangle(
            cardX,
            cardY,
            cardSize,
            cardSize,
            0x080b2f,
            1
        )
            .setStrokeStyle(3, 0x8cffd2, 0.8)
            .setInteractive({ useHandCursor: true });

        // Reusable firefly preview inside the card.
        const previewFirefly = createFirefly(this, cardX, cardY, 0.55);
        startFireflyIdleAnimations(this, previewFirefly);

        // Moves the preview firefly randomly while keeping it inside the square card.
        const movePreviewFirefly = () => {
            const minX = cardX - cardSize / 2 + cardPadding;
            const maxX = cardX + cardSize / 2 - cardPadding;
            const minY = cardY - cardSize / 2 + cardPadding;
            const maxY = cardY + cardSize / 2 - cardPadding;

            this.tweens.add({
                targets: previewFirefly.container,
                x: Phaser.Math.Between(minX, maxX),
                y: Phaser.Math.Between(minY, maxY),
                duration: 1200,
                ease: 'Sine.easeInOut',
                onComplete: movePreviewFirefly
            });
        };

        movePreviewFirefly();

        // --- Follow Mode label below card ---
        this.add.text(cardX, cardY + 155, 'Follow Mode', {
            fontFamily: 'Arial Black',
            fontSize: 30,
            color: '#8cffd2',
            stroke: '#00251a',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(cardX, cardY + 195, 'Track the firefly and click when it flashes gold.', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#d7e8ff',
            align: 'center',
            wordWrap: {
                width: cardSize
            }
        }).setOrigin(0.5);

        followCard.on('pointerdown', () => {
            this.scene.start('FollowMode');
        });

        previewFirefly.container.setSize(120, 120);
        previewFirefly.container.setInteractive({ useHandCursor: true });

        previewFirefly.container.on('pointerdown', () => {
            this.scene.start('FollowMode');
        });
    }
}