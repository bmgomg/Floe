export const APP_KEY = 'LOF V1';
export const APP_KEYS = [
    APP_KEY + ' • 1',
    APP_KEY + ' • 2',
    APP_KEY + ' • 3',
    APP_KEY + ' • 4',
    APP_KEY + ' • 5',
    APP_KEY + ' • 6',
];
export const X = '✖';
export const GAME_PAGE = 'GAME PAGE';
export const PROMPT_TRANSITION = 300;
export const sqrt3 = Math.sqrt(3);
export const SINK_DURATION = 2000;
export const DLG_INTRO = 'INTRO';
export const DLG_HELP = 'HELP';
export const DLG_LEVELS = 'LEVELS';
export const PROMPT_RESET_STATS = 'Reset stats?';
export const PROMPT_LOST = 'Oh, no! Try again?';
export const PROMPT_WON = 'Reunited! New mission?';
export const PROMPT_BEST_SCORE = 'Best score! New mission?';
export const PROMPT_PLAY_AGAIN = 'Try again?';
export const TICK_MS = 10;

export const LEVELS = [
    { size: 5, cx: 3, cy: 5, secs: 12, frogs: [[3, 1], [3, 9]] },
    { size: 7, cx: 4, cy: 7, secs: 15, frogs: [[4, 1], [4, 13]] },
    { size: 9, cx: 5, cy: 9, secs: 18, frogs: [[5, 1], [5, 17]] },
    { size: 5, cx: 3, cy: 5, secs: 12, frogs: [[3, 1], [5, 7], [1, 7]] },
    { size: 7, cx: 4, cy: 7, secs: 15, frogs: [[4, 1], [7, 10], [1, 10]] },
    { size: 9, cx: 5, cy: 9, secs: 18, frogs: [[5, 1], [9, 13], [1, 13]] },
];

// export const POND_SIZE = 7;
// export const CX = (POND_SIZE + 1) / 2;
// export const CY = POND_SIZE;
// export const LAST_ROW = POND_SIZE * 2 - 1;
// export const CELL_RADIUS = 40;
// export const CELL_SIZE = CELL_RADIUS * 2;
// export const CELL_PADDING = CELL_RADIUS * 0.1;
// export const POND_DX = sqrt3 * CELL_RADIUS * POND_SIZE;
// export const POND_DY = 2 * CELL_RADIUS * POND_SIZE;
