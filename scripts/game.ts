import * as GameMenu from "./game_menu.js";
import * as Message from "./message.js";
import * as MainMenu from "./main_menu.js";
import * as HighScore from "./high_score.js";
import Map, { MapInfo } from "./map.js";
import {
    showHideCanvas,
    canvasDimensions,
    addToStage,
    removeFromStage,
} from "./main.js";
import { outerHeight } from "./utilities.js";
import { playMusic } from "./sound.js";

// current map information
let CURRENT_MAP: MapInfo;
let TWO_PLAYER_MODE: boolean; // either 1 player or 2 player mode

// has all the map objects (one for each player)
const MAPS: Map[] = [];

// when there's more than 1 player, means each player takes turns to play, this keeps track of what player/map is currently playing
let ACTIVE_MAP = 0;

// whether we shadow the un-selectable tiles or not
let SHADOW_ON = false;

// a message to tell which player turn is
// only for 2 player mode
let PLAYER_TURN: createjs.Text | null = null;

// tell if the game finished or not
let GAME_FINISHED = false;

/**
 * Start a new game.
 */
export function start(selectedMap: MapInfo, twoPlayers: boolean) {
    resetStuff();
    showHideCanvas(true);
    playMusic();

    TWO_PLAYER_MODE = twoPlayers;
    GAME_FINISHED = false; // can't have this on Game.resetStuff() (leads to an issue when finishing the game)
    CURRENT_MAP = selectedMap;

    if (twoPlayers) {
        MAPS.push(new Map({ mapInfo: selectedMap, playerNumber: 1 }));
        MAPS.push(new Map({ mapInfo: selectedMap, playerNumber: 2 }));

        // init the player turn message
        PLAYER_TURN = new createjs.Text("", "30px monospace", "red");
        PLAYER_TURN.textAlign = "center";

        addToStage(PLAYER_TURN);
    } else {
        MAPS.push(new Map({ mapInfo: selectedMap, playerNumber: 1 }));
    }

    GameMenu.show();
    resize();
    updateInformation();
    setActiveMap(0);
}

/**
 * Restart the game in the same map and same player mode as before.
 * Assumes `Game.start()` was already called at one point.
 */
export function restart() {
    start(CURRENT_MAP, TWO_PLAYER_MODE);
}

/**
 * Game is finished, add the scores, show an ending message and go back to the main menu.
 */
export function finished() {
    // confirm that all players have finished the game, otherwise return and wait until the last player finish to proceed
    for (let a = 0; a < MAPS.length; a++) {
        // see if there's still tiles left
        if (MAPS[a].howManyTilesLeft() > 0) {
            return;
        }
    }

    GAME_FINISHED = true;

    for (let a = 0; a < MAPS.length; a++) {
        HighScore.add(CURRENT_MAP.mapName, MAPS[a].getCurrentScore());
    }

    let message = "";

    // 1 player mode
    if (MAPS.length === 1) {
        message = "Map Cleared! Score: " + MAPS[0].getCurrentScore();
    }

    // more than 1 player, need to determine who won
    else {
        const playerOneScore = MAPS[0].getCurrentScore();
        const playerTwoScore = MAPS[1].getCurrentScore();

        if (playerOneScore > playerTwoScore) {
            message = "Player 1 Wins! Score: " + playerOneScore;
        } else if (playerTwoScore > playerOneScore) {
            message = "Player 2 Wins! Score: " + playerTwoScore;
        } else {
            message = "Its a Draw! Score: " + playerOneScore;
        }
    }

    quit(message);
}

/**
 * Activate a specific map. Useful to switch between maps in 2 player mode.
 */
export function setActiveMap(position: number) {
    const previousMap = MAPS[ACTIVE_MAP];

    previousMap.activate(false);
    MAPS[position].activate(true);

    ACTIVE_MAP = position;

    // for 2 players mode only
    if (MAPS.length > 1 && PLAYER_TURN) {
        const playerName = MAPS[position].playerNumber;
        const canvas = canvasDimensions();

        if (playerName === 1) {
            // position centered in the left side of the map
            PLAYER_TURN.x = canvas.width / 4;
            PLAYER_TURN.text = "Player 1 Turn";
        } else {
            // centered in the right side of the map
            PLAYER_TURN.x = (canvas.width * 3) / 4;
            PLAYER_TURN.text = "Player 2 Turn";
        }
    }
}

/**
 * Next player's turn.
 */
export function changePlayer() {
    // only 1 player
    if (MAPS.length <= 1) {
        return;
    }

    let nextPlayer = ACTIVE_MAP + 1;

    if (nextPlayer >= MAPS.length) {
        nextPlayer = 0;
    }

    setActiveMap(nextPlayer);
}

/**
 * Shadow the tiles that aren't playable (because they're underneath other tiles).
 */
export function shadowTiles() {
    for (let a = 0; a < MAPS.length; a++) {
        const map = MAPS[a];
        map.shadowTiles();

        // calling .shadowTiles() above will change the background of the selected tile (if there's one), so we need to select again
        map.reSelectCurrentSelected();
    }
}

/**
 * Remove the shadow on unplayable tiles.
 */
export function unShadowTiles() {
    for (let a = 0; a < MAPS.length; a++) {
        const map = MAPS[a];
        map.unShadowTiles();

        // calling .unShadowTiles() above will change the background of the selected tile (if there's one), so we need to select again
        map.reSelectCurrentSelected();
    }
}

/**
 * Update some state on the game (for now just re-set the shadow on every map).
 */
export function updateInformation() {
    if (SHADOW_ON) {
        for (let a = 0; a < MAPS.length; a++) {
            MAPS[a].shadowTiles();
        }
    }
}

/**
 * Highlight a random pair of tiles as a help to the player.
 */
export function highlightRandomPair() {
    getActiveMap().highlightRandomPair();
}

/**
 * Reset the game state.
 */
function resetStuff() {
    for (let a = 0; a < MAPS.length; a++) {
        MAPS[a].clear();
    }

    MAPS.length = 0;
    ACTIVE_MAP = 0;

    GameMenu.clear();
    showHideCanvas(false);

    if (PLAYER_TURN) {
        removeFromStage(PLAYER_TURN);
        PLAYER_TURN = null;
    }
}

/**
 * Pause the game.
 */
export function pause() {
    createjs.Ticker.setPaused(true);
}

/**
 * Resume the game.
 */
export function resume() {
    createjs.Ticker.setPaused(false);
}

export function getShadowOption() {
    return SHADOW_ON;
}

export function setShadowOption(value: boolean) {
    SHADOW_ON = value;
}

export function getActiveMap() {
    return MAPS[ACTIVE_MAP];
}

export function hasEnded() {
    return GAME_FINISHED;
}

/**
 * Resize the game canvas and all of its elements.
 */
export function resize() {
    const gameMenu = document.getElementById("GameMenu")!;
    const width = window.innerWidth;
    const height = window.innerHeight - outerHeight(gameMenu);

    canvasDimensions({
        width: width,
        height: height,
    });

    if (MAPS.length === 1) {
        MAPS[0].scaleMap({
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
    } else if (MAPS.length === 2) {
        const halfWidth = width / 2;

        MAPS[0].scaleMap({
            x: 0,
            y: 0,
            width: halfWidth,
            height: height,
        });
        MAPS[1].scaleMap({
            x: halfWidth,
            y: 0,
            width: halfWidth,
            height: height,
        });

        if (PLAYER_TURN) {
            // position just above the menu, in the left or right side of the window (depending on which turn it is)
            PLAYER_TURN.y = height - 32; // the 32 (30px + a bit of margin) depends on the font-size specified above when creating the Text()

            if (ACTIVE_MAP === 0) {
                PLAYER_TURN.x = width / 4;
            } else {
                PLAYER_TURN.x = (width * 3) / 4;
            }
        }
    }
}

/**
 * Show an ending `message`, then quit the game and go back to the main menu.
 * If no `message` is given then it just opens the main menu immediately.
 */
export function quit(message?: string) {
    resetStuff();

    if (message) {
        Message.show(message);

        window.setTimeout(function () {
            Message.hide();
            MainMenu.open();
        }, 2500);
    } else {
        MainMenu.open();
    }
}
