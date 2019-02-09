let AUDIO: HTMLAudioElement;
let AUDIO_CONTROL: HTMLElement;

/**
 * Initialize the audio module.
 */
export function init() {
    AUDIO = document.getElementById("AudioElement") as HTMLAudioElement;
    AUDIO_CONTROL = document.getElementById("AudioControl")!;
    AUDIO_CONTROL.onclick = function() {
        mute();
    };
    AUDIO_CONTROL.classList.remove("hidden");
}

/**
 * Play the background music.
 */
export function playMusic() {
    AUDIO.play();
}

/**
 * Stop the music playback.
 */
export function stopMusic() {
    AUDIO.pause();
    AUDIO.currentTime = 0;
}

/**
 * Mute/un-mute the game sound.
 * If the argument is not provided then it toggles the current state.
 */
export function mute(yes?: boolean) {
    if (typeof yes === "undefined") {
        yes = !AUDIO.muted; // toggle the value
    }

    AUDIO.muted = yes;

    if (yes) {
        AUDIO_CONTROL.classList.add("inactive");
    } else {
        AUDIO_CONTROL.classList.remove("inactive");
    }
}
