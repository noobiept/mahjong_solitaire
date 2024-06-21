import * as Game from "./game.js";
import * as HighScore from "./high_score.js";
import * as Utilities from "./utilities.js";
import { MapInfo } from "./map.js";
import { stopMusic } from "./sound.js";
import { setData } from "./app_storage.js";

let MENU: HTMLElement;
let HIGH_SCORE: HTMLElement;

// has the mapInfo of the maps (the .json loaded from /maps/)
let MAPS_AVAILABLE: MapInfo[] = [];
let SELECTED_MAP = -1;

// has reference for the html elements used to select the map in the main menu
let MAPS_ELEMENTS: Element[] = [];

/**
 * Initialize the main menu. Pass as arguments the maps to be shown and which one is to be initially selected.
 */
export function init(maps: MapInfo[], initialSelectedMap?: number) {
    MENU = document.getElementById("MainMenu")!;
    HIGH_SCORE = document.getElementById("HighScore")!;

    const startGame = document.getElementById("MainMenu-startGame")!;
    const twoPlayers = document.getElementById("MainMenu-twoPlayers")!;
    const highScore = document.getElementById("MainMenu-highScore")!;

    startGame.onclick = function (event) {
        hide();
        Game.start(MAPS_AVAILABLE[SELECTED_MAP], false);

        event.stopPropagation();
    };

    twoPlayers.onclick = function (event) {
        hide();
        Game.start(MAPS_AVAILABLE[SELECTED_MAP], true);

        event.stopPropagation();
    };

    highScore.onclick = function (event) {
        hide();
        openHighScore();

        event.stopPropagation();
    };

    const selectMapContainer = document.getElementById("MainMenu-selectMap")!;

    for (let a = 0; a < maps.length; a++) {
        const capitalizedName = Utilities.capitalize(maps[a].mapName);

        const item = document.createElement("div");
        item.className = "button";
        item.innerText = capitalizedName;
        item.setAttribute("data-position", a.toString());
        item.onclick = function () {
            const position = parseInt(item.getAttribute("data-position")!, 10);
            selectMap(position);
        };

        selectMapContainer.appendChild(item);
    }

    MAPS_AVAILABLE = maps;
    MAPS_ELEMENTS = Array.from(selectMapContainer.children);

    if (typeof initialSelectedMap !== "number") {
        selectMap(0, false);
    } else {
        selectMap(initialSelectedMap, false);
    }
}

/**
 * Show the main menu.
 */
export function open() {
    stopMusic();
    selectMap(SELECTED_MAP);
    MENU.classList.remove("hidden");
}

/**
 * Hide the main menu.
 */
export function hide() {
    MENU.classList.add("hidden");
}

/**
 * Show the high-scores section/page.
 */
export function openHighScore() {
    const table = document.getElementById("HighScore-table")!;
    const scores = HighScore.getAll();
    const keys = Object.keys(scores);

    if (keys.length === 0) {
        table.innerHTML = "No Score Yet.";
    }

    // fill the table with the scores
    else {
        // header
        let tableRow = document.createElement("tr");
        const headers = [""].concat(keys);
        const maxScores = HighScore.getMaxScoresSaved();

        for (let a = 0; a < headers.length; a++) {
            const tableHeader = document.createElement("th");

            tableHeader.innerText = headers[a];
            tableRow.appendChild(tableHeader);
        }

        table.appendChild(tableRow);

        for (let a = 0; a < maxScores; a++) {
            tableRow = document.createElement("tr");
            const positionElement = document.createElement("td");

            positionElement.innerHTML = (a + 1).toString();
            tableRow.appendChild(positionElement);

            for (let b = 0; b < keys.length; b++) {
                const mapScoreList = scores[keys[b]];
                const score = mapScoreList[a];
                const scoreElement = document.createElement("td");

                if (!score) {
                    scoreElement.innerHTML = "-";
                } else {
                    scoreElement.innerHTML = score.toString();
                }

                tableRow.appendChild(scoreElement);
            }

            table.appendChild(tableRow);
        }
    }

    const back = document.getElementById("HighScore-back")!;

    back.onclick = function () {
        // clear the table (since we're always using the same <table> element)
        table.innerHTML = "";
        HIGH_SCORE.classList.add("hidden");

        open();
    };

    HIGH_SCORE.classList.remove("hidden");
}

/**
 * Select a different map.
 */
export function selectMap(position: number, save = true) {
    if (position === SELECTED_MAP) {
        return;
    }

    const previous = MAPS_ELEMENTS[SELECTED_MAP];
    const next = MAPS_ELEMENTS[position];

    if (previous) {
        previous.classList.remove("mapSelected");
    }

    next.classList.add("mapSelected");
    SELECTED_MAP = position;

    if (save) {
        setData({ mahjong_selected_map: position });
    }
}
