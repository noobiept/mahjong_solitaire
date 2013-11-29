(function(window)
{
function Game()
{

}

var CURRENT_MAP;

var TIME;           // time passed in milliseconds
var TIMER_F;        // return of window.setInterval()

var MAP;

    // whether we shadow the un-selectable tiles or not
var SHADOW_ON = false;

/**
    mapDescription:
        each array (inside the main one) corresponds to a grid (an array of 'grids')
        inside the grid array, we have several objects with the position where we'll put a tile

    selectedMap = {
        "mapName": "pyramid",
        "numberOfColumns": 20,
        "numberOfLines": 22,
        "mapDescription":
            [
                    // first grid
                [
                    { "column": 0, "line": 0 },
                    { "column": 18, "line": 0 },
                        // ...
                ],
                    // second grid
                [
                    { "column": 4, "line": 4 },
                        // ...
                ],
                    // ...
            ]
    }

    @param {Object} selectedMap
    @param {Boolean=false} twoPlayers
 */

Game.start = function( selectedMap, twoPlayers )
{
if ( typeof selectedMap == 'undefined' )
    {
        // use the previous map -- assumes this isn't the first time its being called
    selectedMap = CURRENT_MAP;
    }

if ( twoPlayers !== true )
    {
    twoPlayers = false;
    }

Game.resetStuff();

CANVAS.width = $( window ).width();
CANVAS.height = $( window ).height() - $( '#GameMenu' ).height();
$( CANVAS ).css( 'display', 'block' );

CURRENT_MAP = selectedMap;

MAP = new Map( selectedMap );

GameMenu.show();


Game.updateInformation();
Game.startTimer();
};



Game.finished = function()
{
Game.resetStuff();

HighScore.add( CURRENT_MAP.mapName, TIME );

var endMessage = document.querySelector( '#Message' );

$( endMessage ).text( 'Map Cleared in ' + timeToString( TIME ) );
$( endMessage ).css( 'display', 'block' );


window.setTimeout( function()
    {
    $( endMessage ).css( 'display', 'none' );

    MainMenu.open();
    }, 2000 );
};



Game.startTimer = function()
{
var interval = 500;
TIME = 0;

TIMER_F = window.setInterval( function()
    {
    TIME += interval;

    GameMenu.updateTimer( TIME );

    }, interval );
};


Game.shadowTiles = function()
{
MAP.shadowTiles();

var selectedTile = Tile.getSelectedTile();

    // calling .shadowTiles() above will change the background of the selected tile (if there's one), so we need to select again
if ( selectedTile )
    {
    selectedTile.selectTile();
    }
};


Game.unShadowTiles = function()
{
MAP.unShadowTiles();

var selectedTile = Tile.getSelectedTile();

    // calling .unShadowTiles() above will change the background of the selected tile (if there's one), so we need to select again
if ( selectedTile )
    {
    selectedTile.selectTile();
    }
};


Game.updateInformation = function()
{
if ( SHADOW_ON )
    {
    MAP.shadowTiles();
    }
};


Game.resetStuff = function()
{
window.clearInterval( TIMER_F );

if ( MAP )
    {
    MAP.clear();
    }

MAP = null;

GameMenu.clear();
$( CANVAS ).css( 'display', 'none' );
};


Game.pause = function()
{
createjs.Ticker.setPaused( true );
};


Game.resume = function()
{
createjs.Ticker.setPaused( false );
};


Game.getMap = function()
{
return MAP;
};


Game.getShadowOption = function()
{
return SHADOW_ON;
};

Game.setShadowOption = function( value )
{
SHADOW_ON = value;
};


window.Game = Game;

}(window));