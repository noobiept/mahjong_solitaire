(function(window)
{
function Game()
{

}

var CURRENT_MAP_NAME;
var CURRENT_MAP_DESCRIPTION;

var TIME;           // time passed in milliseconds
var TIMER_F;        // return of window.setInterval()



Game.start = function( selectedMap )
{
if ( typeof selectedMap == 'undefined' )
    {
        // use the previous map -- assumes this isn't the first time its being called //HERE
    selectedMap = {
            mapName        : CURRENT_MAP_NAME,
            mapDescription : CURRENT_MAP_DESCRIPTION
        };
    }

Game.resetStuff();

GameMenu.show();

CURRENT_MAP_NAME = selectedMap.mapName;
CURRENT_MAP_DESCRIPTION = selectedMap.mapDescription;

MAP = new Map( selectedMap.mapDescription );   //HERE have the MAP be part of 'Game'

Game.startTimer();

createjs.Ticker.on( 'tick', tick );
};



Game.finished = function()
{
Game.resetStuff();

HighScore.add( CURRENT_MAP_NAME, TIME );

new Message({
        text: 'Map Cleared',
        timeOut: 1000,
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




Game.resetStuff = function()
{
window.clearInterval( TIMER_F );

Tile.removeAll();
Grid.removeAll();
MAP = null;

GameMenu.hide();
};


Game.pause = function()
{
createjs.Ticker.setPaused( true );
};


Game.resume = function()
{
createjs.Ticker.setPaused( false );
};


window.Game = Game;

}(window));