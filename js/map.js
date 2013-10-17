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
var newMap = this.determineTileNames( mapDescription );

this.buildMap( newMap );
}


/*
    mapDescription = [
            [           // grid 1
                { column: 0, line: 0, tileId: 'bamboo1', tileName: 'bamboo1' },
                { column: 2, line: 2, tileId: 'flower1', tileName: 'flower' },
                    // ...
            ],
            [           // grid 2
                // ...
            ]
        ]
 */

Map.prototype.buildMap = function( mapDescription )
{
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


        new Tile({
            tileId     : position.tileId,
            tileName   : position.tileName,
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
};



/*
    Determines the tile name for each position in the map, in a way so that the map is solvable

    Start with a complete map, and find the selectable tiles. Determine the tile names, and remove those tiles, find again the selectable tiles, and so on.
 */

Map.prototype.determineTileNames = function( mapDescription, tilePairs )
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
var nextTile = this.getNextTile( tilePairs );


    // while we haven't cleared the map
while( allTiles.length > 0 )
    {
    selectableTiles = this.getSelectableTiles();

    while( selectableTiles.length > 0 )
        {
        var nextTileName = nextTile();

        var position = getRandomInt( 0, selectableTiles.length - 1 );

        tile = selectableTiles.splice( position, 1 )[ 0 ];

        newMap[ tile.gridObject.position ].push({
                column   : tile.column,
                line     : tile.line,
                tileId   : nextTileName.tileId,
                tileName : nextTileName.tileName
            });

        tile.remove();
        }
    }

    // clear the grids
Grid.removeAll();

return newMap;
};



Map.prototype.shuffle = function()
{
var allTiles = Tile.getAll();
var a;

var numberOfGrids = Grid.numberOfGrids();
var currentMap = [];

for (a = 0 ; a < numberOfGrids ; a++)
    {
    currentMap[ a ] = [];
    }


var tile;
var tileNames = [];

    // get the current positions and tile names
for (a = 0 ; a < allTiles.length ; a++)
    {
    tile = allTiles[ a ];

    currentMap[ tile.gridObject.position ].push({
            column: tile.column,
            line: tile.line
        });

    tileNames.push( tile.tileName );
    }


    // remove the pairs, since the .getNextTile() already takes care of that (only have one for each pair)
var tilePairs = [];
var firstTile, secondTile;

for (a = 0 ; a < tileNames.length ; a++)
    {
    firstTile = tileNames[ a ];

    for (var b = a + 1 ; b < tileNames.length ; b++)
        {
        secondTile = tileNames[ b ];

        if ( firstTile == secondTile )
            {
            tilePairs.push( firstTile );

            tileNames.splice( b, 1 );
            tileNames.splice( a, 1 );

            a--;
            break;
            }
        }
    }

    // clear the current map
Tile.removeAll();
Grid.removeAll();
console.log(currentMap);
    // re-make the map, with the current tiles
var newMap = this.determineTileNames( currentMap, tilePairs );
console.log(newMap);
this.buildMap( newMap );
};



Map.prototype.getNextTile = function( tilesNames )
{
if ( typeof tilesNames == 'undefined' )
    {
        // i'll get a pair of each one of the names here
        // so for example, there's 2 'bamboo1', each means we'll get 4 of them in the map (2 pairs)
    tilesNames = [
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
    }


var previousTile = null;
var flowerNumber = 1;
var seasonNumber = 1;

return function()
    {
    var tileName;
    var tileId;

        // we need to return the same tile 2 times (a pair), so check if its time to return the 2nd, otherwise get a new pair from the 'tileNames' array
    if ( previousTile )
        {
        tileName = previousTile;

        previousTile = null;
        }

    else
        {
        var position = getRandomInt( 0, tilesNames.length - 1 );

        tileName = tilesNames.splice( position, 1 )[ 0 ];

        previousTile = tileName;
        }


        // the flower/season works a bit differently than the others, since they can match with each other, but have different images
    if ( tileName == 'flower' )
        {
        tileId = tileName + flowerNumber;

        flowerNumber++;
        }

    else if ( tileName == 'season' )
        {
        tileId = tileName + seasonNumber;

        seasonNumber++;
        }

    else
        {
        tileId = tileName;
        }

    return {
        tileId   : tileId,
        tileName : tileName
        };
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