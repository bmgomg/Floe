<script>
    import NumberFlow, { NumberFlowGroup } from '@number-flow/svelte';

    const { secs } = $props();

    const time = $derived.by(() => {
        const ds = (secs - Math.floor(secs)) * 10;
        const s = Math.floor(secs % 60);
        const m = Math.floor((secs / 60) % 60);
        const h = Math.floor(secs / (60 * 60));
        return { h, m, s, ds };
    });
</script>

<NumberFlowGroup>
    <div
        style="font-variant-numeric: tabular-nums; --number-flow-char-height: 0.85em;"
        class="~text-3xl/4xl flex items-baseline font-semibold group">
        <NumberFlow trend={1} value={time.m} digits={{ 1: { max: 5 } }} format={{ minimumIntegerDigits: 1 }} />
        <NumberFlow prefix=":" trend={1} value={time.s} digits={{ 1: { max: 5 } }} format={{ minimumIntegerDigits: 2 }} />
    </div>
</NumberFlowGroup>

<style>
    .group {
        grid-area: 1/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        transition: opacity 0.5s;
        color: var(--rose);
        /* filter: drop-shadow(0 0 1px white); */
    }
</style>
