import * as Phaser from 'phaser';

export class ModeSelect extends Phaser.Scene {
    constructor() {
        super('ModeSelect');
    }

    create() {
        const centerX = this.cameras.main.centerX;

        this.cameras.main.setBackgroundColor('#080b2f');

        this.add.text(centerX, 120, 'Choose Mode', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(centerX, 180, 'Pick a short visual attention challenge.', {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#cfd8ff'
        }).setOrigin(0.5);

        const followButton = this.add.text(centerX, 290, 'Follow Mode', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#8cffd2',
            stroke: '#00251a',
            strokeThickness: 5
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.add.text(centerX, 335, 'Track the firefly and click when it flashes gold.', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#d7e8ff'
        }).setOrigin(0.5);

        const backButton = this.add.text(centerX, 500, 'Back to Title', {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#cfd8ff'
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        followButton.on('pointerdown', () => {
            this.scene.start('FollowMode');
        });

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}