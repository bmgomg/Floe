<script>
    import Cell from './Cell.svelte';
    import { sqrt3 } from './const';
    import { levelInfo } from './shared.svelte';
    import { ss } from './state.svelte';
    import { cellId } from './utils';

    const li = $derived(levelInfo());
    const grid = $derived(`repeat(${li.size * 2}, ${ss.cellRadius}px) / repeat(${li.size}, ${ss.cellRadius * sqrt3}px)`);
</script>

<div
    class="board {ss.reboard === 'hide' ? 'hidden' : ''} {ss.over ? '' : ss.turn === 1 ? 'pointer-red' : ss.turn === 2 ? 'pointer-blue' : ''}"
    style="width: {sqrt3.pondWidth}px; height: {ss.pondHeight}px; grid: {grid};">
    {#each ss.cells as cell (cellId(cell))}
        <Cell {cell} />
    {/each}
</div>

<style>
    .board {
        grid-area: 3/1;
        place-self: center;
        display: grid;
        place-content: center;
        /* background: #fff3; */
        transition: 0.75s;
    }

    .hidden {
        scale: 0;
        opacity: 0;
    }

    .pointer-red {
        cursor: url('$lib/images/Pointer Red.webp'), auto;
    }

    .pointer-blue {
        cursor: url('$lib/images/Pointer Blue.webp'), auto;
    }
</style>
