var HTML_ELEMENT: HTMLElement;
var TIMEOUT: number | null = null;

/**
 * Initialize the message module.
 */
export function init() {
    HTML_ELEMENT = document.getElementById("Message")!;
}

/**
 * Show a message, optionally with a timeout before hiding.
 */
export function show(text: string, timeoutDuration = -1) {
    cancelTimeout();

    HTML_ELEMENT.innerHTML = text; // set the new message
    HTML_ELEMENT.classList.remove("hidden"); // show the message element

    if (timeoutDuration > 0) {
        TIMEOUT = window.setTimeout(function() {
            hide();
            TIMEOUT = null;
        }, timeoutDuration);
    }
}

/**
 * Hide the message.
 */
export function hide() {
    cancelTimeout();
    HTML_ELEMENT.classList.add("hidden");
}

/**
 * Cancel the show timeout (if it happens to be active at the moment).
 */
function cancelTimeout() {
    // a timeout is active, from a previous call. cancel it
    if (TIMEOUT !== null) {
        window.clearTimeout(TIMEOUT);
        TIMEOUT = null;
    }
}
