/*exported Grid*/
'use strict';


class Grid
{
/**
 * @param {number} numberOfColumns
 * @param {number} numberOfLines
 * @param {number} position
 */
constructor( numberOfColumns, numberOfLines, position )
    {
    this.grid_array = [];
    this.all_tiles = [];

    for (var a = 0 ; a < numberOfColumns ; a++)
        {
        this.grid_array[ a ] = [];

        for (var b = 0 ; b < numberOfLines ; b++)
            {
            this.grid_array[ a ][ b ] = null;
            }
        }

    this.numberOfColumns = numberOfColumns;
    this.numberOfLines = numberOfLines;
    this.position = position;
    }


/**
    Each tile occupies a 2x2 square

    The column/line argument, points to the position in top left

    @param {Object} tileObject
    @param {number} column
    @param {number} line
 */
addTile( tileObject, column, line )
    {
    this.grid_array[ column ][ line ] = tileObject;
    this.grid_array[ column ][ line + 1 ] = tileObject;
    this.grid_array[ column + 1 ][ line ] = tileObject;
    this.grid_array[ column + 1 ][ line + 1 ] = tileObject;

    this.all_tiles.push( tileObject );
    }


/**
 * Remove a tile from the grid (in a 2x2 square).
 *
 * @param {number} column
 * @param {number} line
 */
removeTile( column, line )
    {
    var tile = this.grid_array[ column ][ line ];
    var position = this.all_tiles.indexOf( tile );

    this.all_tiles.splice( position, 1 );

    this.grid_array[ column ][ line ] = null;
    this.grid_array[ column ][ line + 1 ] = null;
    this.grid_array[ column + 1 ][ line ] = null;
    this.grid_array[ column + 1 ][ line + 1 ] = null;
    }


/**
 * Reposition/resize the grid tiles.
 *
 * @param {number} startingX
 * @param {number} startingY
 * @param {number} scale
 */
positionElements( startingX, startingY, scale )
    {
    for (var a = 0 ; a < this.all_tiles.length ; a++)
        {
        var tile = this.all_tiles[ a ];

        tile.container.scaleX = scale;
        tile.container.scaleY = scale;
        tile.moveTo( startingX + tile.column * tile.width * scale / 2,
                startingY + tile.line * tile.height * scale / 2 );
        }
    }
}
