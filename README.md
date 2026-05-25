# Focus Firefly

**Focus Firefly** is a browser-based visual attention mini-game collection built with **Phaser**, **TypeScript**, and **Vite**.

The project currently includes one playable mode, **Follow Mode**, where the player tracks a glowing firefly and clicks or taps it only when it flashes gold. Each session lasts 45 seconds and ends with a results summary.

Future modes are planned as separate parallel game modes rather than expansions of Follow Mode.

This is a vision-inspired interactive mini-game prototype for portfolio/demo purposes. It is **not** medical treatment or a clinically validated vision therapy tool.

## Live Demo

[Focus Firefly](https://focusfirefly.netlify.app/)

## Modes

### Follow Mode

**Status:** Playable

Follow Mode is a short visual tracking and timing challenge.

The player follows a moving firefly as it travels around the screen. The firefly occasionally flashes gold, and the player should click or tap it only during that flash window.

Features:

- Moving firefly built with Phaser shape objects
- Smooth random movement using tweens
- Glow pulse and wing flap animations
- Gold flash timing challenge
- Click/tap scoring
- Anti-spam scoring so only one correct tap counts per flash
- Score cannot go below zero
- Correct tap, wrong tap, and missed flash tracking
- 45-second session countdown
- Pause menu with Resume, Restart, and Quit to Menu
- End-of-session summary
- Accuracy feedback
- Restart flow

### Jump Mode

**Status:** Coming Soon

Jump Mode is planned as a quick reaction mode where targets appear in different positions and the player taps them as quickly as possible.

Planned focus:

- Random target spawning
- Quick reaction timing
- Visual scanning
- Accuracy and speed feedback

### Merge Mode

**Status:** Coming Soon

Merge Mode is planned as a timing challenge where two moving fireflies move toward each other and the player taps when they overlap.

Planned focus:

- Moving-object timing
- Alignment judgment
- Visual convergence-inspired gameplay
- Timing accuracy feedback

## Current Features

- Custom title screen
- Mode Select screen
- Animated Follow Mode preview card
- Planned mode cards for future modes
- Dark blue/purple visual style
- Safety disclaimer
- Reusable firefly visual component
- Live deployed demo
- Phaser scene-based structure for future mode expansion

## How to Play Follow Mode

1. Click or tap from the title screen.
2. Choose **Follow Mode** from the Mode Select screen.
3. Follow the moving firefly.
4. Click or tap the firefly only when it flashes gold.
5. Avoid clicking when it is not flashing.
6. Review your results after the 45-second session.

## Controls

| Action | Control |
|---|---|
| Start / choose mode | Click / tap |
| Select Follow Mode | Click / tap the Follow Mode card |
| Click firefly | Mouse click / tap |
| Pause | Pause button, `Esc`, or `P` |
| Resume | Resume button, `Esc`, or `P` |
| Restart session | Restart button |
| Quit to menu | Quit to Menu button |
| Return from Mode Select | Back to Title button |

## Follow Mode Scoring

| Action | Result |
|---|---|
| Correct tap during gold flash | +100 score |
| Wrong tap outside gold flash | -25 score |
| Extra taps during the same flash | No extra score |
| Missed flash | Counted in final stats |

The score cannot go below zero.

## Follow Mode Session Results

At the end of each Follow Mode session, the game shows:

- Final score
- Correct taps
- Wrong taps
- Missed flashes
- Accuracy percentage
- Feedback message

Current accuracy formula:

```text
correct taps / (correct taps + wrong taps + missed flashes)
```

## Project Structure

The project is moving toward a multi-mode scene structure:

```text
MainMenu
  → ModeSelect
      → FollowMode
      → JumpMode       Coming Soon
      → MergeMode      Coming Soon
```

The firefly visual has been extracted into a reusable component so it can be used in Follow Mode, Mode Select previews, and future modes.

## Tech Stack

- Phaser
- TypeScript
- Vite
- HTML/CSS
- GitHub
- Netlify

## Local Development

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Safety Note

Focus Firefly is a simple visual attention game collection and portfolio prototype.

Stop playing if you feel eye strain, headache, dizziness, nausea, or discomfort. Use short sessions with breaks.

This project should not be treated as medical advice, medical treatment, or clinically validated vision therapy.

## Current Status

Follow Mode v1 is playable and deployed.

The project now has:

- Live demo
- Title screen
- Mode Select screen
- Playable Follow Mode
- Planned Jump Mode card
- Planned Merge Mode card
- Reusable firefly component
- README documentation

Follow Mode is feature-frozen except for bug fixes and small polish. Future gameplay should be added as separate modes.

## Future Improvements

Future gameplay should be added as parallel modes instead of expanding Follow Mode.

Planned modes:

- **Jump Mode**: targets appear in different positions for quick reaction taps.
- **Merge Mode**: two fireflies move toward each other, and the player taps when they overlap.

Possible polish:

- Screenshot or GIF in README
- Subtle particle trail
- Background stars/dots
- Average reaction time tracking
- Responsive layout improvements
- Additional animated mode preview cards