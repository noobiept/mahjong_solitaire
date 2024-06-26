import Grid from "./grid.js";
import { getAsset, addToStage, removeFromStage } from "./main.js";

export type TileName =
    | "bamboo1"
    | "bamboo2"
    | "bamboo3"
    | "bamboo4"
    | "bamboo5"
    | "bamboo6"
    | "bamboo7"
    | "bamboo8"
    | "bamboo9"
    | "character1"
    | "character2"
    | "character3"
    | "character4"
    | "character5"
    | "character6"
    | "character6"
    | "character7"
    | "character8"
    | "character9"
    | "circle1"
    | "circle2"
    | "circle3"
    | "circle4"
    | "circle5"
    | "circle6"
    | "circle7"
    | "circle8"
    | "circle9"
    | "wind1"
    | "wind2"
    | "wind3"
    | "wind4"
    | "dragon1"
    | "flower"
    | "season";
export type TileId =
    | "bamboo1"
    | "bamboo2"
    | "bamboo3"
    | "bamboo4"
    | "bamboo5"
    | "bamboo6"
    | "bamboo7"
    | "bamboo8"
    | "bamboo9"
    | "character1"
    | "character2"
    | "character3"
    | "character4"
    | "character5"
    | "character6"
    | "character6"
    | "character7"
    | "character8"
    | "character9"
    | "circle1"
    | "circle2"
    | "circle3"
    | "circle4"
    | "circle5"
    | "circle6"
    | "circle7"
    | "circle8"
    | "circle9"
    | "wind1"
    | "wind2"
    | "wind3"
    | "wind4"
    | "dragon1"
    | "dragon2"
    | "dragon3"
    | "flower1"
    | "flower2"
    | "flower3"
    | "flower4"
    | "season1"
    | "season2"
    | "season3"
    | "season4";

export interface TileArgs {
    tileId: TileId; // the id of the image to be loaded
    tileName?: TileName; // tile name plus the number ('bamboo1' for example). This is going to be used to know which tiles match (we can't use the id for that, since there's for example flower tiles that have different images, but can be matched between them
    column: number;
    line: number;
    gridObject: Grid;
    onClick?: (tile: Tile) => void;
}

/**
 * A tile is a manufactured piece of hard-wearing material such as ceramic, stone, metal, or even glass.
 */
export default class Tile {
    // the original image dimensions, this can be scaled
    static readonly WIDTH = 36;
    static readonly HEIGHT = 45;

    readonly width: number;
    readonly height: number;
    readonly tileId: TileId;
    readonly tileName: TileName;
    readonly column: number;
    readonly line: number;
    readonly gridObject: Grid;

    private background: createjs.Shape;
    private container: createjs.Container;

    constructor(args: TileArgs) {
        // :: validate the arguments :: //

        if (typeof args.tileId === "undefined") {
            throw new Error("Provide the .tileId. Got: " + args.tileId);
        }

        if (typeof args.gridObject === "undefined") {
            throw new Error("Provide the .gridObject. Got: " + args.gridObject);
        }

        if (typeof args.tileName === "undefined") {
            // if not provided, we assume its the same as the id
            args.tileName = args.tileId as TileName;
        }

        this.width = Tile.WIDTH;
        this.height = Tile.HEIGHT;

        // :: draw the shape :: //

        // load the image
        const shape = new createjs.Bitmap(getAsset(args.tileId));

        // and the background (its used to tell when a tile is selected or not)
        const background = new createjs.Shape();

        const container = new createjs.Container();
        container.addChild(shape);
        container.addChild(background);
        container.on("click", () => {
            if (args.onClick) {
                args.onClick(this);
            }
        });

        // :: set properties :: //

        this.tileId = args.tileId;
        this.tileName = args.tileName;
        this.background = background;
        this.container = container;
        this.column = args.column;
        this.line = args.line;
        this.gridObject = args.gridObject;

        this.addToStage();
    }

    /**
     * Add the tile's container to the stage (to be drawn).
     */
    addToStage() {
        addToStage(this.container);
    }

    /**
     * Scale the tile's container (same scale for X/Y).
     */
    scaleContainer(scale: number) {
        this.container.scaleX = scale;
        this.container.scaleY = scale;
    }

    /**
     * Show the selected background on the tile.
     */
    selectTile() {
        const g = this.background.graphics;

        g.beginFill("rgba(255, 0, 0, 0.3)");
        g.drawRoundRect(3, 3, Tile.WIDTH + 2, Tile.HEIGHT + 2, 5);
    }

    /**
     * Show the highlighted background on the tile.
     */
    highlightTile() {
        const g = this.background.graphics;

        g.clear();
        g.beginFill("rgba(255, 215, 0, 0.3)");
        g.drawRoundRect(3, 3, Tile.WIDTH + 2, Tile.HEIGHT + 2, 5);
    }

    /**
     * Go back to the normal background on the tile.
     */
    clearBackground() {
        const g = this.background.graphics;

        g.clear();
        g.beginFill("transparent");
        g.drawRoundRect(3, 3, Tile.WIDTH + 2, Tile.HEIGHT + 2, 5);
    }

    /**
     * Show the shadow background on the tile.
     */
    shadow() {
        const g = this.background.graphics;

        g.clear();
        g.beginFill("rgba(0, 0, 0, 0.3)");
        g.drawRoundRect(3, 3, Tile.WIDTH + 2, Tile.HEIGHT + 2, 5);
    }

    /**
     * Move the tile to a different position.
     */
    moveTo(x: number, y: number) {
        this.container.x = x;
        this.container.y = y;
    }

    /**
     * Remove the tile from the stage/grid.
     */
    remove() {
        removeFromStage(this.container);
        this.gridObject.removeTile(this.column, this.line);
    }
}
