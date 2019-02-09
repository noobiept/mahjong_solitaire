import * as AppStorage from "./app_storage.js";
import * as GameMenu from "./game_menu.js";
import * as Message from "./message.js";
import * as HighScore from "./high_score.js";
import * as MainMenu from "./main_menu.js";
import * as Sound from "./sound.js";
import * as Game from "./game.js";
import { MapInfo } from "./map.js";

export interface Dimensions {
    width: number;
    height: number;
}

var CANVAS: HTMLCanvasElement;

// createjs
var STAGE: createjs.Stage;
var PRELOAD: createjs.LoadQueue;

window.onload = function() {
    AppStorage.getData(
        ["mahjong_high_score", "mahjong_sound_muted", "mahjong_selected_map"],
        initApp
    );
};

function initApp(data: AppStorage.Data) {
    CANVAS = document.getElementById("MainCanvas") as HTMLCanvasElement;
    STAGE = new createjs.Stage(CANVAS);

    GameMenu.init();
    Message.init();
    Sound.init(data["mahjong_sound_muted"]);
    HighScore.load(data["mahjong_high_score"]);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", tick as (event: Object) => void);

    PRELOAD = new createjs.LoadQueue();
    PRELOAD.setMaxConnections(10);
    PRELOAD.maintainScriptOrder = false;
    PRELOAD.installPlugin(createjs.Sound);

    var manifest = [
        { id: "bamboo1", src: "images/bamboo1.png" },
        { id: "bamboo2", src: "images/bamboo2.png" },
        { id: "bamboo3", src: "images/bamboo3.png" },
        { id: "bamboo4", src: "images/bamboo4.png" },
        { id: "bamboo5", src: "images/bamboo5.png" },
        { id: "bamboo6", src: "images/bamboo6.png" },
        { id: "bamboo7", src: "images/bamboo7.png" },
        { id: "bamboo8", src: "images/bamboo8.png" },
        { id: "bamboo9", src: "images/bamboo9.png" },
        { id: "circle1", src: "images/circle1.png" },
        { id: "circle2", src: "images/circle2.png" },
        { id: "circle3", src: "images/circle3.png" },
        { id: "circle4", src: "images/circle4.png" },
        { id: "circle5", src: "images/circle5.png" },
        { id: "circle6", src: "images/circle6.png" },
        { id: "circle7", src: "images/circle7.png" },
        { id: "circle8", src: "images/circle8.png" },
        { id: "circle9", src: "images/circle9.png" },
        { id: "character1", src: "images/character1.png" },
        { id: "character2", src: "images/character2.png" },
        { id: "character3", src: "images/character3.png" },
        { id: "character4", src: "images/character4.png" },
        { id: "character5", src: "images/character5.png" },
        { id: "character6", src: "images/character6.png" },
        { id: "character7", src: "images/character7.png" },
        { id: "character8", src: "images/character8.png" },
        { id: "character9", src: "images/character9.png" },
        { id: "wind1", src: "images/wind1.png" },
        { id: "wind2", src: "images/wind2.png" },
        { id: "wind3", src: "images/wind3.png" },
        { id: "wind4", src: "images/wind4.png" },
        { id: "dragon1", src: "images/dragon1.png" },
        { id: "dragon2", src: "images/dragon2.png" },
        { id: "dragon3", src: "images/dragon3.png" },
        { id: "flower1", src: "images/flower1.png" },
        { id: "flower2", src: "images/flower2.png" },
        { id: "flower3", src: "images/flower3.png" },
        { id: "flower4", src: "images/flower4.png" },
        { id: "season1", src: "images/season1.png" },
        { id: "season2", src: "images/season2.png" },
        { id: "season3", src: "images/season3.png" },
        { id: "season4", src: "images/season4.png" },

        // maps
        { id: "map_pyramid", src: "maps/pyramid.json" },
        { id: "map_tower", src: "maps/tower.json" },
        { id: "map_fish", src: "maps/fish.json" },
        { id: "map_crossroads", src: "maps/crossroads.json" },
        { id: "map_cross", src: "maps/cross.json" },

        // audio
        { id: "music", src: "audio/Jaoan.ogg" },
    ];

    PRELOAD.addEventListener("progress", progress as (event: Object) => void);
    PRELOAD.addEventListener("complete", function() {
        Message.hide();

        // the order of the array needs to match the order of the html elements in the main menu
        MainMenu.init(
            [
                PRELOAD.getResult("map_pyramid") as MapInfo,
                PRELOAD.getResult("map_tower") as MapInfo,
                PRELOAD.getResult("map_fish") as MapInfo,
                PRELOAD.getResult("map_crossroads") as MapInfo,
                PRELOAD.getResult("map_cross") as MapInfo,
            ],
            data["mahjong_selected_map"]
        );
        MainMenu.open();
    });
    PRELOAD.loadManifest(manifest, true);
}

window.onresize = function() {
    Game.resize();
};

/**
 * Draw the elements at every tick.
 */
function tick(event: createjs.TickerEvent) {
    if (event.paused) {
        return;
    }

    STAGE.update();
}

/**
 * Called during the loading of the assets. We show the current progress to the player.
 */
function progress(event: createjs.ProgressEvent) {
    Message.show("Loading " + ((event.progress * 100) | 0) + "%");
}

/**
 * Show or hide the canvas element (where the game is displayed).
 */
export function showHideCanvas(show: boolean) {
    if (show) {
        CANVAS.classList.remove("hidden");
    } else {
        CANVAS.classList.add("hidden");
    }
}

/**
 * Get or set the canvas dimensions (width/height).
 */
export function canvasDimensions(dimensions?: Dimensions) {
    if (typeof dimensions !== "undefined") {
        CANVAS.width = dimensions.width;
        CANVAS.height = dimensions.height;
    }

    return {
        width: CANVAS.width,
        height: CANVAS.height,
    };
}

/**
 * Get an asset that was pre-loaded at the start of the application.
 */
export function getAsset(name: string) {
    return PRELOAD.getResult(name);
}

/**
 * Add a game element to the stage (to be drawn).
 */
export function addToStage(element: createjs.DisplayObject) {
    STAGE.addChild(element);
}

/**
 * Remove a game element from the stage.
 */
export function removeFromStage(element: createjs.DisplayObject) {
    STAGE.removeChild(element);
}
