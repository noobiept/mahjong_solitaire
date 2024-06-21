import * as MapEditorMap from "./map_editor_map.js";
import { addToStage, removeFromStage } from "./map_editor.js";
import MapEditorGrid from "./map_editor_grid.js";
import MapEditorTile from "./map_editor_tile.js";

export interface GridPositionArgs {
    column: number;
    line: number;
    grid: MapEditorGrid;
    hidden: boolean;
}

// position in array corresponds to position in the grid
// the value is another array with the GridPosition
const ALL_POSITIONS: GridPosition[][] = [];

/**
 * Each GridPosition represents a point in the grid, not a tile, since each tile occupies a 2x2 square.
 */
export default class GridPosition {
    private container: createjs.Container;
    private hasTile: boolean;
    private tileObject: MapEditorTile | null;
    private gridObject: MapEditorGrid;
    readonly gridPosition: number;
    readonly column: number;
    readonly line: number;
    readonly width: number;
    readonly height: number;

    constructor(args: GridPositionArgs) {
        const width = MapEditorTile.getImageWidth() / 2;
        const height = MapEditorTile.getImageHeight() / 2;

        const container = new createjs.Container();

        container.setBounds(0, 0, width, height);

        const background = new createjs.Shape();
        const g = background.graphics;

        g.beginFill("gray");
        g.drawRoundRect(0, 0, 10, 10, 3);

        container.addChild(background);
        container.on("click", () => {
            this.onClick();
        });

        if (args.hidden !== true) {
            addToStage(container);
        }

        this.container = container;
        this.width = width;
        this.height = height;
        this.hasTile = false;
        this.tileObject = null;
        this.column = args.column;
        this.line = args.line;
        this.gridObject = args.grid;

        const gridPosition = args.grid.position;

        if (!ALL_POSITIONS[gridPosition]) {
            ALL_POSITIONS[gridPosition] = [];
        }

        this.gridPosition = gridPosition;

        ALL_POSITIONS[gridPosition].push(this);
    }

    /**
     * Move to a different position.
     */
    moveTo(x: number, y: number) {
        this.container.x = x;
        this.container.y = y;
    }

    /**
     * Add/remove a tile in this position.
     * @param drawBelow If the tile is draw below all elements (z-index).
     */
    onClick(drawBelow = true) {
        if (this.hasTile) {
            this.hasTile = false;

            if (this.tileObject) {
                MapEditorMap.removeTile(this.tileObject);
            }

            this.tileObject = null;
        } else {
            this.hasTile = true;

            const tile = MapEditorMap.addTile({
                tileId: "bamboo1",
                column: this.column,
                line: this.line,
                gridObject: this.gridObject,
            });

            this.tileObject = tile;

            tile.scaleContainer(2);
            tile.moveTo(this.container.x, this.container.y);

            // so that it is drawn below the other elements (otherwise the tile could be on top of some other grid position, making it difficult to click on it
            if (drawBelow !== false && this.tileObject) {
                this.tileObject.changeDepthInStage(0);
            }
        }

        MapEditorMap.updateTilesLeft();
    }

    /**
     * Add the associated tile to the stage (if it exists).
     */
    addTileToStage() {
        if (this.tileObject) {
            this.tileObject.addToStage();
        }
    }

    /**
     * Show this grid position and the associated tile.
     */
    show() {
        addToStage(this.container);
        this.addTileToStage();
    }

    /**
     * Hide the grid position and the associated tile.
     */
    hide() {
        removeFromStage(this.container);

        if (this.tileObject) {
            this.tileObject.removeFromStage();
        }
    }

    /**
     * Remove this grid position.
     */
    remove() {
        if (this.tileObject) {
            MapEditorMap.removeTile(this.tileObject);
            this.tileObject = null;
        }

        removeFromStage(this.container);

        const position = ALL_POSITIONS[this.gridPosition].indexOf(this);
        ALL_POSITIONS[this.gridPosition].splice(position, 1);
    }

    /**
     * Remove all the grid positions.
     */
    static removeAll() {
        for (let a = 0; a < ALL_POSITIONS.length; a++) {
            const grids = ALL_POSITIONS[a];

            for (let b = 0; b < grids.length; b++) {
                const gridPosition = grids[b];
                gridPosition.remove();

                b--;
            }
        }

        ALL_POSITIONS.length = 0;
    }

    /**
     * Get all the GridPosition elements from a selected grid.
     */
    static getGrid(gridPosition: number) {
        return ALL_POSITIONS[gridPosition];
    }

    /**
     * Get all the grid positions in all the grids.
     */
    static getAll() {
        return ALL_POSITIONS;
    }
}
