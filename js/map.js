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
this.addTileSuit( 4, 9, 'bamboo' );
this.addTileSuit( 4, 9, 'character' );
this.addTileSuit( 4, 9, 'circle' );
this.addTileSuit( 4, 4, 'wind' );
this.addTileSuit( 4, 3, 'dragon' );
this.addTileSuit( 1, 4, 'flower', 'flower' );
this.addTileSuit( 1, 4, 'season', 'season' );
}


Map.prototype.addTileSuit = function( repetitions, maxNumber, tileId, tileName )
{
var width = CANVAS.width;
var height = CANVAS.height;

for (var a = 0 ; a < repetitions ; a++)
    {
    for (var b = 0 ; b < maxNumber ; b++)
        {
        new Tile({
                x : getRandomInt( 0, width ),
                y : getRandomInt( 0, height ),
                tileId : tileId + (b + 1),
                tileName: tileName
            });
        }
    }
};



window.Map = Map;

}(window));