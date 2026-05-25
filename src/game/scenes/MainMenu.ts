import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    disclaimer: GameObjects.Text;
    startText: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        const centerX = this.cameras.main.centerX;
        this.cameras.main.setBackgroundColor('#080b2f');

        this.title = this.add.text(centerX, 220, 'Focus Firefly', {
            fontFamily: 'Arial Black',
            fontSize: 56,
            color: '#fff7b0',
            stroke: '#2b1b00',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(centerX, 260, 'Short visual attention games built around tracking and timing', {
            fontFamily: 'Arial',
            fontSize: 26,
            color: '#d7e8ff',
            align: 'center'
        }).setOrigin(0.5);

        this.disclaimer = this.add.text(centerX, 405,
            'This is a collections of simple visual attention games, not medical treatment.\n' +
            'Stop if you feel eye strain, headache, dizziness, nausea, or discomfort.\n' +
            'Use short sessions with breaks.',
            {
                fontFamily: 'Arial',
                fontSize: 18,
                color: '#ffffff',
                align: 'center',
                lineSpacing: 8
            }
        ).setOrigin(0.5);

        this.add.text(centerX, 520, 'Click or tap to choose a mode', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#8cffd2',
            stroke: '#00251a',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('ModeSelect');
        });
    }
}