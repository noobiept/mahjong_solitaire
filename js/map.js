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

function Map()
{
var grid = new Grid( 0, 0, 20, 20 );

this.addTileSuit( grid, 1, 9, 'bamboo' );

//this.addTileSuit( 4, 9, 'bamboo' );
//this.addTileSuit( 4, 9, 'character' );
//this.addTileSuit( 4, 9, 'circle' );
//this.addTileSuit( 4, 4, 'wind' );
//this.addTileSuit( 4, 3, 'dragon' );
//this.addTileSuit( 1, 4, 'flower', 'flower' );
//this.addTileSuit( 1, 4, 'season', 'season' );

this.grids_array = [ grid ];
}


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