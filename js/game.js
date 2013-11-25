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

/*
    // mapDescription: each array (inside the main one) corresponds to a grid (and array of 'grids')
    // inside the grid array, we have several objects with the position where we'll put a tile

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
 */

Game.start = function( selectedMap )
{
if ( typeof selectedMap == 'undefined' )
    {
        // use the previous map -- assumes this isn't the first time its being called
    selectedMap = CURRENT_MAP;
    }

Game.resetStuff();

CURRENT_MAP = selectedMap;

MAP = new Map( selectedMap );

GameMenu.show();
$( CANVAS ).css( 'display', 'block' );

Game.updateInformation();
Game.startTimer();

createjs.Ticker.on( 'tick', tick );
};



Game.finished = function()
{
Game.resetStuff();

HighScore.add( CURRENT_MAP.mapName, TIME );

new Message({
        text: 'Map Cleared in ' + timeToString( TIME ),
        timeOut: 2000,
        timeOut_f: function()
            {
            MainMenu.open();
            }
    });
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

Tile.removeAll();
Grid.removeAll();
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