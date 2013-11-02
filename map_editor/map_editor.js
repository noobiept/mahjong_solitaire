
var CANVAS;
var STAGE;
var PRELOAD;


var SELECTED_GRID = 0;


window.onload = function()
{
CANVAS = document.querySelector( '#canvas' );

CANVAS.width = 800;
CANVAS.height = 600;

STAGE = new createjs.Stage( CANVAS );

createjs.Ticker.addEventListener('tick', function()
    {
    STAGE.update();
    });


PRELOAD = new createjs.LoadQueue();

var manifest = [
    { id: 'bamboo1', src: '/static/images/bamboo1.png' }
    ];

PRELOAD.loadManifest( manifest, true );


var numberOfGrids = 7;
var columns = 11;
var lines = 11;

var startingX = 10;
var startingY = 10;


var gridsContainer = document.querySelector( '#Grids-container' );


for (var a = 0 ; a < numberOfGrids ; a++)
    {
    new Grid( startingX, startingY, columns, lines );

    var gridElement = document.createElement( 'div' );

    $( gridElement ).text( a + 1 );

    gridElement.onclick = function()
        {
        SELECTED_GRID = parseInt( $( this ).text() ) - 1;

        $( '#Grids-currentGrid' ).text( 'Selected Grid: ' + (SELECTED_GRID + 1) );
        };

    gridsContainer.appendChild( gridElement );

    startingX -= 6;
    startingY += 6;
    }


var grid = Grid.get( SELECTED_GRID );

$( '#Grids-currentGrid' ).text( 'Selected Grid: ' + (SELECTED_GRID + 1) );

for (var a = 0 ; a < columns ; a++)
    {
    for (var b = 0 ; b < lines ; b++)
        {
        new GridPosition( a, b, grid, 2 );
        }
    }
};


