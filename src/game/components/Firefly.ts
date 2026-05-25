import * as Phaser from 'phaser';

export type FireflyParts = {
    container: Phaser.GameObjects.Container;
    outerGlow: Phaser.GameObjects.Arc;
    midGlow: Phaser.GameObjects.Arc;
    innerGlow: Phaser.GameObjects.Arc;
    leftWing: Phaser.GameObjects.Ellipse;
    rightWing: Phaser.GameObjects.Ellipse;
    body: Phaser.GameObjects.Ellipse;
    core: Phaser.GameObjects.Arc;
};

export function createFirefly(
    scene: Phaser.Scene,
    x: number,
    y: number,
    scale = 1
): FireflyParts {
    // Soft glow layers.
    const outerGlow = scene.add.circle(0, 0, 64, 0x8cffd2, 0.06);
    const midGlow = scene.add.circle(0, 0, 44, 0x8cffd2, 0.10);
    const innerGlow = scene.add.circle(0, 0, 28, 0x8cffd2, 0.18);

    // Small translucent wings.
    const leftWing = scene.add.ellipse(-13, -4, 22, 12, 0xd7fff5, 0.35);
    leftWing.setRotation(-0.5);

    const rightWing = scene.add.ellipse(13, -4, 22, 12, 0xd7fff5, 0.35);
    rightWing.setRotation(0.5);

    // Body and bright center.
    const body = scene.add.ellipse(0, 4, 16, 24, 0x5fffc9, 1);
    const core = scene.add.circle(0, 4, 8, 0xfff7a8, 1);

    // Container lets the full firefly move as one object.
    const container = scene.add.container(x, y, [
        outerGlow,
        midGlow,
        innerGlow,
        leftWing,
        rightWing,
        body,
        core
    ]);

    container.setScale(scale);

    return {
        container,
        outerGlow,
        midGlow,
        innerGlow,
        leftWing,
        rightWing,
        body,
        core
    };
}

export function startFireflyIdleAnimations(
    scene: Phaser.Scene,
    firefly: FireflyParts
) {
    // Gentle glow pulse.
    scene.tweens.add({
        targets: [
            firefly.outerGlow,
            firefly.midGlow,
            firefly.innerGlow
        ],
        scale: 1.12,
        alpha: 0.14,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

    // Simple wing flap.
    scene.tweens.add({
        targets: [
            firefly.leftWing,
            firefly.rightWing
        ],
        scaleY: 0.65,
        duration: 120,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}

export function setFireflyNormal(firefly: FireflyParts) {
    firefly.body.setFillStyle(0x5fffc9, 1);
    firefly.core.setFillStyle(0xfff7a8, 1);
}

export function setFireflyFlashing(firefly: FireflyParts) {
    firefly.body.setFillStyle(0xffd84d, 1);
    firefly.core.setFillStyle(0xffffff, 1);
}