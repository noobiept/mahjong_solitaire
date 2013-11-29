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
var MESSAGE;

    // the return of the window.setTimeout()
var MESSAGE_TIMEOUT = null;

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
    Game.updateInformation();
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


GAME_MENU_CONTAINER = gameMenu;
TILES_LEFT = tilesLeft;
PAIRS_LEFT = pairsLeft;
TIMER = timer;
MESSAGE = gameMenu.querySelector( '#GameMenu-message' );
};


GameMenu.show = function()
{
$( TIMER ).text( timeToString( 0 ) );

$( GAME_MENU_CONTAINER ).css( 'display', 'inline-flex' );
};


GameMenu.clear = function()
{
    // hide the html elements
$( GAME_MENU_CONTAINER ).css( 'display', 'none' );

    // cancel the message timeout, if its active
window.clearTimeout( MESSAGE_TIMEOUT );
MESSAGE_TIMEOUT = null;

$( MESSAGE ).text( '' );
};




GameMenu.updateInformation = function( mapObject )
{
if ( GameMenu.updateTilesLeft( mapObject ) <= 0 )
    {
    Game.finished();
    }

else
    {
    var pairsLeft = GameMenu.updatePairsLeft( mapObject );

    if ( pairsLeft <= 0 )
        {
        Game.getMap().shuffle();
        GameMenu.showMessage( 'No More Pairs Left (shuffling)' );
        Game.updateInformation();
        }
    }
};


GameMenu.updateTilesLeft = function( mapObject )
{
var tilesLeft = mapObject.all_tiles.length;

$( TILES_LEFT ).text( tilesLeft );

return tilesLeft;
};


GameMenu.updatePairsLeft = function( mapObject )
{
var pairsLeft = mapObject.howManySelectablePairs();

$( PAIRS_LEFT ).text( pairsLeft );

return pairsLeft;
};


GameMenu.updateTimer = function( time )
{
$( TIMER ).text( timeToString( time ) );
};


GameMenu.showMessage = function( text )
{
    // a timeout is active, from a previous call. cancel it
if ( MESSAGE_TIMEOUT !== null )
    {
    window.clearTimeout( MESSAGE_TIMEOUT );
    }

$( MESSAGE ).text( text );

MESSAGE_TIMEOUT = window.setTimeout( function()
    {
    $( MESSAGE ).text( '' );
    MESSAGE_TIMEOUT = null;

    }, 2000 );
};



window.GameMenu = GameMenu;

}(window));