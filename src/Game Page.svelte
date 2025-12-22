<script>
    import { onMount } from 'svelte';
    import Board from './Board.svelte';
    import { APP_KEY } from './const';
    import Prompt from './Prompt.svelte';
    import Counters from './Counters.svelte';
    import { _sound } from './sound.svelte';
    import Stats from './Stats.svelte';
    import Toolbar from './Toolbar.svelte';
    import { post } from './utils';
    import PondValue from './Pond Value.svelte';

    onMount(() => {
        const loadGlobal = () => {
            const json = localStorage.getItem(APP_KEY);
            const job = JSON.parse(json);

            if (job) {
                _sound.sfx = job.sfx;
                _sound.music = job.music;
            }
        };

        post(loadGlobal);
    });
</script>

<div class="game-page">
    <Stats />
    <Counters />
    <Board />
    <Prompt />
    <PondValue />
    <Toolbar />
</div>

<style>
    .game-page {
        grid-area: 1/1;
        display: grid;
        grid: 50px 100px 1fr 100px 50px / 1fr;
        color: white;
        font-family: Quicksand;
        place-content: center;
        /* background: #0004; */
        box-sizing: border-box;
        /* outline: 1px solid red; */
    }
</style>
