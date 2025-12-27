<script>
    import Both from '$lib/images/Both.webp';
    import Floe from '$lib/images/Floe.webp';
    import HeartBroken from '$lib/images/Heart Broken.webp';
    import Heart from '$lib/images/Heart.webp';
    import { random } from 'lodash-es';
    import { fade } from 'svelte/transition';
    import { PROMPT_LOST, PROMPT_WON, SINK_DURATION } from './const';
    import { cellValue, levelInfo, persist } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, _stats, ss } from './state.svelte';
    import { cellId, clientRect, innerId, neighbors, post, samePos } from './utils';

    const { cell } = $props();
    const { col, row } = $derived(cell);
    const li = $derived(levelInfo());
    const center = $derived(col === li.cx && row === li.cy);
    const startPos = $derived(li.frogs.some((f) => samePos({ col: f[0], row: f[1] }, cell)));
    let show = $derived(startPos);
    let warn = $state(false);
    const hotFrog = $derived(ss.frogs[ss.turn - 1]);
    let ticks = $derived(cell.ticks);
    let enabled = $state(false);
    const frogs = $derived(ss.frogs.filter((f) => samePos(cell, f)));
    const frog = $derived(frogs.length ? frogs[0] : null);
    const cid = $derived(cellId(cell));
    let _frog = $state();
    const shadow = $derived(`drop-shadow(0 0 ${3 - (li.size - 5) / 2}px var(--lblue))`);

    const float = (on) => {
        show = (on || ss.over) && ss.over !== cell;

        if (ss.over) {
            return;
        }

        const ms = on ? (center ? random(2000, 7000) : li.secs * 1000) : random(2000, 4000);
        post(() => float(!show), ms);

        if (show) {
            post(() => (warn = true), ms - 1500);
        } else {
            warn = false;
        }
    };

    $effect(() => {
        if (!startPos || !frog) {
            post(() => float(true), random(0, 10000));
        }
    });

    const sunken = () => {
        if (ss.reboard) {
            return;
        }

        const r = clientRect(`#${innerId(cell)}`);

        if (r) {
            return r.width < ss.cellRadius - ss.cellPadding;
        }

        return false;
    };

    const isEnabled = () => {
        if (ss.over) {
            return false;
        }

        if (ss.reboard) {
            return false;
        }

        if (!center && ss.frogs.some((f) => samePos(f, cell))) {
            return false;
        }

        if (!neighbors(cell, hotFrog)) {
            return false;
        }

        return !sunken();
    };

    $effect(() => {
        if (ss.ticks <= ticks) {
            return;
        }

        enabled = isEnabled();

        if (ss.over) {
            return;
        }

        ticks = ss.ticks;

        if (frog && !frog.dest) {
            if (sunken()) {
                onOver(cell);
            }
        }
    });

    const onOver = (over) => {
        clearInterval(ss.timer);
        ss.over = over;

        const won = over === 'won';

        if (won) {
            show = true;

            _stats.won += 1;
            persist();
        }

        if (won) {
            post(() => _sound.play('won'), 300);
        } else {
            _sound.play('lost');
        }

        _prompt.set(null);
        post(() => _prompt.set(won ? PROMPT_WON : PROMPT_LOST));
    };

    const checkOver = () => {
        if (ss.frogs.every((f) => samePos(f, { col: li.cx, row: li.cy }))) {
            onOver('won');
        }
    };

    const startTimer = () => {
        ss.goTime = Date.now();
        _stats.plays += 1;
        persist();
    };

    const calcJump = () => {
        const { dest } = frog;
        const r1 = clientRect(`#${cid}`);
        const r2 = clientRect(`#${cellId(dest)}`);
        const dx = r2.left - r1.left;
        const dy = r2.top - r1.top;

        return `translate(${dx}px, ${dy}px)`;
    };

    const onPointerDown = () => {
        if (ss.frogs.some((f) => f.dest)) {
            return;
        }

        _sound.play('plop');

        if (!cell.visited) {
            const cob = ss.cells.find((c) => samePos(c, cell));
            cob.visited = true;

            const value = cellValue(cell);
            ss.points += value;
        }

        if (!ss.goTime) {
            startTimer();
        }

        ss.frogs[ss.turn - 1].dest = { col, row };
    };

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.propertyName !== 'transform') {
                return;
            }

            const dest = { ...ss.frogs[ss.turn - 1].dest };

            ss.frogs[ss.turn - 1].col = dest.col;
            ss.frogs[ss.turn - 1].row = dest.row;

            delete ss.frogs[ss.turn - 1].dest;

            checkOver();

            if (ss.over == 'won') {
                post(() => {
                    ss.spin = 1;
                    post(() => (ss.spin = 2), 750);
                });
            } else {
                ss.turn = ss.level < 4 ? 3 - ss.turn : ss.turn === 3 ? 1 : ss.turn + 1;
            }
        };

        _frog?.addEventListener('transitionend', onTransitionEnd);
        return () => _frog?.removeEventListener('transitionend', onTransitionEnd);
    });

    const classes = $derived(
        `cell no-highlight ${center && ss.spin ? 'spin' : ''} ${enabled && !ss.over ? (ss.turn === 1 ? 'trace-red' : ss.turn === 2 ? 'trace-blue' : 'trace-yellow') : ''}`,
    );

    const style = $derived(
        `grid-area: ${row}/${col}/span 2/span 1; width: ${ss.cellSize}px; padding: ${ss.cellPadding}px; z-index: ${frog?.dest ? 1 : 0};`,
    );
</script>

<div id={cid} class={classes} {style} onpointerdown={onPointerDown}>
    {#if center}
        <div class="trace-center"></div>
    {/if}
    <div
        id={innerId(cell)}
        class="inner {show || (center && ss.over === 'won') ? 'show' : ''}"
        style="transition-duration: {SINK_DURATION}ms;">
        <img
            class="lilypad {warn && !ss.over ? 'warn' : ''}"
            src={Floe}
            alt=""
            style="scale: {center ? 1 : 1};" />
        <img
            class="lily {ss.over && !frog && cell.visited ? 'visible' : ''}"
            src={ss.over === 'won' ? Heart : HeartBroken}
            alt=""
            style="filter: drop-shadow(0 0 {5 - ss.level}px #fff);" />
        {#if ss.over === 'won'}
            {#if center}
                {#if ss.spin === 1}
                    {#each frogs as f (f)}
                        <img class="frog" src={f.src} alt="" />
                    {/each}
                {/if}
                {#if ss.spin}
                    <img
                        class="frog"
                        style="filter: drop-shadow(0 0 {5 - ss.level}px #000000);"
                        src={Both}
                        alt=""
                        in:fade={{ duration: 750 }} />
                {/if}
            {/if}
        {:else if frog}
            {@const transform = frog.dest ? calcJump() : ''}
            <img
                bind:this={_frog}
                class="frog {frog === hotFrog && !ss.over ? 'pulse' : ''}"
                src={frog.src}
                alt=""
                style="transform: {transform}; filter: drop-shadow(0 0 {5 - ss.level}px #000000);"
                out:fade={{ duration: 100 }} />
        {/if}
    </div>
    {#if !frog && !samePos(hotFrog?.dest, cell) && !cell.visited && !ss.over}
        {@const fsz = ss.cellRadius * 0.7}
        <div class="value-container" style="font-size: {fsz}px; z-index: {center ? 3 : 1};" transition:fade={{ duration: 100 }}>
            <div class="value" style="filter: {shadow};">{cellValue(cell)}</div>
        </div>
    {/if}
    <div class="pos">
        {#if false}
            {cid.slice(5)}
        {/if}
    </div>
</div>

<style>
    .cell {
        place-self: center;
        display: grid;
        box-sizing: border-box;
        aspect-ratio: 1;
        border-radius: 50%;
        /* background: #0007; */
        pointer-events: none;
        border: 4px dotted transparent;
        transition:
            border-color 0.2s,
            rotate 1.5s 0.3s;
    }

    .trace-red,
    .trace-blue,
    .trace-yellow {
        border: 4px dotted;
        pointer-events: auto;
        /* cursor: pointer; */
        z-index: 1;
    }

    .trace-red {
        border-color: #ee0022b0;
    }

    .trace-blue {
        border-color: #00bbffb0;
    }

    .trace-yellow {
        border-color: #ca7e31b0;
    }

    .trace-center {
        grid-area: 1/1;
        box-sizing: border-box;
        scale: 1.15;
        background-image: url('$lib/images/Outline.webp');
        background-size: cover;
        filter: drop-shadow(0 0 3px white);
        z-index: -1;
    }

    .inner {
        grid-area: 1/1;
        display: grid;
        place-items: center;
        opacity: 0;
        scale: 0;
        pointer-events: none;
        transition-property: scale opacity;
    }

    .show {
        scale: 1;
        opacity: 1;
    }

    .lilypad {
        grid-area: 1/1;
        width: 100%;
        transition: filter 1s;
        border-radius: 50%;
        filter: drop-shadow(0 0 3px #000000);
    }

    .warn {
        filter: hue-rotate(180deg) sepia(1);
    }

    .frog {
        grid-area: 1/1;
        width: 70%;
        z-index: 2;
        transition: transform 0.2s 0s;
        border-radius: 50%;
    }

    .spin {
        rotate: 720deg;
    }

    .lily {
        grid-area: 1/1;
        width: 70%;
        z-index: 1;
        transition: opacity 1s;
        opacity: 0;
    }

    .visible {
        opacity: 1;
    }

    .value-container {
        grid-area: 1/1;
        place-self: center;
        z-index: 1;
        width: 50%;
        height: 50%;
        border-radius: 50%;
        display: grid;
        place-items: center;
        filter: drop-shadow(0 0 1px black);
    }

    .value {
        grid-area: 1/1;
        font-weight: bold;
        color: var(--white);
    }

    .visited {
        grid-area: 1/1;
        place-self: center;
        z-index: 1;
        width: 25%;
    }

    .pos {
        grid-area: 1/1;
        place-self: center;
        z-index: 1;
    }

    .pulse {
        animation: pulse 0.2s alternate infinite ease-in-out;
    }

    @keyframes pulse {
        from {
            scale: 1;
        }
        to {
            scale: 0.9;
        }
    }
</style>
