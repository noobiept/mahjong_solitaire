import * as GameMenu from "./game_menu.js";
import * as Message from "./message.js";
import * as MainMenu from "./main_menu.js";
import * as HighScore from "./high_score.js";
import Map, { MapInfo } from "./map.js";
import { CANVAS, STAGE } from "./main.js";

// current map information
var CURRENT_MAP: MapInfo;
var TWO_PLAYER_MODE: boolean; // either 1 player or 2 player mode

// has all the map objects (one for each player)
var MAPS: Map[] = [];

// when there's more than 1 player, means each player takes turns to play, this keeps track of what player/map is currently playing
var ACTIVE_MAP = 0;

// whether we shadow the un-selectable tiles or not
var SHADOW_ON = false;

// a message to tell which player turn is
// only for 2 player mode
var PLAYER_TURN: createjs.Text | null = null;

// tell if the game finished or not
var GAME_FINISHED = false;

/**
 * Start a new game.
 */
export function start(selectedMap: MapInfo, twoPlayers: boolean) {
    resetStuff();

    TWO_PLAYER_MODE = twoPlayers;
    GAME_FINISHED = false; // can't have this on Game.resetStuff() (leads to an issue when finishing the game)
    CURRENT_MAP = selectedMap;

    $(CANVAS).css("display", "block");

    if (twoPlayers) {
        MAPS.push(new Map({ mapInfo: selectedMap, playerNumber: 1 }));
        MAPS.push(new Map({ mapInfo: selectedMap, playerNumber: 2 }));

        // init the player turn message
        PLAYER_TURN = new createjs.Text("", "30px monospace", "red");
        PLAYER_TURN.textAlign = "center";

        STAGE.addChild(PLAYER_TURN);
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

export function finished() {
    var a;

    // confirm that all players have finished the game, otherwise return and wait until the last player finish to proceed
    for (a = 0; a < MAPS.length; a++) {
        // see if there's still tiles left
        if (MAPS[a].all_tiles.length > 0) {
            return;
        }
    }

    GAME_FINISHED = true;

    for (a = 0; a < MAPS.length; a++) {
        HighScore.add(CURRENT_MAP.mapName, MAPS[a].score);
    }

    // 1 player mode
    if (MAPS.length === 1) {
        Message.show("Map Cleared! Score: " + MAPS[0].score);
    }

    // more than 1 player, need to determine who won
    else {
        var playerOneScore = MAPS[0].score;
        var playerTwoScore = MAPS[1].score;

        if (playerOneScore > playerTwoScore) {
            Message.show("Player 1 Wins! Score: " + playerOneScore);
        } else if (playerTwoScore > playerOneScore) {
            Message.show("Player 2 Wins! Score: " + playerTwoScore);
        } else {
            Message.show("Its a Draw! Score: " + playerOneScore);
        }
    }

    resetStuff();

    window.setTimeout(function() {
        Message.hide();
        MainMenu.open();
    }, 2500);
}

export function setActiveMap(position: number) {
    var previousMap = MAPS[ACTIVE_MAP];

    previousMap.mapInformation.stopTimer();
    previousMap.isCurrentActive = false;

    ACTIVE_MAP = position;

    MAPS[position].mapInformation.startTimer();
    MAPS[position].isCurrentActive = true;

    // for 2 players mode only
    if (MAPS.length > 1 && PLAYER_TURN) {
        var playerName = MAPS[position].playerNumber;

        if (playerName === 1) {
            // position centered in the left side of the map
            PLAYER_TURN.x = CANVAS.width / 4;
            PLAYER_TURN.text = "Player 1 Turn";
        } else {
            // centered in the right side of the map
            PLAYER_TURN.x = (CANVAS.width * 3) / 4;
            PLAYER_TURN.text = "Player 2 Turn";
        }
    }
}

export function changePlayer() {
    // only 1 player
    if (MAPS.length <= 1) {
        return;
    }

    var nextPlayer = ACTIVE_MAP + 1;

    if (nextPlayer >= MAPS.length) {
        nextPlayer = 0;
    }

    setActiveMap(nextPlayer);
}

export function shadowTiles() {
    for (var a = 0; a < MAPS.length; a++) {
        MAPS[a].shadowTiles();

        var selectedTile = MAPS[a].selected_tile;

        // calling .shadowTiles() above will change the background of the selected tile (if there's one), so we need to select again
        if (selectedTile) {
            selectedTile.selectTile();
        }
    }
}

export function unShadowTiles() {
    for (var a = 0; a < MAPS.length; a++) {
        MAPS[a].unShadowTiles();

        var selectedTile = MAPS[a].selected_tile;

        // calling .unShadowTiles() above will change the background of the selected tile (if there's one), so we need to select again
        if (selectedTile) {
            selectedTile.selectTile();
        }
    }
}

export function updateInformation() {
    if (SHADOW_ON) {
        for (var a = 0; a < MAPS.length; a++) {
            MAPS[a].shadowTiles();
        }
    }
}

export function highlightRandomPair() {
    getActiveMap().highlightRandomPair();
}

export function resetStuff() {
    for (var a = 0; a < MAPS.length; a++) {
        MAPS[a].clear();
    }

    MAPS.length = 0;
    ACTIVE_MAP = 0;

    GameMenu.clear();
    $(CANVAS).css("display", "none");

    if (PLAYER_TURN) {
        STAGE.removeChild(PLAYER_TURN);
        PLAYER_TURN = null;
    }
}

export function pause() {
    createjs.Ticker.setPaused(true);
}

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

export function resize() {
    var width = $(window).outerWidth(true)!;
    var height =
        $(window).outerHeight(true)! - $("#GameMenu").outerHeight(true)!;

    CANVAS.width = width;
    CANVAS.height = height;

    if (MAPS.length === 1) {
        MAPS[0].scaleMap({
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
    } else if (MAPS.length === 2) {
        var halfWidth = width / 2;

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
