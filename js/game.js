(function(window)
{
function Game()
{

}

var CURRENT_MAP_DESCRIPTION;
var CURRENT_MAP;

var TIME;           // time passed in milliseconds
var TIMER_F;        // return of window.setInterval()

var MAP;


Game.start = function( selectedMap )
{
if ( typeof selectedMap == 'undefined' )
    {
        // use the previous map -- assumes this isn't the first time its being called
    selectedMap = CURRENT_MAP;
    }

Game.resetStuff();

GameMenu.show();

CURRENT_MAP = selectedMap;

MAP = new Map( selectedMap );

Game.startTimer();

createjs.Ticker.on( 'tick', tick );
};



Game.finished = function()
{
Game.resetStuff();

HighScore.add( CURRENT_MAP.mapName, TIME );

new Message({
        text: 'Map Cleared in ' + timeToString( TIME ),
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


Game.getMap = function()
{
return MAP;
};



window.Game = Game;

}(window));