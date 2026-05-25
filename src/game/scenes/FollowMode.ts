import * as Phaser from 'phaser';
import {
    createFirefly,
    startFireflyIdleAnimations,
    setFireflyNormal,
    setFireflyFlashing,
    type FireflyParts
} from '../components/Firefly';

export class FollowMode extends Phaser.Scene {
    // Main firefly container used by movement, input, and tweens.
    firefly!: Phaser.GameObjects.Container;

    // Reusable firefly visual parts shared with previews/other modes.
    fireflyParts!: FireflyParts;

    // Flash/scoring state.
    isFlashing = false;
    hasClickedCurrentFlash = false;

    // Score and gameplay stats.
    score = 0;
    correctTaps = 0;
    wrongTaps = 0;
    missedFlashes = 0;

    scoreText!: Phaser.GameObjects.Text;
    correctText!: Phaser.GameObjects.Text;
    wrongText!: Phaser.GameObjects.Text;
    missedText!: Phaser.GameObjects.Text;

    // Session timer.
    baseTimeLeft = 45; // This can move to a config file later.
    timeLeft = this.baseTimeLeft;
    timerText!: Phaser.GameObjects.Text;
    timerBackground!: Phaser.GameObjects.Rectangle;
    sessionTimerEvent?: Phaser.Time.TimerEvent;

    // Session state.
    gameOver = false;
    isPaused = false;

    // End-session UI.
    endMessageText!: Phaser.GameObjects.Text;
    restartText!: Phaser.GameObjects.Text;

    // Pause menu UI.
    pauseButton!: Phaser.GameObjects.Text;
    pauseOverlay!: Phaser.GameObjects.Rectangle;
    pauseTitleText!: Phaser.GameObjects.Text;
    resumeButton!: Phaser.GameObjects.Text;
    pauseRestartButton!: Phaser.GameObjects.Text;
    quitButton!: Phaser.GameObjects.Text;

    constructor() {
        super('FollowMode');
    }

    create() {
        this.resetState();

        this.cameras.main.setBackgroundColor('#080b2f');

        const centerX = this.cameras.main.centerX;

        // --- Timer badge ---
        this.timerBackground = this.add.rectangle(centerX, 40, 84, 50, 0x000000, 0.35)
            .setStrokeStyle(2, 0xffffff, 0.35);

        this.timerText = this.add.text(centerX, 40, `${this.timeLeft}`, {
            fontFamily: 'Arial Black',
            fontSize: 34,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        // --- Title and instructions ---
        this.add.text(centerX, 105, 'Follow Mode', {
            fontFamily: 'Arial Black',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(centerX, 155, 'Click the firefly when it flashes gold.', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#d7e8ff',
            align: 'center'
        }).setOrigin(0.5);

        // --- Live HUD stats ---
        this.scoreText = this.add.text(40, 60, 'Score: 0', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#8cffd2',
            stroke: '#00251a',
            strokeThickness: 4
        }).setOrigin(0, 0.5);

        this.correctText = this.add.text(40, 95, 'Correct: 0', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#b6ffe8',
            stroke: '#00251a',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        this.wrongText = this.add.text(40, 122, 'Wrong: 0', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#ffb6b6',
            stroke: '#2a0000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        this.missedText = this.add.text(40, 149, 'Missed: 0', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#ffd27f',
            stroke: '#2a1600',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        // --- Pause button ---
        this.pauseButton = this.add.text(950, 40, 'Pause', {
            fontFamily: 'Arial Black',
            fontSize: 20,
            color: '#cfd8ff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.pauseButton.on('pointerdown', () => {
            if (!this.gameOver) {
                this.openPauseMenu(centerX);
            }
        });

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

        // --- Reusable firefly visual ---
        this.fireflyParts = createFirefly(this, centerX, 384);
        this.firefly = this.fireflyParts.container;

        this.firefly.setSize(90, 90);
        this.firefly.setInteractive({
            useHandCursor: true
        });

        // Shared idle animation for glow and wings.
        startFireflyIdleAnimations(this, this.fireflyParts);

        // --- Firefly click/tap scoring ---
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

        this.moveFirefly();
        this.scheduleNextFlash();

        // Uses loop instead of repeat so pause does not consume remaining ticks.
        this.sessionTimerEvent = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (this.isPaused || this.gameOver) {
                    return;
                }

                this.timeLeft -= 1;
                this.timerText.setText(`${this.timeLeft}`);

                if (this.timeLeft <= 0) {
                    this.sessionTimerEvent?.destroy();
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

        // Stop movement and place the firefly in a calm end-session position.
        this.tweens.killTweensOf(this.firefly);
        this.firefly.setPosition(centerX, 520);
        this.firefly.setScale(1);
        setFireflyNormal(this.fireflyParts);

        // Hide live HUD stats once the final summary is shown.
        this.scoreText.setVisible(false);
        this.correctText.setVisible(false);
        this.wrongText.setVisible(false);
        this.missedText.setVisible(false);

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

        // Final stats are grouped so they stay visually centered.
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
                this.sessionTimerEvent?.destroy();
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
            this.sessionTimerEvent?.destroy();
            this.clearPauseState();
            this.scene.restart();
        });

        this.quitButton.on('pointerdown', () => {
            this.sessionTimerEvent?.destroy();
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

        const targetX = Phaser.Math.Between(140, 884);
        const targetY = Phaser.Math.Between(180, 650);

        this.tweens.add({
            targets: this.firefly,
            x: targetX,
            y: targetY,
            duration: 1800,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.moveFirefly();
            }
        });
    }

    scheduleNextFlash() {
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
        this.hasClickedCurrentFlash = false;

        setFireflyFlashing(this.fireflyParts);

        this.tweens.add({
            targets: this.firefly,
            scale: 1.18,
            duration: 120,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        this.time.delayedCall(800, () => {
            this.endFlash();
        });
    }

    endFlash() {
        if (this.gameOver || this.isPaused) {
            return;
        }

        if (!this.hasClickedCurrentFlash) {
            this.missedFlashes += 1;
            this.missedText.setText(`Missed: ${this.missedFlashes}`);
        }

        this.isFlashing = false;
        this.hasClickedCurrentFlash = false;

        setFireflyNormal(this.fireflyParts);

        this.scheduleNextFlash();
    }

    resetState() {
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