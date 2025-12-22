<script>
    import LilyPad from '$lib/images/Lily Pad.webp';
    import { reBoard } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { ss } from './state.svelte';
    import { post } from './utils';

    const { level } = $props();
    const sz = 80;
    const fsz = sz * 0.5;
    let pressed = $state();
    let timer = $state();
    let _this = $state();
    const current = $derived(level === ss.level && ss.frogs.length);
    const SIZES = ['S', 'M', 'L'];

    $effect(() => {
        const onTransitionEnd = () => {
            if (pressed) {
                pressed = false;
            } else {
                post(onPick);
            }
        };

        const onPick = () => {
            delete ss.dlg;

            if (ss.level === level && ss.frogs.length && !ss.over) {
                return;
            }

            reBoard(level);
        };

        _this.addEventListener('transitionend', onTransitionEnd);
        return () => _this.removeEventListener('transitionend', onTransitionEnd);
    });

    const onPointerDown = () => {
        if (timer) {
            return;
        }

        _sound.play('plop');
        pressed = true;

        timer = post(() => (timer = null), 500);
    };
</script>

<div bind:this={_this} class="button no-highlight {current ? 'current' : ''} {pressed ? 'pressed' : ''}" onpointerdown={onPointerDown}>
    <img class="lilypad" src={LilyPad} alt="" width={sz} />
    <div class="value" style="font-size: {fsz}px">{SIZES[level - 1]}</div>
</div>

<style>
    .button {
        display: grid;
        place-items: center;
        cursor: pointer;
        transition: transform 0.1s;
        border-radius: 50%;
        box-sizing: border-box;
        border: 2px solid #0000;
        padding: 2px;
    }

    .button:hover {
        filter: contrast(1.2) brightness(1.2);
    }

    .pressed {
        transform: scale(0.7);
    }

    .lilypad {
        grid-area: 1/1;
        border-radius: 50%;
        background: var(--darkgreen);
    }

    .current {
        border: 4px dotted var(--white);
    }

    .value {
        grid-area: 1/1;
        color: var(--white);
        font-weight: bold;
        font-family: Quicksand;
        filter: drop-shadow(0 0 5px black);
    }
</style>
