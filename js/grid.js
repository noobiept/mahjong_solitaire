(function(window)
{
var ALL_GRIDS = [];

function Grid( startingX, startingY, numberOfColumns, numberOfLines )
{
this.grid_array = [];

for (var a = 0 ; a < numberOfColumns ; a++)
    {
    this.grid_array[ a ] = [];

    for (var b = 0 ; b < numberOfLines ; b++)
        {
        this.grid_array[ a ][ b ] = null;
        }
    }

this.startingX = startingX;
this.startingY = startingY;
this.numberOfColumns = numberOfColumns;
this.numberOfLines = numberOfLines;
this.position = ALL_GRIDS.length;

ALL_GRIDS.push( this );
}


/**
    Each tile occupies a 2x2 square

    The column/line argument, points to the position in top left

    @param {Object} tileObject
    @param {Number} column
    @param {Number} line
    @param {Boolean=true} move
 */

Grid.prototype.addTile = function( tileObject, column, line, move )
{
this.grid_array[ column ][ line ] = tileObject;
this.grid_array[ column ][ line + 1 ] = tileObject;
this.grid_array[ column + 1 ][ line ] = tileObject;
this.grid_array[ column + 1 ][ line + 1 ] = tileObject;

if ( move !== false )
    {
    tileObject.moveTo( this.startingX + column * tileObject.width / 2,
            this.startingY + line * tileObject.height / 2 );
    }
};



Grid.prototype.removeTile = function( column, line )
{
this.grid_array[ column ][ line ] = null;
this.grid_array[ column ][ line + 1 ] = null;
this.grid_array[ column + 1 ][ line ] = null;
this.grid_array[ column + 1 ][ line + 1 ] = null;
};



Grid.get = function( position )
{
return ALL_GRIDS[ position ];
};


Grid.getAll = function()
{
return ALL_GRIDS;
};


Grid.numberOfGrids = function()
{
return ALL_GRIDS.length;
};



Grid.removeAll = function()
{
ALL_GRIDS.length = 0;
};



window.Grid = Grid;

}(window));