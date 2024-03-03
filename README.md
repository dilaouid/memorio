<p align="center">
  <img src="https://raw.githubusercontent.com/dilaouid/memorio/media/cover.png" alt="Memorio - Cover Image" width="1280">
</p>

<h1 align="center">Memorio</h1>

<p align="center">
  <img src="https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/-Vite-B73BFE?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/-XState-000000?logo=xstate&logoColor=white" alt="XState">
</p>

## Welcome to Memorio! 🎮

Memorio is a dynamic memory game that challenges you to remember and replicate a path shown during a demo phase, using your keyboard's directional arrows. After watching a sequence of arrows light up on a grid, it's your turn to step up and trace the path from memory. Sounds simple? Think again! As you progress, the paths become more complex and the pressure mounts.

Ready to see how far your memory can take you? Dive into Memorio and set new high scores (if you can tho)

**Key Features:**

- **Dynamic Difficulty:** Paths become more complex as you progress.
- **Interactive Gameplay:** Utilize your keyboard's directional arrows to trace paths.
- **Score Tracking:** Aim for high scores by efficiently completing paths.
- **Sound Effects:** Engaging sounds for starting, flipping, validating, or invalidating moves.

**Note:** Memorio is optimized for keyboard interaction, not suitable for mobile or touch devices.

### Gameplay

After a sequence of arrows lights up on a grid, it's your turn to memorize and trace the path. Success leads to more challenging rounds, while mistakes introduce penalties.

### Configuration (`.env` file)

- `VITE_GRID_SIZE=7`: Grid size (rows and columns).
- `VITE_DEFAUT_PATHLENGTH=3`: Default number of moves at the start.
- `VITE_DEFAUT_PATHLENGTH_MAX=15`: Maximum number of moves.
- `VITE_HARDCORE_PATHLENGTH_MAX=25`: Maximum number of moves in hardcore mode.
- `VITE_DEFAUT_DEMO_DELAY=600`: Demo phase duration in milliseconds.
- `VITE_HARDCORE_DELAY=150`: Hardcore mode demo phase duration.
- `VITE_PENALTY_PERCENT=25`: Penalty percentage after a failure.

### Play Now

Experience Memorio [here](https://dilaouid.github.io/memorio/).

### Installation and Setup

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Setup the environment variables in a `.env` file.
4. Start the development server with `npm run dev`.
5. For production builds, use `npm run build`.

### Code Structure

- `src/App.tsx`: Entry point that renders the game component.
- `src/components/Game.tsx`: Core game logic, handling UI and interactions.
- `src/machines/gameMachine.ts`: State management using XState for game flow.
- `src/utils/gameUtils.ts`: Utility functions for game logic, including path generation and move validation.

#### Adding New Features

To add new features, such as additional game modes or UI enhancements, you might start by introducing new states and transitions within the game machine (`src/machines/gameMachine.ts`). For instance, adding a "challenge mode" could involve creating new states for timed rounds, and integrating these within the existing state machine logic.

### Development Tips

- **State Management:** Familiarize yourself with XState documentation to effectively work with the state machine.
- **React and TypeScript:** Leverage React functional components and TypeScript for type safety and component reusability.
- **Environment Variables:** Use `.env` for sensitive or configurable settings to keep the game flexible and secure.
- **Sound Effects:** Replace sound files in `src/assets/sfx/` with your own, ensuring to maintain the file names or update references in `src/components/Game.tsx`.

### Contributing

Contributions are welcome! Please submit a pull request or open an issue for any features or bug fixes.

### License

Memorio is licensed under the GPL-3.0 License.
