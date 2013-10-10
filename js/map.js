(function(window)
{
/*
    Generates a map. Each map has 144 tiles.

        - 4x bamboo suit (1 to 9)
        - 4x character suit (1 to 9)
        - 4x circle suit (1 to 9)
        - 4x wind tiles (4)
        - 4x dragon tiles (3)
        - flower tiles (4)
        - season tiles (4)
 */


function Map( mapDescription )
{
var nextTile = this.getNextTile();
var grid;

var startingX = 20;
var startingY = 20;

for (var a = 0 ; a < mapDescription.length ; a++)
    {
    var gridDescription = mapDescription[ a ];

    grid = new Grid( startingX, startingY, 25, 25 );

    for (var b = 0 ; b < gridDescription.length ; b++)
        {
        var position = gridDescription[ b ];

        var tileObject = nextTile( grid, position.column, position.line );
        }

        // so that its possible to tell the tiles below (so they aren't all stack on the same spot)
    startingX -= 6;
    startingY += 6;
    }


//this.addTileSuit( 4, 9, 'bamboo' );
//this.addTileSuit( 4, 9, 'character' );
//this.addTileSuit( 4, 9, 'circle' );
//this.addTileSuit( 4, 4, 'wind' );
//this.addTileSuit( 4, 3, 'dragon' );
//this.addTileSuit( 1, 4, 'flower', 'flower' );
//this.addTileSuit( 1, 4, 'season', 'season' );

}


Map.prototype.getNextTile = function()
{
var tilesLeft = 144;

var tilesNames = [ '' ];

return function( gridObject, column, line )
    {
    return new Tile({
            column     : column,
            line       : line,
            tileId     : 'bamboo1',     //HERE
            tileName   : 'bamboo1',
            gridObject : gridObject
        });
    }
};





Map.prototype.addTileSuit = function( gridObject, repetitions, maxNumber, tileId, tileName )
{
var width = CANVAS.width;
var height = CANVAS.height;

var column = 0;
var line = 0;   //HERE

for (var a = 0 ; a < repetitions ; a++)
    {
    for (var b = 0 ; b < maxNumber ; b++)
        {
        new Tile({
                column     : column,
                line       : 0,
                tileId     : tileId + (b + 1),
                tileName   : tileName,
                gridObject : gridObject
            });

        column++;
        }
    }
};



window.Map = Map;

}(window));