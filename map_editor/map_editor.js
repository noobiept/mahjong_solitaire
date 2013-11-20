/*
    to doo:

        - i have to add +1 column otherwise when adding a tile to the last column it gives an error...
 */

var CANVAS;
var STAGE;
var PRELOAD;


    // current selected grid (0+), or -1 is none is selected (when its showing the whole map)
var SELECTED_GRID = -1;

var TILES_LEFT = 144;


window.onload = function()
{
CANVAS = document.querySelector( '#canvas' );

CANVAS.width = 1000;
CANVAS.height = 800;

STAGE = new createjs.Stage( CANVAS );

createjs.Ticker.addEventListener('tick', function()
    {
    STAGE.update();
    });


document.querySelector( '#saveMap' ).onclick = saveMap;
document.querySelector( '#loadMap' ).onclick = function()
    {
    var mapName = document.querySelector( '#mapName' ).value;

    loadMap( mapName );
    };

document.querySelector( '#Grids-seeAll').onclick = function()
    {
    selectGrid( -1 );
    };


document.querySelector( '#newMap' ).onclick = function()
    {
    var numberOfGrids = document.querySelector( '#grids' ).value;
    var numberOfColumns = document.querySelector( '#columns' ).value;
    var numberOfLines = document.querySelector( '#lines' ).value;

    clearMap();

    constructGrid({
            numberOfColumns: parseInt( numberOfColumns ),
            numberOfLines: parseInt( numberOfLines ),
            numberOfGrids: parseInt( numberOfGrids ),
            mapName: ''
        });
    };


PRELOAD = new createjs.LoadQueue();

var manifest = [
        { id: 'bamboo1', src: '/static/images/bamboo1.png' }
    ];

PRELOAD.loadManifest( manifest, true );

PRELOAD.addEventListener( 'complete', function()
    {
    loadMap();
    });
};


function constructGrid( mapInfo )
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


var gridsContainer = document.querySelector( '#Grids-container' );

for (var a = 0 ; a < numberOfGrids ; a++)
    {
    new Grid( startingX, startingY, columns + 1, lines );

    var gridElement = document.createElement( 'div' );

    $( gridElement ).text( a + 1 );

    gridElement.onclick = function()
        {
        var newGrid = parseInt( $( this ).text() ) - 1;

        selectGrid( newGrid );
        };

    gridsContainer.appendChild( gridElement );

    startingX -= 6;
    startingY += 6;
    }


    // no grid selected initially
SELECTED_GRID = -1;


for (var a = 0 ; a < numberOfGrids ; a++)
    {
    var grid = Grid.get( a );

    for (var b = 0 ; b < columns ; b++)
        {
        for (var c = 0 ; c < lines ; c++)
            {
            new GridPosition( b, c, grid, 1.5, true );
            }
        }
    }


selectGrid( SELECTED_GRID );

updateMenuValues( mapInfo );
}



function constructMap( mapInfo )
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
                gridPosition.onClick();

                    // remove this GridPosition, since its already got an hit (so that the next search is faster)
                gridPositionsCopy.splice( c, 1 );
                break;
                }
            }
        }
    }
}




function selectGrid( gridPosition )
{
    // already selected
if ( gridPosition == SELECTED_GRID )
    {
    return;
    }

var a;
var previousGridPositions;
var allTiles = Tile.getAll();
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
}

/*
    the number of grids/columns/lines value in the menu's input element
 */

function updateMenuValues( mapInfo )
{
var allGrids = Grid.getAll();

var numberOfGrids = allGrids.length;

    // all grids have the same number of columns/lines, so we only need to check the numbers of one
var grid = Grid.get( 0 );

var numberOfColumns = grid.numberOfColumns;
var numberOfLines = grid.numberOfLines;

document.querySelector( '#grids' ).value = numberOfGrids;
document.querySelector( '#columns' ).value = numberOfColumns;
document.querySelector( '#lines' ).value = numberOfLines;
document.querySelector( '#mapName' ).value = mapInfo.mapName;

updateTilesLeft();
}


function updateTilesLeft()
{
$( '#TilesLeft' ).text( 'Tiles Left: ' + TILES_LEFT );
}



function saveMap()
{
var mapName = document.querySelector( '#mapName' ).value;

var allGrids = Grid.getAll();
var grid = Grid.get( 0 );

var numberOfColumns = grid.numberOfColumns;
var numberOfLines = grid.numberOfLines;

var allTiles = Tile.getAll();
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


function loadMap( mapName )
{
clearMap();

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

        constructGrid( mapInfo );

        constructMap( mapInfo );
        },

    error: function( jqXHR, textStatus, errorThrown )
        {
        console.log( jqXHR, textStatus, errorThrown );
        }
    });


localStorage.setItem( 'previousMap', mapName );
}



function clearMap()
{
GridPosition.removeAll();
Grid.removeAll();

TILES_LEFT = 144;

document.querySelector( '#Grids-container' ).innerHTML = '';
}





/*
 * For jquery ajax to work (server only)
 */

jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
