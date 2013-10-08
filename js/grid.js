(function(window)
{
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
}



Grid.prototype.addTile = function( tileObject, column, line )
{
this.grid_array[ column ][ line ] = tileObject;

tileObject.moveTo( this.startingX + column * tileObject.width,
                   this.startingY + line * tileObject.height );
};



Grid.prototype.removeTile = function( column, line )
{
this.grid_array[ column ][ line ].remove();
this.grid_array[ column ][ line ] = null;
};



window.Grid = Grid;

}(window));