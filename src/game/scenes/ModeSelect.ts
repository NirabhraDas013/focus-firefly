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

        const addComingSoonStamp = (x: number, y: number) => {
            const stampBg = this.add.rectangle(x, y, 170, 34, 0x8b1e1e, 0.9)
                .setAngle(-32)
                .setStrokeStyle(2, 0xffb3b3, 0.9);

            const stampText = this.add.text(x, y, 'COMING SOON', {
                fontFamily: 'Arial Black',
                fontSize: 18,
                color: '#ffffff',
                stroke: '#5a0000',
                strokeThickness: 3
            })
                .setOrigin(0.5)
                .setAngle(-32);

            return [stampBg, stampText];
        };

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

        // --- Cards Positioning ---
        const cardY = 335;
        const cardSize = 240;
        const cardPadding = 60;

        const followCardX = centerX - 290;
        const jumpCardX = centerX;
        const mergeCardX = centerX + 290;

        // --- Follow Mode Card ---
        const followCard = this.add.rectangle(
            followCardX,
            cardY,
            cardSize,
            cardSize,
            0x080b2f,
            1
        )
            .setStrokeStyle(3, 0x8cffd2, 0.8)
            .setInteractive({ useHandCursor: true });

        // Reusable firefly preview inside the card.
        const previewFirefly = createFirefly(this, followCardX, cardY, 0.55);
        startFireflyIdleAnimations(this, previewFirefly);

        // Moves the preview firefly randomly while keeping it inside the square card.
        const movePreviewFirefly = () => {
            const minX = followCardX - cardSize / 2 + cardPadding;
            const maxX = followCardX + cardSize / 2 - cardPadding;
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

        // Follow Mode label below card
        this.add.text(followCardX, cardY + 155, 'Follow Mode', {
            fontFamily: 'Arial Black',
            fontSize: 30,
            color: '#8cffd2',
            stroke: '#00251a',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(followCardX, cardY + 195, 'Track the firefly and click when it flashes gold.', {
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

        // --- Jump Mode placeholder card ---
        const jumpCard = this.add.rectangle(
            jumpCardX,
            cardY,
            cardSize,
            cardSize,
            0x080b2f,
            1
        )
            .setStrokeStyle(3, 0xffffff, 0.35)
            .setAlpha(0.75);

        // Target-style preview dots.
        this.add.circle(jumpCardX - 45, cardY - 35, 16, 0x8cffd2, 0.35);
        this.add.circle(jumpCardX + 40, cardY + 25, 18, 0xffd84d, 0.35);
        this.add.circle(jumpCardX + 55, cardY - 55, 10, 0xd7e8ff, 0.3);

        addComingSoonStamp(jumpCardX, cardY);

        this.add.text(jumpCardX, cardY + cardSize / 2 + 45, 'Jump Mode', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#cfd8ff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(jumpCardX, cardY + cardSize / 2 + 85, 'Tap targets as they appear in different positions.', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#cfd8ff',
            align: 'center',
            wordWrap: {
                width: cardSize + 40
            }
        }).setOrigin(0.5);

        // --- Merge Mode placeholder card ---
        const mergeCard = this.add.rectangle(
            mergeCardX,
            cardY,
            cardSize,
            cardSize,
            0x080b2f,
            1
        )
            .setStrokeStyle(3, 0xffffff, 0.35)
            .setAlpha(0.75);

        // Convergence-style preview.
        this.add.circle(mergeCardX - 45, cardY, 14, 0x8cffd2, 0.4);
        this.add.circle(mergeCardX + 45, cardY, 14, 0xffd84d, 0.4);

        this.add.line(
            mergeCardX,
            cardY,
            -25,
            0,
            25,
            0,
            0xd7e8ff,
            0.35
        ).setLineWidth(3);

        addComingSoonStamp(mergeCardX, cardY - 8);

        this.add.text(mergeCardX, cardY + cardSize / 2 + 45, 'Merge Mode', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#cfd8ff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(mergeCardX, cardY + cardSize / 2 + 85, 'Tap when two moving fireflies overlap.', {
            fontFamily: 'Arial',
            fontSize: 16,
            color: '#cfd8ff',
            align: 'center',
            wordWrap: {
                width: cardSize + 40
            }
        }).setOrigin(0.5);

        // Back button to return to the title screen.
        const backButton = this.add.text(centerX, 690, 'Back to Title', {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#cfd8ff'
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}