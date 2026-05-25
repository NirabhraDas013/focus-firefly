import * as Phaser from 'phaser';

export class Game extends Phaser.Scene {
    // This container will hold every visual part of the firefly:
    // glow rings, wings, body, and core.
    // Moving the container moves the whole firefly together.
    firefly!: Phaser.GameObjects.Container;

    // These are stored as class properties because we need to change
    // their colors when the firefly flashes.
    fireflyBody!: Phaser.GameObjects.Ellipse;
    fireflyCore!: Phaser.GameObjects.Arc;

    // Tracks whether the player should currently click/tap.
    isFlashing = false;

    // Prevents the player from scoring multiple times during one flash.
    hasClickedCurrentFlash = false;

    // Basic score state for the current session.
    score = 0;
    scoreText!: Phaser.GameObjects.Text;

    // Gameplay stats tracked separately from score.
    // These will be useful later for the results screen.
    correctTaps = 0;
    wrongTaps = 0;

    correctText!: Phaser.GameObjects.Text;
    wrongText!: Phaser.GameObjects.Text;

    constructor() {
        // This scene key must match whatever the menu uses:
        // this.scene.start('Game')
        super('Game');
    }

    create() {
        // Set the main play-area background color.
        this.cameras.main.setBackgroundColor('#080b2f');

        // Top title text for the game mode.
        this.add.text(512, 60, 'Follow Mode', {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Short instruction text under the title.
        this.add.text(512, 110, 'Click the firefly when it flashes gold.', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#d7e8ff',
            align: 'center'
        }).setOrigin(0.5);

        // Score display.
        // setOrigin(0, 0.5) means the text is anchored from its left-center.
        this.scoreText = this.add.text(40, 60, 'Score: 0', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#8cffd2',
            stroke: '#00251a',
            strokeThickness: 4
        }).setOrigin(0, 0.5);

        // Shows how many correct flash clicks the player has made.
        this.correctText = this.add.text(40, 95, 'Correct: 0', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#b6ffe8',
            stroke: '#00251a',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // Shows how many wrong clicks the player has made.
        this.wrongText = this.add.text(40, 122, 'Wrong: 0', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#ffb6b6',
            stroke: '#2a0000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // --- Firefly visual pieces ---
        // These circles create a soft glow around the firefly.
        // They are placed at 0,0 because they will live inside the container.
        const outerGlow = this.add.circle(0, 0, 64, 0x8cffd2, 0.06);
        const midGlow = this.add.circle(0, 0, 44, 0x8cffd2, 0.10);
        const innerGlow = this.add.circle(0, 0, 28, 0x8cffd2, 0.18);

        // Small translucent wings.
        const leftWing = this.add.ellipse(-13, -4, 22, 12, 0xd7fff5, 0.35);
        leftWing.setRotation(-0.5);

        const rightWing = this.add.ellipse(13, -4, 22, 12, 0xd7fff5, 0.35);
        rightWing.setRotation(0.5);

        // Body and bright center.
        this.fireflyBody = this.add.ellipse(0, 4, 16, 24, 0x5fffc9, 1);
        this.fireflyCore = this.add.circle(0, 4, 8, 0xfff7a8, 1);

        // --- Firefly container ---
        // The container is positioned in the middle of the screen.
        // All child objects use positions relative to the container.
        this.firefly = this.add.container(512, 384, [
            outerGlow,
            midGlow,
            innerGlow,
            leftWing,
            rightWing,
            this.fireflyBody,
            this.fireflyCore
        ]);

        // Give the container a clickable area.
        // Containers do not automatically know their visual bounds,
        // so we manually set a size for input detection.
        this.firefly.setSize(90, 90);

        // Make the firefly respond to pointer input.
        this.firefly.setInteractive({
            useHandCursor: true
        });

        // Firefly click/tap scoring.
        // For now:
        // - clicking during a flash is correct
        // - clicking outside a flash is wrong
        // Handles scoring and tap stats whenever the firefly is clicked.
        this.firefly.on('pointerdown', () => {
            if (this.isFlashing && !this.hasClickedCurrentFlash) {
                this.score += 100;
                this.correctTaps += 1;
                this.hasClickedCurrentFlash = true;

                this.scoreText.setText(`Score: ${this.score}`);
                this.correctText.setText(`Correct: ${this.correctTaps}`);

                console.log('Correct tap!');
            } else if (!this.isFlashing) {
                this.score = Math.max(0, this.score - 25);
                this.wrongTaps += 1;

                this.scoreText.setText(`Score: ${this.score}`);
                this.wrongText.setText(`Wrong: ${this.wrongTaps}`);

                console.log('Wrong tap.');
            } else {
                console.log('Already clicked this flash.');
            }
        });

        // --- Glow pulse animation ---
        // This makes the glow slowly expand and shrink forever.
        this.tweens.add({
            targets: [outerGlow, midGlow, innerGlow],
            scale: 1.12,
            alpha: 0.14,
            duration: 900,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // --- Wing flap animation ---
        // This quickly squashes the wings up/down forever.
        this.tweens.add({
            targets: [leftWing, rightWing],
            scaleY: 0.65,
            duration: 120,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Start the movement loop.
        this.moveFirefly();

        // Start the flash loop.
        this.scheduleNextFlash();
    }

    moveFirefly() {
        // Pick a random target position inside safe screen bounds.
        // We avoid the very edges so the firefly does not go off-screen.
        const targetX = Phaser.Math.Between(140, 884);
        const targetY = Phaser.Math.Between(180, 650);

        // Tween smoothly moves the firefly container to the target.
        this.tweens.add({
            targets: this.firefly,
            x: targetX,
            y: targetY,
            duration: 1800,
            ease: 'Sine.easeInOut',

            // When the movement finishes, choose a new target
            // and move again. This creates continuous movement.
            onComplete: () => {
                this.moveFirefly();
            }
        });
    }

    scheduleNextFlash() {
        // Pick a random delay before the next flash.
        // This prevents the player from knowing exactly when it will happen.
        const delay = Phaser.Math.Between(1500, 3000);

        this.time.delayedCall(delay, () => {
            this.startFlash();
        });
    }

    startFlash() {
        this.isFlashing = true;

        // Change the firefly to gold so the player knows to click.
        this.fireflyBody.setFillStyle(0xffd84d, 1);
        this.fireflyCore.setFillStyle(0xffffff, 1);

        // Make the whole firefly pop a little.
        this.tweens.add({
            targets: this.firefly,
            scale: 1.18,
            duration: 120,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // The flash only lasts a short time.
        this.time.delayedCall(800, () => {
            this.endFlash();
        });
    }

    endFlash() {
        this.isFlashing = false;
        this.hasClickedCurrentFlash = false;

        // Return to normal firefly colors.
        this.fireflyBody.setFillStyle(0x5fffc9, 1);
        this.fireflyCore.setFillStyle(0xfff7a8, 1);

        // Schedule another flash later.
        this.scheduleNextFlash();
    }
}