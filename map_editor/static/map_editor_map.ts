import GridPosition from "./map_editor_grid_position.js";
import { updateMenuValues, canvasDimensions } from "./map_editor.js";
import { MapInfo, MapPosition } from "../../scripts/map.js";
import { Omit } from "../../scripts/utilities.js";
import { GridArgs } from "../../scripts/grid.js";
import MapEditorGrid from "./map_editor_grid.js";
import MapEditorTile, { TileArgs } from "./map_editor_tile.js";

export interface ConstructArgs {
    numberOfColumns: number;
    numberOfLines: number;
    numberOfGrids: number;
    mapName: string;
}

var ALL_GRIDS: MapEditorGrid[] = [];
var ALL_TILES: MapEditorTile[] = [];

// current selected grid (0+), or -1 is none is selected (when its showing the whole map)
var SELECTED_GRID = -1;
var TILES_LEFT = 144;

/**
 * Create the grid with the grid positions.
 */
export function constructGrid(mapInfo: ConstructArgs | MapInfo) {
    var numberOfGrids;

    if ("numberOfGrids" in mapInfo) {
        numberOfGrids = mapInfo.numberOfGrids;
    } else {
        numberOfGrids = mapInfo.mapDescription.length;
    }

    var columns = mapInfo.numberOfColumns;
    var lines = mapInfo.numberOfLines;
    var grid;
    var tileWidth = MapEditorTile.getImageWidth();
    var tileHeight = MapEditorTile.getImageHeight();
    var startingX = 100;
    var startingY = 0;

    canvasDimensions({
        width: columns * tileWidth + startingX,
        height: lines * tileHeight + startingY,
    });

    var gridsContainer = document.getElementById("Grids-container")!;

    for (let a = 0; a < numberOfGrids; a++) {
        addGrid({
            numberOfColumns: columns + 1,
            numberOfLines: lines,
        });

        var gridElement = document.createElement("div");

        gridElement.innerText = (a + 1).toString();
        gridElement.onclick = function() {
            const text = gridElement.innerText;
            var newGrid = parseInt(text, 10) - 1;

            selectGrid(newGrid);
        };

        gridsContainer.appendChild(gridElement);
    }

    // no grid selected initially
    SELECTED_GRID = -1;

    for (let a = 0; a < numberOfGrids; a++) {
        grid = getGrid(a);

        for (var b = 0; b < columns; b++) {
            for (var c = 0; c < lines; c++) {
                var gridPosition = new GridPosition({
                    column: b,
                    line: c,
                    grid: grid,
                    hidden: true,
                });

                gridPosition.moveTo(
                    startingX + tileWidth * b,
                    startingY + tileHeight * c
                );
            }
        }

        startingX -= 6;
        startingY += 6;
    }

    selectGrid(SELECTED_GRID);
    updateMenuValues(mapInfo.mapName);
}

/**
 * Show the tiles in the map editor based on the map info.
 */
export function constructMap(mapInfo: MapInfo) {
    var mapDescription = mapInfo.mapDescription;

    for (var a = 0; a < mapDescription.length; a++) {
        var gridDescription = mapDescription[a];
        var gridPositions = GridPosition.getGrid(a);

        // so that we don't change the array in GridPosition, we get a new one (clone)
        var gridPositionsCopy = gridPositions.slice(0);

        for (var b = 0; b < gridDescription.length; b++) {
            var tile = gridDescription[b];

            // find the GridPosition that corresponds to the column/line tile
            for (var c = 0; c < gridPositionsCopy.length; c++) {
                var gridPosition = gridPositionsCopy[c];

                if (
                    gridPosition.column === tile.column &&
                    gridPosition.line === tile.line
                ) {
                    gridPosition.onClick(false);

                    // remove this GridPosition, since its already got an hit (so that the next search is faster)
                    gridPositionsCopy.splice(c, 1);
                    break;
                }
            }
        }
    }
}

/**
 * Select a grid. Show only the tiles and grid position elements from that grid.
 */
export function selectGrid(gridPosition: number) {
    // -1 is to show all grids, 0+ is to select a specific grid
    if (gridPosition < -1 || gridPosition >= ALL_GRIDS.length) {
        return;
    }

    // already selected
    if (gridPosition === SELECTED_GRID) {
        return;
    }

    var previousGridPositions;
    var allTiles = getAllTiles();
    var allGridPositions = GridPosition.getAll();
    const current = document.getElementById("Grids-currentGrid")!;

    // show all the tiles (but not the GridPosition)
    if (gridPosition < 0) {
        previousGridPositions = GridPosition.getGrid(SELECTED_GRID);

        // hide previous grid
        for (let a = 0; a < previousGridPositions.length; a++) {
            previousGridPositions[a].hide();
        }

        // show all the tiles
        // add the tiles starting on the bottom grid, and going up (so that the z-index is correct (the tiles on top grids, are above the tiles on grids below))
        for (let a = 0; a < allGridPositions.length; a++) {
            var individualGrid = allGridPositions[a];

            for (var b = 0; b < individualGrid.length; b++) {
                const position = individualGrid[b];
                position.addTileToStage();
            }
        }

        current.innerText = "All Grids.";
    }

    // show only the selected GridPosition/Tile elements
    else {
        // when previously wasn't any grid selected
        if (SELECTED_GRID < 0) {
            // hide all tiles
            for (let a = 0; a < allTiles.length; a++) {
                const tile = allTiles[a];
                tile.removeFromStage();
            }
        }

        // a grid was selected, and now we're choosing a different one
        else {
            previousGridPositions = GridPosition.getGrid(SELECTED_GRID);

            // hide previous grid
            for (var a = 0; a < previousGridPositions.length; a++) {
                previousGridPositions[a].hide();
            }
        }

        // show next one
        var gridPositions = GridPosition.getGrid(gridPosition);

        for (let a = 0; a < gridPositions.length; a++) {
            gridPositions[a].show();
        }

        current.innerText = "Selected Grid: " + (gridPosition + 1);
    }

    SELECTED_GRID = gridPosition;
}

/**
 * Save the current map state.
 */
export async function save() {
    const mapNameInput = document.getElementById("MapName") as HTMLInputElement;
    var mapName = mapNameInput.value;

    var grid = getGrid(0);
    var allGrids = getAllGrids();
    var allTiles = getAllTiles();

    var numberOfColumns = grid.numberOfColumns;
    var numberOfLines = grid.numberOfLines;
    var a;
    var mapDescription: MapPosition[][] = [];

    // init mapDescription
    for (a = 0; a < allGrids.length; a++) {
        mapDescription[a] = [];
    }

    for (a = 0; a < allTiles.length; a++) {
        var tile = allTiles[a];

        var gridPosition = tile.gridObject.position;

        mapDescription[gridPosition].push({
            column: tile.column,
            line: tile.line,
        });
    }

    var mapDefinition = {
        mapName: mapName,
        numberOfColumns: numberOfColumns,
        numberOfLines: numberOfLines,
        mapDescription: mapDescription,
    };

    const response = await fetch("/save_map", {
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: mapDefinition }),
    });

    if (response.status === 200) {
        console.log(`Saved: ${mapName}`);
    }
}

/**
 * Load a specific map from the server.
 */
export async function load(mapName?: string) {
    clear();

    // try to load the latest map (that was loaded in the previous session)
    if (typeof mapName === "undefined") {
        var previousMap = localStorage.getItem("previousMap");

        if (previousMap !== null) {
            mapName = previousMap;
        } else {
            console.log("Invalid map name.");
            return;
        }
    }

    try {
        const response = await fetch("/load_map", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ mapName: mapName }),
        });
        const mapInfo = await response.json();

        constructGrid(mapInfo);
        constructMap(mapInfo);

        localStorage.setItem("previousMap", mapName);
        console.log(`Loaded: ${mapName}`);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Add a tile to the map.
 */
export function addTile(args: TileArgs) {
    var tile = new MapEditorTile(args);

    ALL_TILES.push(tile);
    TILES_LEFT--;

    return tile;
}

/**
 * Remove a tile from the map.
 */
export function removeTile(tileObject: MapEditorTile) {
    var position = ALL_TILES.indexOf(tileObject);

    ALL_TILES.splice(position, 1);
    tileObject.remove();
    TILES_LEFT++;
}

/**
 * Add a new grid to the map.
 */
export function addGrid(args: Omit<GridArgs, "position">) {
    var grid = new MapEditorGrid({
        numberOfColumns: args.numberOfColumns,
        numberOfLines: args.numberOfLines,
        position: ALL_GRIDS.length,
    });

    ALL_GRIDS.push(grid);

    return grid;
}

/**
 * Remove a grid from the map.
 */
export function removeGrid(gridObject: MapEditorGrid) {
    var position = ALL_GRIDS.indexOf(gridObject);

    ALL_GRIDS.splice(position, 1);
}

/**
 * Get a specific grid object.
 */
export function getGrid(position: number) {
    return ALL_GRIDS[position];
}

/**
 * Get all the grids.
 */
export function getAllGrids() {
    return ALL_GRIDS;
}

/**
 * Get all the tiles.
 */
export function getAllTiles() {
    return ALL_TILES;
}

/**
 * Remove all the grids.
 */
export function removeAllGrids() {
    ALL_GRIDS.length = 0;
}

/**
 * Remove all the tiles.
 */
export function removeAllTiles() {
    for (var a = 0; a < ALL_TILES.length; a++) {
        ALL_TILES[a].remove();
    }

    ALL_TILES.length = 0;
}

/**
 * Clear the map state.
 */
export function clear() {
    GridPosition.removeAll();
    removeAllGrids();

    TILES_LEFT = 144;

    document.getElementById("Grids-container")!.innerHTML = "";
}

/**
 * Update the UI with the current number of tiles left (to have a complete map).
 */
export function updateTilesLeft() {
    const tilesLeft = document.getElementById("TilesLeft")!;
    tilesLeft.innerText = "Tiles Left: " + TILES_LEFT;
}
