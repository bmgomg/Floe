<script>
    import { sqrt3 } from '../const';
    import Dialog from '../Dialog.svelte';
    import GamePage from '../Game Page.svelte';
    import { levelInfo } from '../shared.svelte';
    import Splash from '../Splash.svelte';
    import { ss } from '../state.svelte';
    import { post, windowSize } from '../utils';

    $effect(() => {
        const disable = (e) => {
            e.preventDefault();
        };

        const onResize = () => {
            const { w, h } = windowSize();
            ss.vert = h > w;

            let dx = Math.min(460, w * 0.9);
            const dy = (dx * 2) / sqrt3;

            if (dy > h - 300) {
                dx = (h - 300) * (sqrt3 / 2);
            }

            const li = levelInfo();
            ss.cellRadius = dx / (sqrt3 * li.size);
            ss.cellSize = ss.cellRadius * 2;
            ss.cellPadding = ss.cellRadius * 0.1;
            ss.pondWidth = sqrt3 * ss.cellRadius * li.size;
            ss.pondHeight = 2 * ss.cellRadius * li.size;
        };

        onResize();

        window.addEventListener('contextmenu', disable);
        window.addEventListener('dblclick', disable);
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('contextmenu', disable);
            window.removeEventListener('dblclick', disable);
            window.removeEventListener('resize', onResize);
        };
    });

    let splash = $state(true);
    post(() => (splash = false), 2000);
</script>

<div class="app">
    <GamePage />
    <Dialog />
    {#if splash}
        <Splash />
    {/if}
</div>

<style>
    /* :root {
    } */

    :global {
        body {
            margin: 0;
            overflow: hidden;
            background: #202020;
            --gold: #ffe4aa;
            --white: #fff;
            --red: #fe0000;
            --rose: #ff6867;
            --blue: #00bbff;
            --yellow: #ca7e31;
            --darkblue: #124267;
            --lightgreen: #c6ffaa;
            --lightblue: #aac6ff;
            /* --label: #001c45; */
            --label: #ffffff40;
        }

        .button-base {
            box-sizing: border-box;
            cursor: pointer;
            display: grid;
            place-content: center;
            transition: transform 0.1s;
        }

        .button-base:focus {
            outline: none !important;
        }

        .no-highlight {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

		.grad-blue {
			background: -webkit-linear-gradient(-90deg, #fff 0%, #aac6ff 65%, #aac6ff 100%);
		}

		.grad-text {
			background-clip: text;
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
    }

    .app {
        display: grid;
        height: 100dvh;
        -webkit-user-select: none;
        user-select: none;
        overflow: hidden;
        touch-action: manipulation;
        outline: none !important;
        background-image: url('$lib/images/Landscape.webp');
        background-size: cover;
        background-position: center;
        place-content: center;
    }

    @font-face {
        font-family: Futura;
        src: url('$lib/fonts/FuturaCyrillicBold.ttf');
    }

    @font-face {
        font-family: Quicksand;
        src: url('$lib/fonts/Quicksand.ttf');
    }

    @font-face {
        font-family: 'Roboto Condensed';
        src: url('$lib/fonts/Roboto Condensed.ttf');
    }

    @font-face {
        font-family: 'Roboto Mono';
        src: url('$lib/fonts/Roboto Mono.ttf');
    }
</style>
