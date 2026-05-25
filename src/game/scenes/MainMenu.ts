import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    disclaimer: GameObjects.Text;
    startText: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#080b2f');

        this.title = this.add.text(512, 220, 'Focus Firefly', {
            fontFamily: 'Arial Black',
            fontSize: 56,
            color: '#fff7b0',
            stroke: '#2b1b00',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.subtitle = this.add.text(512, 300, 'A short visual tracking and attention game', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#d7e8ff',
            align: 'center'
        }).setOrigin(0.5);

        this.disclaimer = this.add.text(512, 405,
            'This is a simple visual attention game, not medical treatment.\n' +
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

        this.startText = this.add.text(512, 560, 'Click or tap to start', {
            fontFamily: 'Arial Black',
            fontSize: 28,
            color: '#8cffd2',
            stroke: '#003322',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('ModeSelect');
        });
    }
}