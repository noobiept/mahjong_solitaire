import * as MapEditorMap from "./map_editor_map.js";
import { Dimensions } from "../../scripts/main.js";

var CANVAS: HTMLCanvasElement;
var STAGE: createjs.Stage;
var PRELOAD: createjs.LoadQueue;

window.onload = function () {
    CANVAS = document.getElementById("Canvas") as HTMLCanvasElement;
    CANVAS.width = 1500;
    CANVAS.height = 850;

    STAGE = new createjs.Stage(CANVAS);

    createjs.Ticker.addEventListener("tick", function () {
        STAGE.update();
    });

    document.getElementById("SaveMap")!.onclick = MapEditorMap.save;
    document.getElementById("LoadMap")!.onclick = function () {
        const label = document.getElementById("MapName") as HTMLInputElement;
        var mapName = label.value;

        MapEditorMap.load(mapName);
    };

    document.getElementById("Grids-seeAll")!.onclick = function () {
        MapEditorMap.selectGrid(-1);
    };

    document.getElementById("NewMap")!.onclick = function () {
        const gridsInput = document.getElementById("Grids") as HTMLInputElement;
        const columnsInput = document.getElementById(
            "Columns"
        ) as HTMLInputElement;
        const linesInput = document.getElementById("Lines") as HTMLInputElement;

        var numberOfGrids = gridsInput.value;
        var numberOfColumns = columnsInput.value;
        var numberOfLines = linesInput.value;

        MapEditorMap.clear();
        MapEditorMap.constructGrid({
            numberOfColumns: parseInt(numberOfColumns),
            numberOfLines: parseInt(numberOfLines),
            numberOfGrids: parseInt(numberOfGrids),
            mapName: "",
        });
    };

    document.onkeyup = keyboardShortcuts;

    var manifest = [{ id: "bamboo1", src: "/static/images/bamboo1.png" }];

    PRELOAD = new createjs.LoadQueue();
    PRELOAD.loadManifest(manifest, true);
    PRELOAD.addEventListener("complete", function () {
        MapEditorMap.load();
    });
};

/**
 * - 1, 2, ..., 9: Select a specific grid.
 * - a: See all the grids.
 */
function keyboardShortcuts(event: KeyboardEvent) {
    var key = event.key;
    var selectGrid = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    for (var a = 0; a < selectGrid.length; a++) {
        const gridId = selectGrid[a];

        if (event.key === gridId) {
            MapEditorMap.selectGrid(parseInt(selectGrid[a]) - 1);
            return;
        }
    }

    if (key.toLowerCase() === "a") {
        MapEditorMap.selectGrid(-1);
    }
}

/**
 * Update the number of grids/columns/lines value in the menu's input elements.
 */
export function updateMenuValues(mapName: string) {
    var numberOfGrids = MapEditorMap.getAllGrids().length;

    // all grids have the same number of columns/lines, so we only need to check the numbers of one
    var grid = MapEditorMap.getGrid(0);

    var numberOfColumns = grid.numberOfColumns;
    var numberOfLines = grid.numberOfLines;

    const gridsInput = document.getElementById("Grids") as HTMLInputElement;
    const columnsInput = document.getElementById("Columns") as HTMLInputElement;
    const linesInput = document.getElementById("Lines") as HTMLInputElement;
    const mapNameInput = document.getElementById("MapName") as HTMLInputElement;

    gridsInput.value = numberOfGrids.toString();
    columnsInput.value = numberOfColumns.toString();
    linesInput.value = numberOfLines.toString();
    mapNameInput.value = mapName;

    MapEditorMap.updateTilesLeft();
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

/**
 * Change the depth of the element in the stage (z-index).
 */
export function setIndexInStage(
    element: createjs.DisplayObject,
    position: number
) {
    STAGE.setChildIndex(element, position);
}
