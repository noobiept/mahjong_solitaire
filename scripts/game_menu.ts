import * as Game from "./game.js";
import * as MainMenu from "./main_menu.js";

// reference to html elements
var GAME_MENU_CONTAINER: HTMLElement;

export function init() {
    var gameMenu = document.getElementById("GameMenu")!;

    var shuffle = document.getElementById("GameMenu-shuffle")!;
    var shadow = document.getElementById("GameMenu-shadow")!;
    var shadowValue = shadow.querySelector("span")!;
    var help = document.getElementById("GameMenu-help")!;
    var restart = document.getElementById("GameMenu-restart")!;
    var quit = document.getElementById("GameMenu-quit")!;

    shuffle.onclick = function() {
        Game.getActiveMap().shuffle();
        Game.updateInformation();
    };

    shadow.onclick = function() {
        var shadowOn = Game.getShadowOption();

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

    help.onclick = function() {
        Game.highlightRandomPair();
    };

    restart.onclick = function() {
        Game.restart();
    };

    quit.onclick = function() {
        MainMenu.open();
    };

    GAME_MENU_CONTAINER = gameMenu;
}

export function show() {
    GAME_MENU_CONTAINER.style.display = "inline-flex";
}

/**
 * Hide the html elements.
 */
export function clear() {
    GAME_MENU_CONTAINER.style.display = "none";
}
