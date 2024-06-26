import MapEditorTile from "./map_editor_tile.js";

export interface GridArgs {
    numberOfColumns: number;
    numberOfLines: number;
    position: number;
}

export default class MapEditorGrid {
    private grid_array: (MapEditorTile | null)[][];
    private all_tiles: MapEditorTile[];
    readonly numberOfColumns: number;
    readonly numberOfLines: number;
    readonly position: number;

    constructor(args: GridArgs) {
        const numberOfColumns = args.numberOfColumns;
        const numberOfLines = args.numberOfLines;

        this.grid_array = [];
        this.all_tiles = [];

        for (let a = 0; a < numberOfColumns; a++) {
            this.grid_array[a] = [];

            for (let b = 0; b < numberOfLines; b++) {
                this.grid_array[a][b] = null;
            }
        }

        this.numberOfColumns = numberOfColumns;
        this.numberOfLines = numberOfLines;
        this.position = args.position;
    }

    /**
     * Each tile occupies a 2x2 square.
     * The column/line argument, points to the position in top left.
     */
    addTile(tileObject: MapEditorTile, column: number, line: number) {
        this.grid_array[column][line] = tileObject;
        this.grid_array[column][line + 1] = tileObject;
        this.grid_array[column + 1][line] = tileObject;
        this.grid_array[column + 1][line + 1] = tileObject;

        this.all_tiles.push(tileObject);
    }

    /**
     * Remove a tile from the grid (in a 2x2 square).
     */
    removeTile(column: number, line: number) {
        const tile = this.grid_array[column][line];
        if (!tile) {
            return;
        }

        const position = this.all_tiles.indexOf(tile);

        this.all_tiles.splice(position, 1);

        this.grid_array[column][line] = null;
        this.grid_array[column][line + 1] = null;
        this.grid_array[column + 1][line] = null;
        this.grid_array[column + 1][line + 1] = null;
    }

    /**
     * Reposition/resize the grid tiles.
     */
    positionElements(startingX: number, startingY: number, scale: number) {
        for (let a = 0; a < this.all_tiles.length; a++) {
            const tile = this.all_tiles[a];

            tile.scaleContainer(scale);
            tile.moveTo(
                startingX + (tile.column * tile.width * scale) / 2,
                startingY + (tile.line * tile.height * scale) / 2
            );
        }
    }
}
