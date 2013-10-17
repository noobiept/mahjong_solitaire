(function(window)
{
function Game()
{

}

Game.start = function( selectedMap )
{
Game.resetStuff();

GameMenu.show();

MAP = new Map( selectedMap );

createjs.Ticker.on( 'tick', tick );
};


Game.resetStuff = function()
{
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