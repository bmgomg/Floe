<script>
    import { post } from './utils';

    const { id, src, width = 50, disabled, onClick } = $props();

    let pressed = $state(false);
    let timer = $state(false);

    const classes = $derived(['button-base no-highlight button', { pressed }, { disabled }]);
    const style = $derived(`width: ${width}px; height: ${width}px;`);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== id) {
                return;
            }

            if (e.propertyName === 'opacity' || e.propertyName === 'background-color' || e.propertyName === 'filter') {
                return;
            }

            if (pressed) {
                pressed = false;
            } else {
                post(onClick);
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });

    const onPointerDown = () => {
        if (timer) {
            return;
        }

        pressed = true;

        timer = post(() => (timer = null), 500);
    };
</script>

<div {id} class={classes} onpointerdown={onPointerDown} {style}>
    <img class="img" {src} alt="" {width} />
</div>

<style>
    .button {
        place-self: center;
        display: grid;
        place-items: center;
        border-radius: 25%;
        transition: transform 0.1s;
        filter: drop-shadow(0 0 3px black);
    }

    .button:hover {
        filter: drop-shadow(0 0 10px white);
    }

    .pressed {
        transform: scale(0.7);
    }

    .disabled {
        cursor: initial;
        pointer-events: none;
        filter: grayscale(1);
        opacity: 0.5;
    }

    .button:focus {
        outline: none !important;
    }

    .img {
        grid-area: 1/1;
        /* filter: invert(1); */
    }
</style>
