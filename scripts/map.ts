import * as Game from "./game.js";
import * as Message from "./message.js";
import * as Utilities from "./utilities.js";
import Tile, { TileName, TileArgs, TileId } from "./tile.js";
import Grid, { GridArgs } from "./grid.js";
import MapInformation from "./map_information.js";

export interface MapPosition {
    line: number;
    column: number;
}

export interface MapTilePosition extends MapPosition {
    tileId: TileId;
    tileName: TileName;
}

export interface MapInfo {
    mapName: string;
    numberOfColumns: number;
    numberOfLines: number;
    mapDescription: MapPosition[][]; // first dimension is the grid, and then its a list of positions where the tiles are positioned (check the maps in the `/maps/*.json` for examples)
}

export interface MapDimension {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface MapArgs {
    mapInfo: MapInfo;
    playerNumber: number;
}

/**
 * Generates a map. Each map has 144 tiles.
 *
 *      - 4x bamboo suit (1 to 9)
 *      - 4x character suit (1 to 9)
 *      - 4x circle suit (1 to 9)
 *      - 4x wind tiles (4)
 *      - 4x dragon tiles (3)
 *      - flower tiles (4)
 *      - season tiles (4)
 */
export default class Map {
    static SHUFFLE_SCORE = -100;
    static HELP_SCORE = -100;
    static COMBINE_SCORE = 50;
    static SHADOW_SCORE = -4;
    static TIMER_SCORE = -1;

    private columns: number;
    private lines: number;
    private all_tiles: Tile[];
    private all_grids: Grid[];
    private selected_tile: Tile | null;
    private mapInformation: MapInformation;
    private score: number;
    private isCurrentActive: boolean;
    private hasShadows: boolean;

    readonly playerNumber: number;

    constructor(args: MapArgs) {
        const playerNumber = args.playerNumber;
        const mapInfo = args.mapInfo;

        this.columns = mapInfo.numberOfColumns;
        this.lines = mapInfo.numberOfLines;

        // contain all grids/tiles of this map
        this.all_tiles = [];
        this.all_grids = [];

        // to clear tiles you need to select 2 tiles of same type, this variable points to the first one being selected
        this.selected_tile = null;

        this.mapInformation = new MapInformation({
            playerNumber: playerNumber,
            addTimerScore: () => {
                this.addTimerScore();
            },
        });

        const newMap = this.determineTileNames(mapInfo.mapDescription);

        this.playerNumber = playerNumber;
        this.score = 0;

        // when there's more than 1 player, only one map is active at a time (can be played)
        this.isCurrentActive = false;
        this.hasShadows = false;
        this.buildMap(newMap);
    }

    /**
     * Build the map based on the map description. The first dimension is the grids, and the next one is the description of each tile.
     */
    buildMap(mapDescription: MapTilePosition[][]) {
        // add the tiles, each grid at a time
        for (let a = 0; a < mapDescription.length; a++) {
            const gridDescription = mapDescription[a];

            const grid = this.addGrid({
                numberOfColumns: this.columns,
                numberOfLines: this.lines,
            });

            for (let b = 0; b < gridDescription.length; b++) {
                const position = gridDescription[b];

                this.addTile({
                    tileId: position.tileId,
                    tileName: position.tileName,
                    column: position.column,
                    line: position.line,
                    gridObject: grid,
                    onClick: (tile) => {
                        this.onTileClick(tile);
                    },
                });
            }
        }

        // we need to order the tiles z-index (which element is drawn on top of which)
        // so that the tiles don't look out of place
        for (let a = 0; a < this.all_grids.length; a++) {
            const grid = this.all_grids[a];

            const numberOfLines = this.lines;
            const numberOfColumns = this.columns;

            // get last column/line, go diagonal up right
            for (let b = numberOfLines - 1; b >= 0; b--) {
                let line = b;
                let column = 0;

                while (line < numberOfLines && column < numberOfColumns) {
                    const element = grid.getElement(column, line);

                    if (element) {
                        element.addToStage();
                    }

                    line++;
                    column++;
                }
            }

            // get 2nd last line, and do all diagonals, in first column
            for (let b = 1; b < numberOfColumns; b++) {
                let line = 0;
                let column = b;

                while (line < numberOfLines && column < numberOfColumns) {
                    const element = grid.getElement(column, line);

                    if (element) {
                        element.addToStage();
                    }

                    line++;
                    column++;
                }
            }
        }

        this.updateMapInformation();
    }

    /**
     * Determines the tile name for each position in the map, in a way so that the map is solvable.
     * Start with a complete map, and find the selectable tiles. Determine the tile names, and remove those tiles, find again the selectable tiles, and so on.
     */
    determineTileNames(
        mapDescription: MapPosition[][],
        tilePairs?: TileName[]
    ) {
        const newMap: MapTilePosition[][] = [];

        // construct the map
        for (let a = 0; a < mapDescription.length; a++) {
            const gridDescription = mapDescription[a];

            const grid = this.addGrid({
                numberOfColumns: this.columns,
                numberOfLines: this.lines,
            });

            // initialize the grid's array
            newMap[a] = [];

            for (let b = 0; b < gridDescription.length; b++) {
                const tilePosition = gridDescription[b];

                this.addTile({
                    tileId: "bamboo1", // doesn't matter, since we aren't drawing the shape
                    column: tilePosition.column,
                    line: tilePosition.line,
                    gridObject: grid,
                });
            }
        }

        // determine the selectable tiles
        const allTiles = this.all_tiles;
        const nextTile = this.getNextTile(tilePairs);

        // while we haven't cleared the map
        while (allTiles.length > 0) {
            const selectableTiles = this.getSelectableTiles();

            while (selectableTiles.length > 0) {
                const nextTileName = nextTile();

                const position = Utilities.getRandomInt(
                    0,
                    selectableTiles.length - 1
                );

                const tile = selectableTiles.splice(position, 1)[0];

                newMap[tile.gridObject.position].push({
                    column: tile.column,
                    line: tile.line,
                    tileId: nextTileName.tileId,
                    tileName: nextTileName.tileName,
                });

                this.removeTile(tile);
            }
        }

        // clear the grids
        this.removeAllGrids();

        return newMap;
    }

    /**
     * Re-make the current map.
     */
    shuffle(addToScore = true) {
        const allTiles = this.all_tiles;
        const numberOfGrids = this.all_grids.length;
        const currentMap: MapPosition[][] = [];

        for (let a = 0; a < numberOfGrids; a++) {
            currentMap[a] = [];
        }

        const tileNames: TileName[] = [];

        // get the current positions and tile names
        for (let a = 0; a < allTiles.length; a++) {
            const tile = allTiles[a];

            currentMap[tile.gridObject.position].push({
                column: tile.column,
                line: tile.line,
            });

            tileNames.push(tile.tileName);
        }

        // remove the pairs, since the .getNextTile() already takes care of that (only have one for each pair)
        const tilePairs: TileName[] = [];

        for (let a = 0; a < tileNames.length; a++) {
            const firstTile = tileNames[a];

            for (let b = a + 1; b < tileNames.length; b++) {
                const secondTile = tileNames[b];

                if (firstTile === secondTile) {
                    tilePairs.push(firstTile);

                    tileNames.splice(b, 1);
                    tileNames.splice(a, 1);

                    a--;
                    break;
                }
            }
        }

        // clear the current map
        this.removeAllTiles();
        this.removeAllGrids();

        // re-make the map, with the current tiles
        const newMap = this.determineTileNames(currentMap, tilePairs);

        if (addToScore) {
            this.addToScore(Map.SHUFFLE_SCORE);
        }

        this.buildMap(newMap);
        Game.resize();
    }

    /**
     * Return valid pairs of tiles, making sure that the generated map has the correct number of each type of tile.
     */
    getNextTile(tilesNames?: TileName[]) {
        if (typeof tilesNames === "undefined") {
            // i'll get a pair of each one of the names here
            // so for example, there's 2 'bamboo1', each means we'll get 4 of them in the map (2 pairs)
            tilesNames = [
                "bamboo1",
                "bamboo1",
                "bamboo2",
                "bamboo2",
                "bamboo3",
                "bamboo3",
                "bamboo4",
                "bamboo4",
                "bamboo5",
                "bamboo5",
                "bamboo6",
                "bamboo6",
                "bamboo7",
                "bamboo7",
                "bamboo8",
                "bamboo8",
                "bamboo9",
                "bamboo9",

                "character1",
                "character1",
                "character2",
                "character2",
                "character3",
                "character3",
                "character4",
                "character4",
                "character5",
                "character5",
                "character6",
                "character6",
                "character7",
                "character7",
                "character8",
                "character8",
                "character9",
                "character9",

                "circle1",
                "circle1",
                "circle2",
                "circle2",
                "circle3",
                "circle3",
                "circle4",
                "circle4",
                "circle5",
                "circle5",
                "circle6",
                "circle6",
                "circle7",
                "circle7",
                "circle8",
                "circle8",
                "circle9",
                "circle9",

                "wind1",
                "wind1",
                "wind2",
                "wind2",
                "wind3",
                "wind3",
                "wind4",
                "wind4",

                "dragon1",
                "dragon1",
                "dragon1",
                "dragon1",
                "dragon1",
                "dragon1",

                "flower",
                "flower",
                "season",
                "season",
            ];
        }

        let previousTile: TileName | null = null;
        let flowerNumber = 1;
        let seasonNumber = 1;

        return function () {
            let tileName: TileName;
            let tileId: TileId;

            // we need to return the same tile 2 times (a pair), so check if its time to return the 2nd, otherwise get a new pair from the 'tileNames' array
            if (previousTile) {
                tileName = previousTile;
                previousTile = null;
            } else {
                const position = Utilities.getRandomInt(
                    0,
                    tilesNames!.length - 1
                );

                tileName = tilesNames!.splice(position, 1)[0] as TileName;
                previousTile = tileName;
            }

            // the flower/season works a bit differently than the others, since they can match with each other, but have different images
            if (tileName === "flower") {
                tileId = (tileName + flowerNumber) as TileId;

                flowerNumber++;
            } else if (tileName === "season") {
                tileId = (tileName + seasonNumber) as TileId;

                seasonNumber++;
            } else {
                tileId = tileName as TileId;
            }

            return {
                tileId: tileId,
                tileName: tileName,
            };
        };
    }

    /**
     * Returns an array with the tiles that can be selected in the map.
     */
    getSelectableTiles() {
        const allTiles = this.all_tiles;
        const selectableTiles = [];

        for (let a = 0; a < allTiles.length; a++) {
            const tile = allTiles[a];

            if (this.isTileSelectable(tile)) {
                selectableTiles.push(tile);
            }
        }

        return selectableTiles;
    }

    /**
     * Return the number of selectable pairs left (moves that can be made).
     */
    howManySelectablePairs() {
        const selectableTiles = this.getSelectableTiles();
        let count = 0;

        for (let a = 0; a < selectableTiles.length; a++) {
            const first = selectableTiles[a];

            for (let b = a + 1; b < selectableTiles.length; b++) {
                if (first.tileName === selectableTiles[b].tileName) {
                    count++;

                    selectableTiles.splice(b, 1);
                    selectableTiles.splice(a, 1);

                    a--;
                    break;
                }
            }
        }

        return count;
    }

    /**
     * Return the number of tiles left in the map.
     */
    howManyTilesLeft() {
        return this.all_tiles.length;
    }

    /**
     * Get a valid pair that is selectable.
     */
    getPair() {
        const tiles = this.getSelectableTiles();

        for (let a = 0; a < tiles.length; a++) {
            const first = tiles[a];

            for (let b = a + 1; b < tiles.length; b++) {
                const second = tiles[b];

                if (first.tileName === second.tileName) {
                    return [first, second];
                }
            }
        }

        return null;
    }

    /**
     * Highlight a random valid selectable pair.
     */
    highlightRandomPair() {
        const pair = this.getPair();

        if (pair) {
            pair[0].highlightTile();
            pair[1].highlightTile();

            this.addToScore(Map.HELP_SCORE);
        }
    }

    /**
     * Shadows the un-selectable tiles in the map.
     */
    shadowTiles() {
        this.hasShadows = true;
        const allTiles = this.all_tiles;

        for (let a = 0; a < allTiles.length; a++) {
            const tile = allTiles[a];

            if (!this.isTileSelectable(tile)) {
                tile.shadow();
            } else {
                tile.clearBackground();
            }
        }
    }

    /**
     * Removes the shadow from the un-selectable tiles in the map.
     */
    unShadowTiles() {
        this.hasShadows = false;
        const allTiles = this.all_tiles;

        for (let a = 0; a < allTiles.length; a++) {
            const tile = allTiles[a];

            tile.clearBackground();
        }
    }

    /**
     * Add a tile to the map.
     */
    addTile(args: TileArgs) {
        const tile = new Tile(args);

        args.gridObject.addTile(tile, args.column, args.line);
        this.unSelectTile(tile);

        this.all_tiles.push(tile);

        return tile;
    }

    /**
     * Remove a tile from the map.
     */
    removeTile(tileObject: Tile) {
        const position = this.all_tiles.indexOf(tileObject);

        this.all_tiles.splice(position, 1);
        tileObject.remove();
    }

    /**
     * Add a new grid to the map.
     */
    addGrid(args: Utilities.Omit<GridArgs, "position">) {
        const grid = new Grid({
            numberOfColumns: args.numberOfColumns,
            numberOfLines: args.numberOfLines,
            position: this.all_grids.length,
        });

        this.all_grids.push(grid);

        return grid;
    }

    /**
     * Remove a grid from the map.
     */
    removeGrid(gridObject: Grid) {
        const position = this.all_grids.indexOf(gridObject);

        this.all_grids.splice(position, 1);
    }

    /**
     * Remove all grids.
     */
    removeAllGrids() {
        this.all_grids.length = 0;
    }

    /**
     * Remove all the tiles.
     */
    removeAllTiles() {
        for (let a = 0; a < this.all_tiles.length; a++) {
            this.all_tiles[a].remove();
        }

        this.all_tiles.length = 0;
    }

    /**
     * Clear the map state.
     */
    clear() {
        this.removeAllTiles();
        this.removeAllGrids();
        this.mapInformation.clear();
    }

    /**
     * Select a single tile.
     */
    selectTile(tile: Tile) {
        this.selected_tile = tile;
        tile.selectTile();
    }

    /**
     * Unselect a tile.
     */
    unSelectTile(tile: Tile) {
        this.selected_tile = null;
        tile.clearBackground();
    }

    /**
     * Re-selecting it makes sure it has the proper background.
     */
    reSelectCurrentSelected() {
        if (this.selected_tile) {
            this.selected_tile.selectTile();
        }
    }

    /**
     * A tile has been clicked on, see if we can select it, or combine it with a previously selected tile.
     * Clicking on the selected tile de-selects it.
     */
    onTileClick(tile: Tile) {
        if (!this.isTileSelectable(tile) || !this.isCurrentActive) {
            Message.show("Un-selectable tile.", 1000);
            return;
        }

        const selectedTile = this.selected_tile;

        // no tile is selected, so we select the first one
        if (!selectedTile) {
            this.selectTile(tile);
        }

        // 2 tiles selected, check if its a valid match or not
        else {
            // different tile selected, see if we can combine them
            if (selectedTile !== tile) {
                // valid match
                if (selectedTile.tileName === tile.tileName) {
                    this.removeTile(selectedTile);
                    this.removeTile(tile);

                    this.selected_tile = null;

                    Game.updateInformation();

                    this.addToScore(Map.COMBINE_SCORE);
                    this.mapInformation.resetTimesUpdateWasCalled();
                    this.updateMapInformation();

                    if (!Game.hasEnded()) {
                        Game.changePlayer();
                    }
                } else {
                    this.unSelectTile(selectedTile);
                    this.selectTile(tile);
                }
            }

            // same tile selected, so we un-select it
            else {
                this.unSelectTile(selectedTile);
            }
        }
    }

    /**
     * To be able to select a tile, one of the sides (left or right) has to be free, and the tile can't have other tiles on top of it (in a grid above).
     */
    isTileSelectable(tile: Tile) {
        const column = tile.column;
        const line = tile.line;
        const grid = tile.gridObject;

        let isLeftFree = true;
        let isRightFree = true;

        if (column > 0) {
            if (
                grid.getElement(column - 1, line) ||
                grid.getElement(column - 1, line + 1)
            ) {
                isLeftFree = false;
            }
        }

        if (column + 2 < grid.numberOfColumns) {
            if (
                grid.getElement(column + 2, line) ||
                grid.getElement(column + 2, line + 1)
            ) {
                isRightFree = false;
            }
        }

        if (!isLeftFree && !isRightFree) {
            return false;
        }

        // check grids above, if there's any tile on top of this one
        let gridPosition = grid.position;

        for (;;) {
            gridPosition++;

            const gridAbove = this.all_grids[gridPosition];

            if (!gridAbove) {
                break;
            }

            if (
                gridAbove.getElement(column, line) ||
                gridAbove.getElement(column, line + 1) ||
                gridAbove.getElement(column + 1, line) ||
                gridAbove.getElement(column + 1, line + 1)
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Add to the current score. Update the associated UI elements as well.
     */
    addToScore(score: number) {
        this.score += score;
        this.mapInformation.updateScore(this.score);
    }

    /**
     * Get the current score in this map.
     */
    getCurrentScore() {
        return this.score;
    }

    /**
     * As time passes, we keep worsening the score (the faster you finish the map, the better the score will be).
     */
    addTimerScore() {
        const shadowsNumber = this.hasShadows === true ? 1 : 0; // if the shadow option is being used, we add a penalty to the timer score
        this.addToScore(Map.TIMER_SCORE + shadowsNumber * Map.SHADOW_SCORE);
    }

    /**
     * Scale the map to a new value.
     */
    scaleMap(dimensions: MapDimension) {
        const tileWidth = Tile.WIDTH;
        const tileHeight = Tile.HEIGHT;

        // find the scale value that occupies the whole width/height of the canvas, then choose the lesser value (since width/height can have different values)
        // we're dividing the columns/lines by 2 because the tile occupies a 2x2 square in the grid
        const scaleWidth = dimensions.width / ((this.columns / 2) * tileWidth);
        const scaleHeight = dimensions.height / ((this.lines / 2) * tileHeight);
        let scale = scaleHeight;

        if (scaleWidth < scaleHeight) {
            scale = scaleWidth;
        }

        // center the map horizontally
        const mapWidth = (this.columns / 2) * tileWidth * scale;
        let startingX = dimensions.x + dimensions.width / 2 - mapWidth / 2;
        let startingY = dimensions.y;

        for (let a = 0; a < this.all_grids.length; a++) {
            const grid = this.all_grids[a];

            grid.positionElements(startingX, startingY, scale);

            // so that its possible to tell the tiles below (so they aren't all stack on the same spot)
            startingX -= 6 * scale;
            startingY += 6 * scale;
        }
    }

    /**
     * Update the map information UI elements.
     */
    updateMapInformation() {
        this.mapInformation.update(
            this.howManyTilesLeft(),
            this.howManySelectablePairs()
        );
    }

    /**
     * Activate/deactivate the map.
     */
    activate(yes: boolean) {
        if (yes) {
            this.mapInformation.startTimer();
            this.isCurrentActive = true;
        } else {
            this.mapInformation.stopTimer();
            this.isCurrentActive = false;
        }
    }
}
