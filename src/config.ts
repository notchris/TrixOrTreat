// Game
const GAME_WIDTH = 1024
const GAME_HEIGHT = 768
const DEBUG = false

const GRAVITY = -9.82;

// PLAYER
const PLAYER_WIDTH = 3
const PLAYER_DEPTH = 10
const PLAYER_HEIGHT = 0.2
const PLAYER_OFFSET = -4

// Render

const FIXED_STEP = 1.0 / 300.0; // 300 fps fixed timestep
const MAX_SUBSTEPS = 3;

export {
    GAME_WIDTH,
    GAME_HEIGHT,
    DEBUG,
    GRAVITY,
    FIXED_STEP,
    MAX_SUBSTEPS,
    PLAYER_OFFSET,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_DEPTH
};
