<script>
    import { _prompt } from './state.svelte';
    import { post } from './utils';

    const { op } = $props();

    let scale = $state(1);
    const style = $derived(`transform: scale(${scale})`);

    $effect(() => {
        const onTransitionEnd = (e) => {
            if (e.target.id !== op.label) {
                return;
            }

            if (scale < 1) {
                scale = 1;
            } else {
                post(() => op.onClick(op.label));
                _prompt.opacity = 0;
            }
        };

        window.addEventListener('transitionend', onTransitionEnd);
        return () => window.removeEventListener('transitionend', onTransitionEnd);
    });
</script>

<div id={op.label} class='button-base no-highlight button' style={`${op.style}; ${style}`} onpointerdown={() => (scale = 0.8)}>
    {op.label}
</div>

<style>
    .button {
        cursor: pointer;
        font-size: 22px;
        box-sizing: border-box;
        padding: 10px 20px;
        font-family: Quicksand;
        font-weight: bold;
        color: var(--lblue);
        border-radius: 50vh;
        border: 3px solid var(--lblue);
        background: #284367;
        filter: drop-shadow(0 0 3px #000000a0);
    }

    .button:hover {
        filter: contrast(1.1) saturate(1.5);
        border: 3px solid #fff;
        color: white;
    }
</style>
