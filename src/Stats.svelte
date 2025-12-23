<script>
    import NumberFlow from '@number-flow/svelte';
    import { _stats, ss } from './state.svelte';
    import { windowSize } from './utils';
    import { fade } from 'svelte/transition';

    const ave = () => (_stats.won ? Math.round(_stats.total_points / _stats.won) : 0);

    let scale = $state(1);

    $effect(() => {
        const onResize = () => {
            let scx = 1;

            const { w } = windowSize();

            if (w < 400) {
                scx = w / 400;
            }

            scale = scx;
        };

        onResize();

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    });

    const flow = $derived(`flow ${ss.frogs.length ? '' : 'hidden'}`);
</script>

<div class="stats" style="scale: {scale};" transition:fade>
    <div class="item">
        <span class="label">STARTED</span>
        <div class={flow}><NumberFlow value={_stats.plays} /></div>
    </div>
    <div class="item">
        <span class="label">FINISHED</span>
        <div class={flow}><NumberFlow value={_stats.won} /></div>
    </div>
    <div class="item">
        <span class="label">AVE</span>
        <div class={flow}><NumberFlow value={ave()} /></div>
    </div>
    <div class="item">
        <span class="label">BEST</span>
        <div class={flow}><NumberFlow value={_stats.best_points} /></div>
    </div>
</div>

<style>
    .stats {
        grid-area: 1/1;
        display: grid;
        grid-auto-flow: column;
        padding: 5px 20px 3px;
        place-self: center;
        place-content: center;
        gap: 20px;
        border-radius: 50vh;
        border: 2px solid var(--lightblue);
        background: #284367;
        color: var(--lightblue);
        filter: drop-shadow(0 0 3px #000000a0);
    }

    .item {
        box-sizing: border-box;
        font-family: Roboto Condensed;
        font-size: 15px;
        border-radius: 50vh;
        display: grid;
        grid-auto-flow: column;
        gap: 10px;
        align-items: center;
        place-content: center;
    }

    .label {
        color: var(--label);
    }

    .flow {
        margin-bottom: 0px;
        filter: drop-shadow(0 0 1px black);
    }

    .hidden {
        opacity: 0;
    }
</style>
