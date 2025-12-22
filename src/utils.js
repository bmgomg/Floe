export const windowSize = () => {
    const d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = e.clientWidth || g.clientWidth,
        h = e.clientHeight || g.clientHeight;

    return { w, h };
};

export const clientRect = selector => {
    const ob = document.querySelector(selector);
    const r = ob?.getBoundingClientRect();

    return r;
};

export const underMouse = (event, selectors) => {
    for (const selector of selectors) {
        const r = clientRect(selector);

        if (!r) {
            continue;
        }

        const x = event.clientX;
        const y = event.clientY;

        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
            return true;
        }
    }

    return false;
};

export const focusOnApp = () => {
    document.querySelector('.app')?.focus();
};

export const isTouchable = () => navigator.maxTouchPoints > 0;

export const tapOrClick = (lower = false) => {
    const verb = isTouchable() ? 'Tap' : 'Click on';
    return lower ? verb.toLowerCase() : verb;
};

export const isAppleDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const scrollClass = () => `root-scroll ${isTouchable() ? 'root-scroll-mobile' : ''}`;

export const post = (fn, ms) => setTimeout(fn, ms);

export const range = (n) => [...Array(n + 1).keys()].slice(1);

export const cellId = (cell) => `cell-${cell.col}-${cell.row}`;

export const innerId = (cell) => `inner-${cell.col}-${cell.row}`;

export const neighbors = (c1, c2) => {
    const dx = Math.abs(c1.col - c2.col);
    const dy = Math.abs(c1.row - c2.row);

    return dx < 2 && dy < 3;
};

export const samePos = (one, two) => one?.row === two.row && one?.col === two.col;

export const dist = (c1, c2) => {
    const id1 = cellId(c1);
    const id2 = cellId(c2);

    const r1 = clientRect(`#${id1}`);
    const r2 = clientRect(`#${id2}`);

    const d = Math.hypot(r1.x - r2.x, r1.y - r2.y);
    return d;
};
