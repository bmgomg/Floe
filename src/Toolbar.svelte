<script>
    import Home from '$lib/images/Home.webp';
    import MusicOff from '$lib/images/Music Off.webp';
    import MusicOn from '$lib/images/Music On.webp';
    import ResetStats from '$lib/images/Reset Stats.webp';
    import SoundOff from '$lib/images/Sound Off.webp';
    import SoundOn from '$lib/images/Sound On.webp';
    import { DLG_INTRO, PROMPT_PLAY_AGAIN, PROMPT_RESET_STATS } from './const';
    import { persistGlobal, showDialog } from './shared.svelte';
    import { _sound } from './sound.svelte';
    import { _prompt, _stats, ss } from './state.svelte';
    import ToolButton from './Tool Button.svelte';

    const onHome = () => {
        if (ss.dlg === DLG_INTRO) {
            showDialog(false);

            if (ss.over) {
                _prompt.set(PROMPT_PLAY_AGAIN);
            }

            return;
        }

        showDialog(DLG_INTRO);
    };

    const onResetStats = () => {
        _sound.play('plop');

        if (_prompt.id == PROMPT_RESET_STATS) {
            _prompt.opacity = 0;
            return;
        }

        _sound.play('plop');
        _prompt.set(PROMPT_RESET_STATS);
    };

    const onSound = () => {
        _sound.sfx = !_sound.sfx;

        if (_sound.sfx) {
            _sound.play('won', { rate: 4 });
        }

        persistGlobal();
    };

    const onMusic = () => {
        _sound.music = !_sound.music;

        if (ss.frogs.length === 0) {
            return;
        }

        if (_sound.music) {
            _sound.playMusic();
        } else {
            _sound.stopMusic();
        }

        persistGlobal();
    };
</script>

<div class="toolbar">
    <ToolButton id="tb-home" src={Home} onClick={onHome} disabled={ss.dlg === DLG_INTRO && ss.cells.length === 0} />
    <ToolButton id="tb-reset-stats" src={ResetStats} onClick={onResetStats} disabled={_stats.plays === 0 || ss.dlg} />
    <ToolButton id="tb-sfx" src={_sound.sfx ? SoundOn : SoundOff} onClick={onSound} />
    <ToolButton id="tb-music" src={_sound.music ? MusicOn : MusicOff} onClick={onMusic} />
</div>

<style>
    .toolbar {
        grid-area: 5/1;
        place-self: center;
        display: grid;
        grid-auto-flow: column;
        place-content: center;
        gap: 10px;
    }
</style>
