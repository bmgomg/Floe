<script>
    import { fade } from 'svelte/transition';
    import { DLG_INTRO, DLG_LEVELS } from './const';
    import LevelOption from './Level Option.svelte';
    import { ss } from './state.svelte';
    import { windowSize } from './utils';

    const ul = '<ul style="margin: 15px 0 0 0;">';
    const li = '<li style="margin: 8px 0 0 -20px;">';
    const red = '<span style="color: var(--red)">';
    const blue = '<span style="color: var(--blue)">';
    const hi = '<span style="color: var(--lblue)">';

    const CONTENT = `
        <span>Reunite two stranded researchers at the center of the drifting ice field.</span>
        ${ul}
        ${li}Tap an ice floe beside the ${red}red</span>‑coated researcher to make them move.</li>
        ${li}Then, move the ${blue}blue</span>‑coated researcher.</li>
        ${li}Continue alternating until they meet on the ${hi}central</span> floe.</li>
        ${li}If a floe ${hi}thaws</span> beneath a researcher, they ${hi}fall through</span>—and the ${hi}mission ends</span> in failure.</li>
        ${li}Earn ${hi}points</span> for each safe ${hi}landing</span>—${hi}except</span> on floes you've already ${hi}visited</span>.</li>
        ${li}${hi}Time melts</span> your score—one point per second.</li>
        </ul>`;

    let scale = $state(1);

    $effect(() => {
        const onResize = () => {
            let scx = 1;
            let scy = 1;

            const { w, h } = windowSize();

            if (w < 600) {
                scx = w / 600;
            }

            if (h < 1100) {
                scy = h / 1100;
            }

            scale = Math.min(scx, scy);
        };

        onResize();

        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    });
</script>

{#if ss.dlg}
    <div
        class="dlg {ss.frogs.length ? '' : 'initial'}"
        style="width: {ss.dlg === DLG_LEVELS ? 'unset' : '540px'};transform: translate(-50%, -50%) scale({scale});"
        transition:fade={{ duration: 200 }}>
        {#if ss.dlg === DLG_INTRO}
            <div class="title grad-text grad-blue">
                <span>Go With The Floe</span>
            </div>
        {/if}
        <div class="content" tabindex="-1">
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html CONTENT}
        </div>
        <div class="buttons">
            <LevelOption level={1} />
            <LevelOption level={2} />
            <LevelOption level={3} />
        </div>
    </div>
{/if}

<style>
    .dlg {
        position: absolute;
        top: 50%;
        left: 50%;
        display: grid;
        justify-content: center;
        box-sizing: border-box;
        width: 540px;
        gap: 35px;
        z-index: 3;
        padding: 40px 30px 40px;
        background: #000000c0;
        backdrop-filter: blur(5px);
        border-radius: 50px;
        border: 3px solid #aac6ff;
    }

    .initial {
        background: #00000020;
    }

    .title {
        place-self: center;
        /* width: 50%; */
        display: grid;
        place-items: center;
        color: var(--lblue);
        font-family: Futura;
        font-weight: bold;
        font-size: 52px;
    }

    .content {
        color: #aac6ffa0;
        font-family: Quicksand;
        font-weight: bold;
        font-size: 22px;
        display: grid;
        align-content: start;
        place-self: center;
    }

    .buttons {
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        gap: 20px;
    }
</style>
