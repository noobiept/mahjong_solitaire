import * as Game from "./game.js";

// reference to html elements
let GAME_MENU_CONTAINER: HTMLElement;

/**
 * Initialize the game menu elements.
 */
export function init() {
    const gameMenu = document.getElementById("GameMenu")!;

    const shuffle = document.getElementById("GameMenu-shuffle")!;
    const shadow = document.getElementById("GameMenu-shadow")!;
    const shadowValue = shadow.querySelector("span")!;
    const help = document.getElementById("GameMenu-help")!;
    const restart = document.getElementById("GameMenu-restart")!;
    const quit = document.getElementById("GameMenu-quit")!;

    shuffle.onclick = function () {
        Game.getActiveMap().shuffle();
        Game.updateInformation();
    };

    shadow.onclick = function () {
        const shadowOn = Game.getShadowOption();

        if (shadowOn) {
            Game.setShadowOption(false);
            Game.unShadowTiles();

            shadowValue.innerText = "Off";
        } else {
            Game.setShadowOption(true);
            Game.shadowTiles();

            shadowValue.innerText = "On";
        }
    };

    help.onclick = function () {
        Game.highlightRandomPair();
    };

    restart.onclick = function () {
        Game.restart();
    };

    quit.onclick = function () {
        Game.quit();
    };

    GAME_MENU_CONTAINER = gameMenu;
}

/**
 * Show the game menu html elements.
 */
export function show() {
    GAME_MENU_CONTAINER.classList.remove("hidden");
}

/**
 * Hide the html elements.
 */
export function clear() {
    GAME_MENU_CONTAINER.classList.add("hidden");
}
