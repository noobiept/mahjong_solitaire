(function(window)
{
function GameMenu()
{

}

    // reference to html elements
var GAME_MENU_CONTAINER;
var TILES_LEFT;
var PAIRS_LEFT;

GameMenu.init = function()
{
var gameMenu = document.querySelector( '#GameMenu' );

var tilesLeft = gameMenu.querySelector( '#GameMenu-tilesLeft span' );
var pairsLeft = gameMenu.querySelector( '#GameMenu-pairsLeft span' );
var restart = gameMenu.querySelector( '#GameMenu-restart' );
var quit = gameMenu.querySelector( '#GameMenu-quit' );


restart.onclick = function()
    {
    startGame();
    };


quit.onclick = function()
    {
        //HERE
    };


var canvasPosition = $( CANVAS ).position();

var left = canvasPosition.left;
var top = canvasPosition.top + CANVAS.height;

    // position the game menu in the bottom of the canvas
$( gameMenu ).css( 'top', top + 'px' );
$( gameMenu ).css( 'left', left + 'px' );


GAME_MENU_CONTAINER = gameMenu;
TILES_LEFT = tilesLeft;
PAIRS_LEFT = pairsLeft;
};


GameMenu.show = function()
{
$( GAME_MENU_CONTAINER ).css( 'display', 'block' );
};


GameMenu.hide = function()
{
$( GAME_MENU_CONTAINER ).css( 'display', 'none' );
};


GameMenu.clear = function()
{

};



GameMenu.updateInformation = function( mapObject )
{
GameMenu.updateTilesLeft();
GameMenu.updatePairsLeft( mapObject );
};


GameMenu.updateTilesLeft = function()
{
$( TILES_LEFT ).text( Tile.getAll().length );
};


GameMenu.updatePairsLeft = function( mapObject )
{
$( PAIRS_LEFT ).text( mapObject.howManySelectablePairs() );
};


window.GameMenu = GameMenu;

}(window));