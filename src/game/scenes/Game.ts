import * as Phaser from 'phaser';

export class Game extends Phaser.Scene
{
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

    constructor ()
    {
        // This scene key must match whatever the menu uses:
        // this.scene.start('Game')
        super('Game');
    }

    create ()
    {
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

        // Temporary click test.
        // Later this will become correct/wrong tap scoring.
        this.firefly.on('pointerdown', () => {
            console.log('Firefly clicked. Flashing:', this.isFlashing);
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

    moveFirefly ()
    {
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

    scheduleNextFlash ()
    {
        // Pick a random delay before the next flash.
        // This prevents the player from knowing exactly when it will happen.
        const delay = Phaser.Math.Between(1500, 3000);

        this.time.delayedCall(delay, () => {
            this.startFlash();
        });
    }

    startFlash ()
    {
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

    endFlash ()
    {
        this.isFlashing = false;

        // Return to normal firefly colors.
        this.fireflyBody.setFillStyle(0x5fffc9, 1);
        this.fireflyCore.setFillStyle(0xfff7a8, 1);

        // Schedule another flash later.
        this.scheduleNextFlash();
    }
}