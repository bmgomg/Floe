<script>
    import NumberFlow from '@number-flow/svelte';
    import { _prompt, ss } from './state.svelte';
    import { cellValue } from './shared.svelte';
    import { fade } from 'svelte/transition';
</script>

{#if !_prompt.opacity && !ss.dlg}
    <div class="pond-value" transition:fade={{ duration: 100 }}>
        <div class="item">
            <span class="label">POND VALUE</span>
            <div class="flow"><NumberFlow value={ss.cells.reduce((sum, cell) => sum + cellValue(cell), 0)} /></div>
        </div>
    </div>
{/if}

<style>
    .pond-value {
        grid-area: 4/1;
        display: grid;
        grid-auto-flow: column;
        padding: 4px 20px 2px;
        place-self: center;
        place-content: center;
        gap: 20px;
        border-radius: 50vh;
        /* border: 2px solid #001c45; */
        border: 2px solid var(--lightblue);
        background: #284367;
        color: var(--lightblue);
        font-size: 18px;
        filter: drop-shadow(0 0 3px #000000a0);
    }

    .item {
        box-sizing: border-box;
        font-family: Roboto Condensed;
        border-radius: 50vh;
        display: grid;
        grid-auto-flow: column;
        gap: 10px;
        align-items: center;
        place-content: center;
    }

    .label {
        /* color: black; */
        color: #001c45;
    }

    .flow {
        margin-bottom: 0px;
        filter: drop-shadow(0 0 1px black);
    }
</style>
