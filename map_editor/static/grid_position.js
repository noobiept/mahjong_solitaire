/*exported GridPosition*/
/*global Tile, createjs, STAGE*/
'use strict';

/*
    Each GridPosition represents a point in the grid, not a tile, since each tile occupies a 2x2 square
 */

    // position in array corresponds to position in the grid
    // the value is another array with the GridPosition
var ALL_POSITIONS = [];


class GridPosition
{
constructor( column, line, gridObject, hidden )
    {
    var width = Tile.getImageWidth() / 2;
    var height = Tile.getImageHeight() / 2;

    var container = new createjs.Container();

    container.setBounds( width, height );

    var background = new createjs.Shape();

    var g = background.graphics;

    g.beginFill( 'gray' );
    g.drawRoundRect( 0, 0, 10, 10, 3 );

    container.addChild( background );
    container.on( 'click', this.onClick, this );

    if ( hidden !== true )
        {
        STAGE.addChild( container );
        }

    this.container = container;
    this.width = width;
    this.height = height;
    this.hasTile = false;
    this.tileObject = null;
    this.column = column;
    this.line = line;
    this.gridObject = gridObject;

    var gridPosition = gridObject.position;

    if ( !ALL_POSITIONS[ gridPosition ] )
        {
        ALL_POSITIONS[ gridPosition ] = [];
        }

    this.gridPosition = gridPosition;

    ALL_POSITIONS[ gridPosition ].push( this );
    }


moveTo( x, y )
    {
    this.container.x = x;
    this.container.y = y;
    }


/**
 * @param {bool} drawBelow If the tile is draw below all elements (z-index)
 */
onClick( drawBelow )
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
        if ( drawBelow !== false )
            {
            STAGE.setChildIndex( this.tileObject.container, 0 );
            }
        }

    Map.updateTilesLeft();
    }


show()
    {
    STAGE.addChild( this.container );

    if ( this.tileObject )
        {
        STAGE.addChild( this.tileObject.container );
        }
    }


hide()
    {
    STAGE.removeChild( this.container );

    if ( this.tileObject )
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
static getGrid( gridPosition )
    {
    return ALL_POSITIONS[ gridPosition ];
    }


static getAll()
    {
    return ALL_POSITIONS;
    }
}
