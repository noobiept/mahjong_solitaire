(function(window)
{
var ALL_GRIDS = [];
var ALL_TILES = [];

    // current selected grid (0+), or -1 is none is selected (when its showing the whole map)
var SELECTED_GRID = -1;

var TILES_LEFT = 144;

function Map()
{

}


Map.constructGrid = function( mapInfo )
{
var numberOfGrids;

if ( mapInfo.numberOfGrids )
    {
    numberOfGrids = mapInfo.numberOfGrids;
    }

else
    {
    numberOfGrids = mapInfo.mapDescription.length;
    }

var columns = mapInfo.numberOfColumns;
var lines = mapInfo.numberOfLines;

var startingX = 100;
var startingY = 0;
var grid;

var gridsContainer = document.querySelector( '#Grids-container' );

for (var a = 0 ; a < numberOfGrids ; a++)
    {
    Map.addGrid({
            startingX       : startingX,
            startingY       : startingY,
            numberOfColumns : columns + 1,
            numberOfLines   : lines
        });


    var gridElement = document.createElement( 'div' );

    $( gridElement ).text( a + 1 );

    gridElement.onclick = function()
        {
        var newGrid = parseInt( $( this ).text() ) - 1;

        Map.selectGrid( newGrid );
        };

    gridsContainer.appendChild( gridElement );

    startingX -= 6;
    startingY += 6;
    }


    // no grid selected initially
SELECTED_GRID = -1;


for (var a = 0 ; a < numberOfGrids ; a++)
    {
    grid = Map.getGrid( a );

    for (var b = 0 ; b < columns ; b++)
        {
        for (var c = 0 ; c < lines ; c++)
            {
            new GridPosition( b, c, grid, 1.5, true );
            }
        }
    }


Map.selectGrid( SELECTED_GRID );

updateMenuValues( mapInfo );
};



Map.constructMap = function( mapInfo )
{
var mapDescription = mapInfo.mapDescription;

for (var a = 0 ; a < mapDescription.length ; a++)
    {
    var gridDescription = mapDescription[ a ];
    var gridPositions = GridPosition.getGrid( a );

        // so that we don't change the array in GridPosition, we get a new one (clone)
    var gridPositionsCopy = gridPositions.slice( 0 );

    for (var b = 0 ; b < gridDescription.length ; b++)
        {
        var tile = gridDescription[ b ];

            // find the GridPosition that corresponds to the column/line tile
        for (var c = 0 ; c < gridPositionsCopy.length ; c++)
            {
            var gridPosition = gridPositionsCopy[ c ];

            if ( gridPosition.column == tile.column && gridPosition.line == tile.line )
                {
                gridPosition.onClick( false );

                    // remove this GridPosition, since its already got an hit (so that the next search is faster)
                gridPositionsCopy.splice( c, 1 );
                break;
                }
            }
        }
    }
};




Map.selectGrid = function( gridPosition )
{
    // already selected
if ( gridPosition == SELECTED_GRID )
    {
    return;
    }

var a;
var previousGridPositions;
var allTiles = Map.getAllTiles();
var allGridPositions = GridPosition.getAll();

    // show all the tiles (but not the GridPosition)
if ( gridPosition < 0 )
    {
    previousGridPositions = GridPosition.getGrid( SELECTED_GRID );

            // hide previous grid
    for (a = 0 ; a < previousGridPositions.length ; a++)
        {
        previousGridPositions[ a ].hide();
        }

        // show all the tiles
        // add the tiles starting on the bottom grid, and going up (so that the z-index is correct (the tiles on top grids, are above the tiles on grids below))
    for (a = 0 ; a < allGridPositions.length ; a++)
        {
        var individualGrid = allGridPositions[ a ];

        for (var b = 0 ; b < individualGrid.length ; b++)
            {
            var gridPositionObject = individualGrid[ b ];

            if ( gridPositionObject.tileObject )
                {
                STAGE.addChild( gridPositionObject.tileObject.container );
                }
            }
        }


    $( '#Grids-currentGrid' ).text( 'All Grids.' );
    }

    // show only the selected GridPosition/Tile elements
else
    {
        // when previously wasn't any grid selected
    if ( SELECTED_GRID < 0 )
        {
            // hide all tiles
        for (a = 0 ; a < allTiles.length ; a++)
            {
            STAGE.removeChild( allTiles[ a ].container );
            }
        }

        // a grid was selected, and now we're choosing a different one
    else
        {
        previousGridPositions = GridPosition.getGrid( SELECTED_GRID );

            // hide previous grid
        for (var a = 0 ; a < previousGridPositions.length ; a++)
            {
            previousGridPositions[ a ].hide();
            }
        }

        // show next one
    var gridPositions = GridPosition.getGrid( gridPosition );

    for (a = 0 ; a < gridPositions.length ; a++)
        {
        gridPositions[ a ].show();
        }

    $( '#Grids-currentGrid' ).text( 'Selected Grid: ' + (gridPosition + 1) );
    }

SELECTED_GRID = gridPosition;
};


Map.save = function()
{
var mapName = document.querySelector( '#mapName' ).value;

var grid = Map.getGrid( 0 );
var allGrids = Map.getAllGrids();
var allTiles = Map.getAllTiles();

var numberOfColumns = grid.numberOfColumns;
var numberOfLines = grid.numberOfLines;

var mapDescription = [];

    // init mapDescription
for (var a = 0 ; a < allGrids.length ; a++)
    {
    mapDescription[ a ] = [];
    }


for (var a = 0 ; a < allTiles.length ; a++)
    {
    var tile = allTiles[ a ];

    var gridPosition = tile.gridObject.position;

    mapDescription[ gridPosition ].push({
            column : tile.column,
            line   : tile.line
        });
    }


var mapDefinition = {
    mapName         : mapName,
    numberOfColumns : numberOfColumns,
    numberOfLines   : numberOfLines,
    mapDescription  : mapDescription
    };

$.ajax({
    type  : 'post',
    url   : '/save_map/',
    async : false,
    data  : { data: JSON.stringify( mapDefinition ) },
    success: function( jqXHR, textStatus )
        {
        console.log( 'Saved Map' );
        },
    error: function( jqXHR, textStatus, errorThrown )
        {
        console.log( jqXHR, textStatus, errorThrown );
        }
    });
}


Map.load = function( mapName )
{
Map.clear();

    // try to load the latest map (that was loaded in the previous session)
if ( typeof mapName == 'undefined' )
    {
    var previousMap = localStorage.getItem( 'previousMap' );

    if ( previousMap !== null )
        {
        mapName = previousMap;
        }

    else
        {
        console.log( 'Invalid map name.' );
        return;
        }
    }

$.ajax({
    type  : 'post',
    url   : '/load_map/',
    async : false,
    data  : { mapName: mapName },
    dataType : 'json',

    success: function( jqXHR, textStatus )
        {
        var mapInfo = JSON.parse( jqXHR );

        Map.constructGrid( mapInfo );

        Map.constructMap( mapInfo );
        },

    error: function( jqXHR, textStatus, errorThrown )
        {
        console.log( jqXHR, textStatus, errorThrown );
        }
    });


localStorage.setItem( 'previousMap', mapName );
};




Map.addTile = function( args )
{
args.mapObject = Map;

var tile = new Tile( args );

ALL_TILES.push( tile );

tile.container.removeAllEventListeners( 'click' );

TILES_LEFT--;

return tile;
};


Map.removeTile = function( tileObject )
{
var position = ALL_TILES.indexOf( tileObject );

ALL_TILES.splice( position, 1 );

tileObject.remove();

TILES_LEFT++;
};



Map.addGrid = function( args )
{
var grid = new Grid( args.startingX, args.startingY, args.numberOfColumns, args.numberOfLines, ALL_GRIDS.length );

ALL_GRIDS.push( grid );

return grid;
};


Map.removeGrid = function( gridObject )
{
var position = ALL_GRIDS.indexOf( gridObject );

ALL_GRIDS.splice( position, 1 );
};



Map.getGrid = function( position )
{
return ALL_GRIDS[ position ];
};


Map.getAllGrids = function()
{
return ALL_GRIDS;
};


Map.getAllTiles = function()
{
return ALL_TILES;
};


Map.removeAllGrids = function()
{
ALL_GRIDS.length = 0;
};

Map.removeAllTiles = function()
{
for (var a = 0 ; a < ALL_TILES.length ; a++)
    {
    ALL_TILES[ a ].remove();
    }

ALL_TILES.length = 0;
};



Map.clear = function()
{
GridPosition.removeAll();
Map.removeAllGrids();

TILES_LEFT = 144;

document.querySelector( '#Grids-container' ).innerHTML = '';
};



Map.updateTilesLeft = function()
{
$( '#TilesLeft' ).text( 'Tiles Left: ' + TILES_LEFT );
};


window.Map = Map;

}(window));