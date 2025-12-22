<script>
    import NumberFlow from '@number-flow/svelte';
    import { persist } from './shared.svelte';
    import { _prompt, _stats, ss } from './state.svelte';
    import Timer from './Timer.svelte';
    import { post } from './utils';
    import { fade } from 'svelte/transition';
    import { PROMPT_BEST_SCORE } from './const';

    let lastSecs = 0;
    let secs = $state(0);
    const score = $derived(Math.max(0, ss.points - Math.floor(secs)));

    $effect(() => {
        if (!ss.ticks || !ss.goTime) {
            secs = 0;
            return;
        }

        const elapsed = +((Date.now() - ss.goTime) / 1000).toFixed(1);

        if (ss.over === 'won') {
            post(() => {
                _stats.total_points += score;

                if (score > _stats.best_points) {
                    _stats.best_points = score;

                    if (_stats.won > 0) {
                        _prompt.set(PROMPT_BEST_SCORE);
                    }
                }

                persist();
            });

            secs = elapsed;
            return;
        }

        if (elapsed !== lastSecs) {
            lastSecs = elapsed;
        }

        secs = lastSecs;
    });

    const time = $derived.by(() => {
        const ds = (secs - Math.floor(secs)) * 10;
        const s = Math.floor(secs % 60);
        const m = Math.floor((secs / 60) % 60);
        const h = Math.floor(secs / (60 * 60));
        return { h, m, s, ds };
    });
</script>

<div class="counters {time.h || time.m || time.s || time.ds ? '' : 'hidden'}">
    <Timer {secs} />
    <div class="score">
        <div class="flow"><NumberFlow value={score} /></div>
        {#if ss.over && ss.over !== 'won'}
            <div class="strike" transition:fade></div>
            <div class="counter-strike" transition:fade></div>
        {/if}
    </div>
</div>

<style>
    .counters {
        grid-area: 2/1;
        font-family: Quicksand;
        font-weight: bold;
        font-size: 36px;
        place-self: center;
        display: grid;
        grid: auto / 1fr 1fr;
        gap: 50px;
        align-items: center;
    }

    .score {
        grid-area: 1/2;
        place-self: center;
        color: var(--white);
        display: grid;
        place-items: center;
    }

    .flow {
        grid-area: 1/1;
        filter: drop-shadow(0 0 3px #000000a0);
    }

    .strike {
        grid-area: 1/1;
        background: var(--red);
        width: 140%;
        max-width: 65px;
        border: 2px solid var(--red);
        border-radius: 2px;
        box-sizing: border-box;
        z-index: 1;
        rotate: -25deg;
        filter: drop-shadow(0 0 2px black);
    }

    .hidden {
        opacity: 0;
    }
</style>
