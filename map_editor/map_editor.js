
var CANVAS;
var STAGE;
var PRELOAD;

window.onload = function()
{
CANVAS = document.querySelector( '#canvas' );

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
var columns = 25;
var lines = 25;

var grid = new Grid( 20, 20, columns, lines );

var element = new GridPosition( 2, 2, grid );
};


