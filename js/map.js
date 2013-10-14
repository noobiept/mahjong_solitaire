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
var grid;
var newMap = this.determineTileNames( mapDescription );

var startingX = 20;
var startingY = 20;

for (var a = 0 ; a < newMap.length ; a++)
    {
    var gridDescription = newMap[ a ];

    grid = new Grid( startingX, startingY, 25, 25 );

    for (var b = 0 ; b < gridDescription.length ; b++)
        {
        var position = gridDescription[ b ];


        new Tile({
            tileId     : position.tileId,
            column     : position.column,
            line       : position.line,
            gridObject : grid
            });
        }

        // so that its possible to tell the tiles below (so they aren't all stack on the same spot)
    startingX -= 6;
    startingY += 6;
    }

GameMenu.updateInformation( this );
}


/*
    Determines the tile name for each position in the map, in a way so that the map is solvable

    Start with a complete map, and find the selectable tiles. Determine the tile names, and remove those tiles, find again the selectable tiles, and so on.
 */

Map.prototype.determineTileNames = function( mapDescription )
{
var newMap = [];
var grid;
var gridDescription;
var tilePosition;
var startingX = 20;
var startingY = 20;

    // construct the map
for (var a = 0 ; a < mapDescription.length ; a++)
    {
    gridDescription = mapDescription[ a ];

    grid = new Grid( startingX, startingY, 25, 25 );

        // initialize the grid's array
    newMap[ a ] = [];

    for (var b = 0 ; b < gridDescription.length ; b++)
        {
        tilePosition = gridDescription[ b ];

        new Tile({
            tileId     : '', // doesn't matter, since we aren't drawing the shape
            column     : tilePosition.column,
            line       : tilePosition.line,
            gridObject : grid,
            drawShape  : false
            });
        }

    startingX -= 6;
    startingY += 6;
    }


    // determine the selectable tiles
var allTiles = Tile.getAll();
var selectableTiles = [];
var tile;
var nextTile = this.getNextTile();


    // while we haven't cleared the map
while( allTiles.length > 0 )
    {
    selectableTiles = this.getSelectableTiles();

    while( selectableTiles.length > 0 )
        {
        var tileId = nextTile();

        var position = getRandomInt( 0, selectableTiles.length - 1 );

        tile = selectableTiles.splice( position, 1 )[ 0 ];

        newMap[ tile.gridObject.position ].push({
                column: tile.column,
                line: tile.line,
                tileId: tileId
            });

        tile.remove();
        }
    }

    // clear the grids
Grid.removeAll();

return newMap;
};



Map.prototype.getNextTile = function()
{
    // i'll get a pair of each one of the names here
    // so for example, there's 2 'bamboo1', each means we'll get 4 of them in the map (2 pairs)
var tilesNames = [
    'bamboo1', 'bamboo1',
    'bamboo2', 'bamboo2',
    'bamboo3', 'bamboo3',
    'bamboo4', 'bamboo4',
    'bamboo5', 'bamboo5',
    'bamboo6', 'bamboo6',
    'bamboo7', 'bamboo7',
    'bamboo8', 'bamboo8',
    'bamboo9', 'bamboo9',

    'character1', 'character1',
    'character2', 'character2',
    'character3', 'character3',
    'character4', 'character4',
    'character5', 'character5',
    'character6', 'character6',
    'character7', 'character7',
    'character8', 'character8',
    'character9', 'character9',

    'circle1', 'circle1',
    'circle2', 'circle2',
    'circle3', 'circle3',
    'circle4', 'circle4',
    'circle5', 'circle5',
    'circle6', 'circle6',
    'circle7', 'circle7',
    'circle8', 'circle8',
    'circle9', 'circle9',

    'wind1', 'wind1',
    'wind2', 'wind2',
    'wind3', 'wind3',
    'wind4', 'wind4',

    'dragon1', 'dragon1',
    'dragon1', 'dragon1',
    'dragon1', 'dragon1',

    'flower', 'flower',
    'season', 'season'
    ];

var previousTile = null;
var flowerNumber = 1;
var seasonNumber = 1;

return function()
    {
    var tileId;

        // we need to return the same tile 2 times (a pair), so check if its time to return the 2nd, otherwise get a new pair from the 'tileNames' array
    if ( previousTile )
        {
        tileId = previousTile;

        previousTile = null;
        }

    else
        {
        var position = getRandomInt( 0, tilesNames.length - 1 );

        tileId = tilesNames.splice( position, 1 )[ 0 ];

        previousTile = tileId;
        }


        // the flower/season works a bit differently than the others, since they can match with each other, but have different images
    if ( tileId == 'flower' )
        {
        tileId = tileId + flowerNumber;

        flowerNumber++;
        }

    if ( tileId == 'season' )
        {
        tileId = tileId + seasonNumber;

        seasonNumber++;
        }

    return tileId;
    }
};


/*
    Returns an array with the tiles that can be selected in the map
 */

Map.prototype.getSelectableTiles = function()
{
var allTiles = Tile.getAll();
var tile;
var selectableTiles = [];

for (var a = 0 ; a < allTiles.length ; a++)
    {
    tile = allTiles[ a ];

    if ( tile.isTileSelectable() )
        {
        selectableTiles.push( tile );
        }
    }

return selectableTiles;
};


Map.prototype.howManySelectablePairs = function()
{
var selectableTiles = this.getSelectableTiles();
var count = 0;
var first;

for (var a = 0 ; a < selectableTiles.length ; a++)
    {
    first = selectableTiles[ a ];

    for (var b = a + 1 ; b < selectableTiles.length ; b++)
        {
        if ( first.tileName == selectableTiles[ b ].tileName )
            {
            count++;

            selectableTiles.splice( b, 1 );
            selectableTiles.splice( a, 1 );

            a--;
            break;
            }
        }
    }


return count;
};



window.Map = Map;

}(window));