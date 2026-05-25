# Focus Firefly

**Focus Firefly** is a short browser-based visual tracking and attention game built with **Phaser**, **TypeScript**, and **Vite**.

The player follows a glowing firefly as it moves around the screen and clicks or taps it only when it flashes gold. Each session lasts 45 seconds and ends with a summary showing score, correct taps, wrong taps, missed flashes, accuracy, and simple feedback.

This is a vision-inspired interactive mini-game prototype for portfolio/demo purposes. It is **not** medical treatment or a clinically validated vision therapy tool.

## Live Demo

[Focus Firefly](https://focusfirefly.netlify.app/)

## Features

- Custom title screen
- Dark blue/purple visual style
- Safety disclaimer
- Moving firefly built with Phaser shape objects
- Smooth random movement using tweens
- Glow pulse and wing flap animations
- Gold flash timing challenge
- Click/tap scoring
- Anti-spam scoring so only one correct tap counts per flash
- Score cannot go below zero
- 45-second session countdown
- Pause menu with Resume, Restart, and Quit to Menu
- End-of-session summary
- Accuracy feedback
- Restart flow

## How to Play

1. Click or tap **Start** from the title screen.
2. Follow the moving firefly.
3. Click or tap the firefly only when it flashes gold.
4. Avoid clicking when it is not flashing.
5. Review your results after the 45-second session.

## Controls

| Action | Control |
|---|---|
| Start game | Click / tap |
| Click firefly | Mouse click / tap |
| Pause | Pause button, `Esc`, or `P` |
| Resume | Resume button, `Esc`, or `P` |
| Restart | Restart button |
| Quit to menu | Quit to Menu button |

## Scoring

| Action | Result |
|---|---|
| Correct tap during gold flash | +100 score |
| Wrong tap outside gold flash | -25 score |
| Extra taps during the same flash | No extra score |
| Missed flash | Counted in final stats |

The score cannot go below zero.

## Session Results

At the end of each session, the game shows:

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

## Tech Stack

- Phaser
- TypeScript
- Vite
- HTML/CSS
- GitHub

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

Focus Firefly is a simple visual attention game and portfolio prototype.

Stop playing if you feel eye strain, headache, dizziness, nausea, or discomfort. Use short sessions with breaks.

This project should not be treated as medical advice, medical treatment, or clinically validated vision therapy.

## Current Status

Follow Mode v1 is playable and feature-frozen for initial deployment.

Remaining launch tasks:

- Add screenshot or GIF
- Deploy live demo
- Add live demo link to this README

## Future Improvements

Future gameplay should be added as parallel modes instead of expanding Follow Mode.

Possible future modes:

- **Jump Mode**: fireflies or targets appear in different positions for quick reaction taps.
- **Merge Mode**: two fireflies move toward each other, and the player taps when they overlap.

Possible polish:

- Screenshot or GIF in README
- Subtle particle trail
- Background stars/dots
- Average reaction time tracking
- Responsive layout improvements