
var CANVAS;
var STAGE;
var PRELOAD;


var SELECTED_GRID = 0;


window.onload = function()
{
CANVAS = document.querySelector( '#canvas' );

CANVAS.width = 700;
CANVAS.height = 700;

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

var startingX = 100;
var startingY = 0;


var gridsContainer = document.querySelector( '#Grids-container' );


for (var a = 0 ; a < numberOfGrids ; a++)
    {
    new Grid( startingX, startingY, columns, lines );

    var gridElement = document.createElement( 'div' );

    $( gridElement ).text( a + 1 );

    gridElement.onclick = function()
        {
        var newGrid = parseInt( $( this ).text() ) - 1;

        $( '#Grids-currentGrid' ).text( 'Selected Grid: ' + (newGrid + 1) );

        selectGrid( newGrid );
        };

    gridsContainer.appendChild( gridElement );

    startingX -= 6;
    startingY += 6;
    }



$( '#Grids-currentGrid' ).text( 'Selected Grid: ' + (SELECTED_GRID + 1) );


for (var a = 0 ; a < numberOfGrids ; a++)
    {
    var grid = Grid.get( a );

    for (var b = 0 ; b < columns ; b++)
        {
        for (var c = 0 ; c < lines ; c++)
            {
            new GridPosition( b, c, grid, 2, true );
            }
        }
    }


selectGrid( SELECTED_GRID );
};


function selectGrid( gridPosition )
{
var previousGridPositions = GridPosition.getAll( SELECTED_GRID );

    // hide previous grid
for (var a = 0 ; a < previousGridPositions.length ; a++)
    {
    previousGridPositions[ a ].hide();
    }


    // show next one
var gridPositions = GridPosition.getAll( gridPosition );

for (var a = 0 ; a < gridPositions.length ; a++)
    {
    gridPositions[ a ].show();
    }

SELECTED_GRID = gridPosition;
}