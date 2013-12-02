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


function Map( mapInfo, centerIn )
{
this.columns = mapInfo.numberOfColumns;
this.lines = mapInfo.numberOfLines;

var canvasWidth = CANVAS.width;
var canvasHeight = CANVAS.height;

var tileWidth = Tile.getImageWidth();
var tileHeight = Tile.getImageHeight();

    // find the scale value that occupies the whole width/height of the canvas, then choose the lesser value (since width/height can have different values)
    // we're dividing the columns/lines by 2 because the tile occupies a 2x2 square in the grid
var scaleWidth = canvasWidth / ( this.columns / 2 * tileWidth );
var scaleHeight = canvasHeight / ( this.lines / 2 * tileHeight );

if ( scaleWidth < scaleHeight )
    {
    this.scale = scaleWidth;
    }

else
    {
    this.scale = scaleHeight;
    }


    // contain all grids/tiles of this map
this.all_tiles = [];
this.all_grids = [];

    // to clear tiles you need to select 2 tiles of same type, this variable points to the first one being selected
this.selected_tile = null;

var newMap = this.determineTileNames( mapInfo.mapDescription );

this.startingX = centerIn;

this.buildMap( newMap, centerIn );
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

Map.prototype.buildMap = function( mapDescription, centerIn )
{
var mapObject = this;
var grid;

    // center the map horizontally
var canvasWidth = CANVAS.width;
var mapWidth = this.columns / 2 * Tile.getImageWidth() * this.scale;


var startingX = 0;
var startingY = 10;

    // center the map in the left or right side of the canvas (when its 2 players mode), or in the center when its just one player
if ( centerIn == 'left' )
    {
    startingX = canvasWidth / 4 - mapWidth / 2;
    }

else if ( centerIn == 'right' )
    {
    startingX = canvasWidth / 4 - mapWidth / 2 + canvasWidth / 2;
    }

    // center in the middle (default)
else
    {
    startingX = canvasWidth / 2 - mapWidth / 2;
    }



for (var a = 0 ; a < mapDescription.length ; a++)
    {
    var gridDescription = mapDescription[ a ];

    grid = this.addGrid({
            startingX       : startingX,
            startingY       : startingY,
            numberOfColumns : this.columns,
            numberOfLines   : this.lines
        });


        // get all the columns of each line
        // key the line number, value an array with the columns
        // example = { "10": [ { column: 2 }, ... ] }
    var lines = {};

    for (var b = 0 ; b < gridDescription.length ; b++)
        {
        var position = gridDescription[ b ];

        var lineStr = position.line.toString();

        if ( !lines[ lineStr ] )
            {
            lines[ lineStr ] = [];
            }

        lines[ lineStr ].push({
                tileId   : position.tileId,
                tileName : position.tileName,
                column   : position.column
            });
        }

        // now we need to sort the lines (bottom to top), and the columns (left to right)
    var linesNumber = [];

        // get all the lines numbers
    $.each(lines, function(key, value)
        {
        linesNumber.push( parseInt( key ) );
        });

        // sort the lines (the higher numbers first)
    linesNumber.sort(function(a, b)
        {
        return b - a;
        });

        // go each line at a time
    for (var c = 0 ; c < linesNumber.length ; c++)
        {
        var line = linesNumber[ c ];

            // get all the elements of the line
        var columns = lines[ line.toString() ];

            // sort first by the columns (left to right, so lower numbers first)
        columns.sort(function(a, b)
            {
            return a.column - b.column;
            });

            // add the tiles, already sorted out
        for (var d = 0 ; d < columns.length ; d++)
            {
            this.addTile({
                    tileId     : columns[ d ].tileId,
                    tileName   : columns[ d ].tileName,
                    column     : columns[ d ].column,
                    line       : line,
                    gridObject : grid,
                    mapObject  : this,
                    scale      : mapObject.scale
                });
            }
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

    grid = this.addGrid({
            startingX       : startingX,
            startingY       : startingY,
            numberOfColumns : this.columns,
            numberOfLines   : this.lines
        });

        // initialize the grid's array
    newMap[ a ] = [];

    for (var b = 0 ; b < gridDescription.length ; b++)
        {
        tilePosition = gridDescription[ b ];

        this.addTile({
                tileId     : '', // doesn't matter, since we aren't drawing the shape
                column     : tilePosition.column,
                line       : tilePosition.line,
                gridObject : grid,
                mapObject  : this,
                drawShape  : false
            });
        }

    startingX -= 6;
    startingY += 6;
    }


    // determine the selectable tiles
var allTiles = this.all_tiles;
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

        this.removeTile( tile );
        }
    }

    // clear the grids
this.removeAllGrids();

return newMap;
};



Map.prototype.shuffle = function()
{
var allTiles = this.all_tiles;
var a;

var numberOfGrids = this.all_grids.length;
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
this.removeAllTiles();
this.removeAllGrids();

    // re-make the map, with the current tiles
var newMap = this.determineTileNames( currentMap, tilePairs );

this.buildMap( newMap, this.startingX );
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
var allTiles = this.all_tiles;
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


/*
    shadows the un-selectable tiles in the map
 */

Map.prototype.shadowTiles = function()
{
var allTiles = this.all_tiles;

for (var a = 0 ; a < allTiles.length ; a++)
    {
    var tile = allTiles[ a ];

    if ( !tile.isTileSelectable() )
        {
        tile.shadow();
        }

    else
        {
        tile.clearBackground();
        }
    }
};


Map.prototype.unShadowTiles = function()
{
var allTiles = this.all_tiles;

for (var a = 0 ; a < allTiles.length ; a++)
    {
    var tile = allTiles[ a ];

    tile.clearBackground();
    }
};



Map.prototype.addTile = function( args )
{
var tile = new Tile( args );

this.all_tiles.push( tile );

return tile;
};


Map.prototype.removeTile = function( tileObject )
{
var position = this.all_tiles.indexOf( tileObject );

this.all_tiles.splice( position, 1 );

tileObject.remove();
};



Map.prototype.addGrid = function( args )
{
var grid = new Grid( args.startingX, args.startingY, args.numberOfColumns, args.numberOfLines, this.all_grids.length );

this.all_grids.push( grid );

return grid;
};


Map.prototype.removeGrid = function( gridObject )
{
var position = this.all_grids.indexOf( gridObject );

this.all_grids.splice( position, 1 );
};


Map.prototype.removeAllGrids = function()
{
this.all_grids.length = 0;
};

Map.prototype.removeAllTiles = function()
{
for (var a = 0 ; a < this.all_tiles.length ; a++)
    {
    this.all_tiles[ a ].remove();
    }

this.all_tiles.length = 0;
};



Map.prototype.clear = function()
{
this.removeAllTiles();
this.removeAllGrids();
};


window.Map = Map;

}(window));