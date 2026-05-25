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

    // These text objects show the Correct/Wrong/Missed counts on the screen
    correctText!: Phaser.GameObjects.Text;
    wrongText!: Phaser.GameObjects.Text;
    missedFlashes = 0;
    missedText!: Phaser.GameObjects.Text;

    // Each game session lasts a certain amount of time. This is the countdown timer.
    baseTimeLeft = 5; //This can move to some sort of editable file later
    timeLeft = this.baseTimeLeft;
    timerText!: Phaser.GameObjects.Text;
    gameOver = false;
    timerBackground!: Phaser.GameObjects.Rectangle;

    // This text is shown at the end of the session.
    endMessageText!: Phaser.GameObjects.Text;
    restartText!: Phaser.GameObjects.Text;

    // Pause state and pause menu objects.
    isPaused = false;

    pauseButton!: Phaser.GameObjects.Text;
    pauseOverlay!: Phaser.GameObjects.Rectangle;
    pauseTitleText!: Phaser.GameObjects.Text;
    resumeButton!: Phaser.GameObjects.Text;
    pauseRestartButton!: Phaser.GameObjects.Text;
    quitButton!: Phaser.GameObjects.Text;

    constructor() {
        // This scene key must match whatever the menu uses:
        // this.scene.start('Game')
        super('Game');
    }

    create() {
        this.resetState();

        // Set the main play-area background color.
        this.cameras.main.setBackgroundColor('#080b2f');

        // Center X coordinate for easy reference when placing things in the middle.
        const centerX = this.cameras.main.centerX;

        // Main countdown badge.
        this.timerBackground = this.add.rectangle(centerX, 40, 84, 50, 0x000000, 0.35)
            .setStrokeStyle(2, 0xffffff, 0.35);

        this.timerText = this.add.text(centerX, 40, `${this.timeLeft}`, {
            fontFamily: 'Arial Black',
            fontSize: 34,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        // Top title text for the game mode.
        this.add.text(centerX, 105, 'Follow Mode', {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Short instruction text under the title.
        this.add.text(centerX, 155, 'Click the firefly when it flashes gold.', {
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

        // Shows how many flashes the player has missed (not clicking during a flash).
        this.missedText = this.add.text(40, 149, 'Missed: 0', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#ffd27f',
            stroke: '#2a1600',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // Top-right pause button.
        this.pauseButton = this.add.text(950, 40, 'Pause', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#cfd8ff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Pause button click handler.
        this.pauseButton.on('pointerdown', () => {
            if (!this.gameOver) {
                this.openPauseMenu(centerX);
            }
        });

        // Keyboard pause shortcut.
        this.input.keyboard?.on('keydown-ESC', () => {
            if (!this.gameOver) {
                if (this.isPaused) {
                    this.closePauseMenu();
                } else {
                    this.openPauseMenu(centerX);
                }
            }
        });

        this.input.keyboard?.on('keydown-P', () => {
            if (!this.gameOver) {
                if (this.isPaused) {
                    this.closePauseMenu();
                } else {
                    this.openPauseMenu(centerX);
                }
            }
        });

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
        this.firefly = this.add.container(centerX, 384, [
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
            if (this.gameOver || this.isPaused) {
                return;
            }

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

        // Counts down once per second until the session ends.
        this.time.addEvent({
            delay: 1000,
            repeat: 44,
            callback: () => {
                if (this.isPaused || this.gameOver) {
                    return;
                }
                this.timeLeft -= 1;
                this.timerText.setText(`${this.timeLeft}`);

                if (this.timeLeft <= 0) {
                    this.endSession(centerX);
                }
            }
        });
    }

    endSession(centerX: number) {
        this.gameOver = true;
        this.timerText.setText('0');

        // Hide pause control because the session is already finished.
        this.pauseButton.setVisible(false);
        this.pauseButton.disableInteractive();

        // Stop active firefly movement and place it in a calm end-session position.
        this.tweens.killTweensOf(this.firefly);
        this.firefly.setPosition(centerX, 520);
        this.firefly.setScale(1);
        this.fireflyBody.setFillStyle(0x5fffc9, 1);
        this.fireflyCore.setFillStyle(0xfff7a8, 1);

        // Hide live HUD stats once the final result summary is shown.
        this.scoreText.setVisible(false);
        this.correctText.setVisible(false);
        this.wrongText.setVisible(false);
        this.missedText.setVisible(false);

        // Calculate final accuracy from all flash-related outcomes.
        const totalAttempts = this.correctTaps + this.wrongTaps + this.missedFlashes;

        const accuracy = totalAttempts > 0
            ? Math.round((this.correctTaps / totalAttempts) * 100)
            : 0;

        this.endMessageText = this.add.text(centerX, 270, 'Session Complete', {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Final session stats, centered as one group.
        const finalStats = this.add.container(centerX, 320);

        finalStats.add([
            this.add.text(-210, 0, `Score: ${this.score}`, {
                fontFamily: 'Arial Black',
                fontSize: 20,
                color: '#8cffd2',
                stroke: '#00251a',
                strokeThickness: 3
            }).setOrigin(0.5),

            this.add.text(-70, 0, `Correct: ${this.correctTaps}`, {
                fontFamily: 'Arial Black',
                fontSize: 20,
                color: '#b6ffe8',
                stroke: '#00251a',
                strokeThickness: 3
            }).setOrigin(0.5),

            this.add.text(80, 0, `Wrong: ${this.wrongTaps}`, {
                fontFamily: 'Arial Black',
                fontSize: 20,
                color: '#ffb6b6',
                stroke: '#2a0000',
                strokeThickness: 3
            }).setOrigin(0.5),

            this.add.text(225, 0, `Missed: ${this.missedFlashes}`, {
                fontFamily: 'Arial Black',
                fontSize: 20,
                color: '#ffd27f',
                stroke: '#2a1600',
                strokeThickness: 3
            }).setOrigin(0.5)
        ]);

        this.add.text(centerX, 355, `Accuracy: ${accuracy}%`, {
            fontFamily: 'Arial Black',
            fontSize: 22,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        let feedbackMessage = 'Good effort. Try again and watch for the gold flash.';

        if (accuracy >= 80) {
            feedbackMessage = 'Great focus!';
        } else if (accuracy >= 50) {
            feedbackMessage = 'Nice work. Keep tracking the firefly.';
        }

        this.add.text(centerX, 390, feedbackMessage, {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#cfd8ff'
        }).setOrigin(0.5);

        this.restartText = this.add.text(centerX, 430, 'Click or tap to try again', {
            fontFamily: 'Arial',
            fontSize: 22,
            color: '#cfd8ff'
        }).setOrigin(0.5);

        // Prevent accidental instant restart from a click happening as the session ends.
        this.time.delayedCall(500, () => {
            this.input.once('pointerdown', () => {
                this.scene.restart();
            });
        });

        console.log('Game over.');
    }

    openPauseMenu(centerX: number) {
        if (this.isPaused) {
            return;
        }

        this.isPaused = true;

        // Pause active firefly tweens so the scene visually freezes.
        this.tweens.pauseAll();

        this.pauseOverlay = this.add.rectangle(centerX, 360, 1024, 768, 0x000000, 0.55);

        this.pauseTitleText = this.add.text(centerX, 230, 'Paused', {
            fontFamily: 'Arial Black',
            fontSize: 42,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.resumeButton = this.add.text(centerX, 310, 'Resume', {
            fontFamily: 'Arial Black',
            fontSize: 26,
            color: '#b6ffe8',
            stroke: '#00251a',
            strokeThickness: 4
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.pauseRestartButton = this.add.text(centerX, 365, 'Restart', {
            fontFamily: 'Arial Black',
            fontSize: 26,
            color: '#ffd27f',
            stroke: '#2a1600',
            strokeThickness: 4
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.quitButton = this.add.text(centerX, 420, 'Quit to Menu', {
            fontFamily: 'Arial Black',
            fontSize: 26,
            color: '#ffb6b6',
            stroke: '#2a0000',
            strokeThickness: 4
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.resumeButton.on('pointerdown', () => {
            this.closePauseMenu();
        });

        this.pauseRestartButton.on('pointerdown', () => {
            this.clearPauseState();
            this.scene.restart();
        });

        this.quitButton.on('pointerdown', () => {
            this.clearPauseState();
            this.scene.start('MainMenu');
        });
    }

    closePauseMenu() {
        if (!this.isPaused) {
            return;
        }

        this.clearPauseState();

        // Restart firefly movement after unpausing.
        this.moveFirefly();

        // Restart the flash loop after unpausing.
        this.scheduleNextFlash();
    }

    clearPauseState() {
        this.isPaused = false;
        this.tweens.resumeAll();

        this.pauseOverlay?.destroy();
        this.pauseTitleText?.destroy();
        this.resumeButton?.destroy();
        this.pauseRestartButton?.destroy();
        this.quitButton?.destroy();
    }

    moveFirefly() {
        if (this.gameOver || this.isPaused) {
            return;
        }

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
        if (this.gameOver || this.isPaused) {
            return;
        }

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
        if (this.gameOver || this.isPaused) {
            return;
        }

        // If the player did not click during the flash, count it as a miss.
        if (!this.hasClickedCurrentFlash) {
            this.missedFlashes += 1;
            this.missedText.setText(`Missed: ${this.missedFlashes}`);
        }

        this.isFlashing = false;
        this.hasClickedCurrentFlash = false;

        // Return to normal firefly colors.
        this.fireflyBody.setFillStyle(0x5fffc9, 1);
        this.fireflyCore.setFillStyle(0xfff7a8, 1);

        // Schedule another flash later.
        this.scheduleNextFlash();
    }

    resetState() {
        // Reset session state whenever the scene starts or restarts.
        this.score = 0;
        this.correctTaps = 0;
        this.wrongTaps = 0;
        this.missedFlashes = 0;

        this.timeLeft = this.baseTimeLeft;
        this.gameOver = false;
        this.isPaused = false;

        this.tweens.resumeAll();

        this.isFlashing = false;
        this.hasClickedCurrentFlash = false;
    }
}