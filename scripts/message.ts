import { outerHeight } from "./utilities.js";

var HTML_ELEMENT: HTMLElement;
var TIMEOUT: number | null = null;

export function init() {
    HTML_ELEMENT = document.getElementById("Message")!;

    center();
    HTML_ELEMENT.style.display = "block";
}

export function show(text: string, centerMessage = true, timeoutDuration = -1) {
    cancelTimeout();

    if (centerMessage !== false) {
        center();
    }

    // set the new message
    HTML_ELEMENT.style.display = "block";
    HTML_ELEMENT.innerHTML = text;

    if (timeoutDuration > 0) {
        TIMEOUT = window.setTimeout(function() {
            hide();
            TIMEOUT = null;
        }, timeoutDuration);
    }
}

export function hide() {
    cancelTimeout();
    HTML_ELEMENT.style.display = "none";
}

export function center() {
    const gameMenu = document.getElementById("GameMenu")!;
    var height = window.outerHeight - outerHeight(gameMenu);

    HTML_ELEMENT.style.top = height / 2 + "px";
}

function cancelTimeout() {
    // a timeout is active, from a previous call. cancel it
    if (TIMEOUT !== null) {
        window.clearTimeout(TIMEOUT);
        TIMEOUT = null;
    }
}
