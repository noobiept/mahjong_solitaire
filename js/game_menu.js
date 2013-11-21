(function(window)
{
function GameMenu()
{

}

    // reference to html elements
var GAME_MENU_CONTAINER;
var TILES_LEFT;
var PAIRS_LEFT;
var TIMER;


GameMenu.init = function()
{
var gameMenu = document.querySelector( '#GameMenu' );

var tilesLeft = gameMenu.querySelector( '#GameMenu-tilesLeft span' );
var pairsLeft = gameMenu.querySelector( '#GameMenu-pairsLeft span' );
var timer = gameMenu.querySelector( '#GameMenu-timer span' );

var shuffle = gameMenu.querySelector( '#GameMenu-shuffle' );
var shadow = document.querySelector( '#GameMenu-shadow' );
var shadowValue = shadow.querySelector( 'span' );
var restart = gameMenu.querySelector( '#GameMenu-restart' );
var quit = gameMenu.querySelector( '#GameMenu-quit' );


shuffle.onclick = function()
    {
    Game.getMap().shuffle();
    };

shadow.onclick = function()
    {
    var shadowOn = Game.getShadowOption();

    if ( shadowOn )
        {
        Game.setShadowOption( false );

        Game.unShadowTiles();

        $( shadowValue ).text( 'Off' );
        }

    else
        {
        Game.setShadowOption( true );

        Game.shadowTiles();

        $( shadowValue ).text( 'On' );
        }
    };


restart.onclick = function()
    {
    Game.start();
    };


quit.onclick = function()
    {
    MainMenu.open();
    };

$( timer ).text( timeToString( 0 ) );


var canvasPosition = $( CANVAS ).position();

var left = canvasPosition.left;
var top = canvasPosition.top + CANVAS.height;

    // position the game menu in the bottom of the canvas
$( gameMenu ).css( 'top', top + 'px' );
$( gameMenu ).css( 'left', left + 'px' );


GAME_MENU_CONTAINER = gameMenu;
TILES_LEFT = tilesLeft;
PAIRS_LEFT = pairsLeft;
TIMER = timer;
};


GameMenu.show = function()
{
$( TIMER ).text( timeToString( 0 ) );

$( GAME_MENU_CONTAINER ).css( 'display', 'block' );
};


GameMenu.hide = function()
{
$( GAME_MENU_CONTAINER ).css( 'display', 'none' );
};




GameMenu.updateInformation = function( mapObject )
{
if ( GameMenu.updateTilesLeft() <= 0 )
    {
    Game.finished();
    }

else
    {
    GameMenu.updatePairsLeft( mapObject );
    }
};


GameMenu.updateTilesLeft = function()
{
var tilesLeft = Tile.getAll().length;

$( TILES_LEFT ).text( tilesLeft );

return tilesLeft;
};


GameMenu.updatePairsLeft = function( mapObject )
{
$( PAIRS_LEFT ).text( mapObject.howManySelectablePairs() );
};


GameMenu.updateTimer = function( time )
{
$( TIMER ).text( timeToString( time ) );
};



window.GameMenu = GameMenu;

}(window));