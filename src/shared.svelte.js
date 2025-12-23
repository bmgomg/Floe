import FrogBlue from '$lib/images/Girl.webp';
import FrogRed from '$lib/images/Boy.webp';
// import FrogYellow from '$lib/images/Frog Y.webp';
import { APP_KEY, LEVELS, TICK_MS } from './const';
import { _sound } from './sound.svelte';
import { _prompt, _stats, ss } from './state.svelte';
import { cellId, post } from './utils';

export const levelInfo = () => ss.level ? LEVELS[ss.level - 1] : {};

export const log = (value) => console.log($state.snapshot(value));

export const persistGlobal = () => {
    const json = { ..._sound };
    localStorage.setItem(APP_KEY, JSON.stringify(json));
};

export const persist = () => {
    let json = { ..._sound };
    localStorage.setItem(APP_KEY, JSON.stringify(json));

    json = JSON.stringify({ ..._stats });
    localStorage.setItem(ss.appKey(), json);
};

export const loadGame = () => {
    const json = localStorage.getItem(ss.appKey());
    const job = JSON.parse(json);

    if (job) {
        _stats.plays = job.plays;
        _stats.won = job.won;
        _stats.total_points = job.total_points;
        _stats.best_points = job.best_points;
    } else {
        _stats.plays = 0;
        _stats.won = 0;
        _stats.total_points = 0;
        _stats.best_points = 0;
    }
};

export const reBoard = (level) => {
    ss.reboard = 'hide';
    const ms = ss.frogs.length ? 800 : 100;

    post(() => {
        ss.reboard = 'show';
        post(() => delete ss.reboard, ms);

        ss.level = level;
        loadGame();
        onStart();
    }, ms);

};

export const showDialog = (value, plop = true) => {
    _prompt.opacity = 0;

    plop && _sound.play('plop');
    ss.dlg = value;
};

export const makeFrog = (src) => {
    const li = levelInfo();
    let f;

    switch (src) {
        case FrogRed:
            f = li.frogs[0];
            return { col: f[0], row: f[1], deg: 0, src };
        case FrogBlue:
            f = li.frogs[1];
            return { col: f[0], row: f[1], deg: 0, src };
        default:
    }
};

export const onStart = () => {
    if (!_sound.musicPlayed) {
        _sound.playMusic();
    }

    _sound.play('dice');

    delete ss.over;
    delete ss.spin;
    ss.turn = 1;
    ss.points = 0;
    ss.ticks = 0;
    ss.lastSecs = 0;
    delete ss.goTime;
    ss.cells = [];
    ss.frogs = [];

    post(() => {
        const li = levelInfo();

        for (let i = 0; i < li.size; i++) {
            const cell = { col: li.cx, row: i * 2 + 1, ticks: 0 };
            ss.cells.push(cell);
        }

        for (let i = 1; i < li.cx; i++) {
            for (let j = 0; j < li.size - i; j++) {
                let cell = { col: li.cx - i, row: i + (j * 2 + 1), ticks: 0 };
                ss.cells.push(cell);

                cell = { col: li.cx + i, row: i + (j * 2 + 1), ticks: 0 };
                ss.cells.push(cell);
            }
        }

        ss.frogs.push(makeFrog(FrogRed));
        ss.frogs.push(makeFrog(FrogBlue));

        clearInterval(ss.timer);
        ss.timer = setInterval(() => (ss.ticks += 1), TICK_MS);
    });
};

export const ring = (cell) => {
    const pos = cellId(cell).slice(5); // remove "cell-"
    const li = levelInfo();

    switch (li.size) {
        case 5:
            switch (pos) {
                case '3-5':
                    return 0;
                case '3-3':
                case '4-4':
                case '4-6':
                case '3-7':
                case '2-6':
                case '2-4':
                    return 1;
                default:
                    return 2;
            }
        case 7:
            switch (pos) {
                case '4-7':
                    return 0;
                case '4-5':
                case '5-6':
                case '5-8':
                case '4-9':
                case '3-8':
                case '3-6':
                    return 1;
                case '4-3':
                case '5-4':
                case '6-5':
                case '6-7':
                case '6-9':
                case '5-10':
                case '4-11':
                case '3-10':
                case '2-9':
                case '2-7':
                case '2-5':
                case '3-4':
                    return 2;
                default:
                    return 3;
            }
        case 9:
            switch (pos) {
                case '5-9':
                    return 0;
                case '5-7':
                case '6-8':
                case '6-10':
                case '5-11':
                case '4-10':
                case '4-8':
                    return 1;
                case '5-5':
                case '6-6':
                case '7-7':
                case '7-9':
                case '7-11':
                case '6-12':
                case '5-13':
                case '4-12':
                case '3-11':
                case '3-9':
                case '3-7':
                case '4-6':
                    return 2;
                case '5-3':
                case '6-4':
                case '7-5':
                case '8-6':
                case '8-8':
                case '8-10':
                case '8-12':
                case '7-13':
                case '6-14':
                case '5-15':
                case '4-14':
                case '3-13':
                case '2-12':
                case '2-10':
                case '2-8':
                case '2-6':
                case '3-5':
                case '4-4':
                    return 3;
                default: 4;
            }
    }
};

export const cellValue = (cell) => {
    const r = ring(cell);

    switch (r) {
        case 0:
            return 2;
        case 1:
            return 3;
        case 2:
            return 5;
        case 3:
            return 8;
        case 4:
        default:
            return 13;
    }
};
