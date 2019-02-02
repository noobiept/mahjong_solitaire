// @ts-ignore
import Tile from '/static/scripts/tile.js';
// @ts-ignore
import Grid from '/static/scripts/grid.js';
import * as Map from './map.js';
import { STAGE } from './map_editor.js';


export interface GridPositionArgs {
    column: number;
    line: number;
    grid: Grid;
    hidden: boolean;
}

    // position in array corresponds to position in the grid
    // the value is another array with the GridPosition
var ALL_POSITIONS: GridPosition[][] = [];


/**
 * Each GridPosition represents a point in the grid, not a tile, since each tile occupies a 2x2 square.
 */
export default class GridPosition
{
container: createjs.Container;
width: number;
height: number;
hasTile: boolean;
tileObject: Tile | null;
column: number;
line: number;
gridObject: Grid;
gridPosition: number;


constructor( args: GridPositionArgs )
    {
    var _this = this;
    var width = Tile.getImageWidth() / 2;
    var height = Tile.getImageHeight() / 2;

    var container = new createjs.Container();

    container.setBounds( 0, 0, width, height );

    var background = new createjs.Shape();

    var g = background.graphics;

    g.beginFill( 'gray' );
    g.drawRoundRect( 0, 0, 10, 10, 3 );

    container.addChild( background );
    container.on( 'click', function()
        {
        _this.onClick();
        });

    if ( args.hidden !== true )
        {
        STAGE.addChild( container );
        }

    this.container = container;
    this.width = width;
    this.height = height;
    this.hasTile = false;
    this.tileObject = null;
    this.column = args.column;
    this.line = args.line;
    this.gridObject = args.grid;

    var gridPosition = args.grid.position;

    if ( !ALL_POSITIONS[ gridPosition ] )
        {
        ALL_POSITIONS[ gridPosition ] = [];
        }

    this.gridPosition = gridPosition;

    ALL_POSITIONS[ gridPosition ].push( this );
    }


moveTo( x: number, y: number )
    {
    this.container.x = x;
    this.container.y = y;
    }


/**
 * @param drawBelow If the tile is draw below all elements (z-index)
 */
onClick( drawBelow= true )
    {
    if ( this.hasTile )
        {
        this.hasTile = false;

        Map.removeTile( this.tileObject );
        this.tileObject = null;
        }

    else
        {
        this.hasTile = true;

        var tile = Map.addTile({
                tileId: 'bamboo1',
                column: this.column,
                line: this.line,
                gridObject: this.gridObject
            });

        this.tileObject = tile;

        tile.container.scaleX = 2;
        tile.container.scaleY = 2;
        tile.container.x = this.container.x;
        tile.container.y = this.container.y;

            // so that it is drawn below the other elements (otherwise the tile could be on top of some other grid position, making it difficult to click on it
        if ( drawBelow !== false && this.tileObject && this.tileObject.container )
            {
            STAGE.setChildIndex( this.tileObject.container, 0 );
            }
        }

    Map.updateTilesLeft();
    }


show()
    {
    STAGE.addChild( this.container );

    if ( this.tileObject && this.tileObject.container )
        {
        STAGE.addChild( this.tileObject.container );
        }
    }


hide()
    {
    STAGE.removeChild( this.container );

    if ( this.tileObject && this.tileObject.container )
        {
        STAGE.removeChild( this.tileObject.container );
        }
    }


remove()
    {
    if ( this.tileObject )
        {
        Map.removeTile( this.tileObject );
        this.tileObject = null;
        }


    STAGE.removeChild( this.container );

    var position = ALL_POSITIONS[ this.gridPosition ].indexOf( this );

    ALL_POSITIONS[ this.gridPosition ].splice( position, 1 );
    }


static removeAll()
    {
    for (var a = 0 ; a < ALL_POSITIONS.length ; a++)
        {
        var grids = ALL_POSITIONS[ a ];

        for (var b = 0 ; b < grids.length ; b++)
            {
            var gridPosition = grids[ b ];

            gridPosition.remove();

            b--;
            }
        }

    ALL_POSITIONS.length = 0;
    }


/*
    Get all the GridPosition elements from a selected grid
 */
static getGrid( gridPosition: number )
    {
    return ALL_POSITIONS[ gridPosition ];
    }


static getAll()
    {
    return ALL_POSITIONS;
    }
}
