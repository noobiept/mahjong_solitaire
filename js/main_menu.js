(function(window)
{
function MainMenu()
{

}

var MENU;
var HIGH_SCORE;

var MAPS_AVAILABLE = [];
var SELECTED_MAP = 0;


MainMenu.init = function()
{
MENU = document.querySelector( '#MainMenu' );
HIGH_SCORE = document.querySelector( '#HighScore' );

var startGame = MENU.querySelector( '#MainMenu-startGame' );
var highScore = MENU.querySelector( '#MainMenu-highScore' );


startGame.onclick = function( event )
    {
    MainMenu.hide();

    Game.start( MAPS_AVAILABLE[ SELECTED_MAP ] );

    event.stopPropagation();
    };

highScore.onclick = function( event )
    {
    MainMenu.hide();

    MainMenu.openHighScore();

    event.stopPropagation();
    };

centerElement( MENU );
};


/*
    add to the array the maps loaded from the preloadjs (only done once in the load of the game)
 */

MainMenu.addMaps = function( maps )
{
MAPS_AVAILABLE = maps;
};



MainMenu.open = function()
{
Game.resetStuff();

$( MENU ).css( 'display', 'block' );
};



MainMenu.hide = function()
{
$( MENU ).css( 'display', 'none' );
};



MainMenu.openHighScore = function()
{
var table = HIGH_SCORE.querySelector( '#HighScore-table' );

var mapName = MAPS_AVAILABLE[ SELECTED_MAP ].mapName;

    // set the title
var title = HIGH_SCORE.querySelector( '#HighScore-title' );

$( title ).text( 'High Score (' + mapName + ')' );


    // get the scores of the selected map
var mapScores = HighScore.get( mapName );


if ( !mapScores || mapScores.length == 0 )
    {
    table.innerHTML = 'No Score Yet.';
    }

    // fill the table with the scores
else
    {
        // header
    var tableRow = document.createElement( 'tr' );

    var header = [ 'Position', 'Time' ];

    var tableHeader;

    for (var a = 0 ; a < header.length ; a++)
        {
        tableHeader = document.createElement( 'th' );

        $( tableHeader ).text( header[ a ] );
        tableRow.appendChild( tableHeader );
        }

    table.appendChild( tableRow );


    var position, time;

    for (var a = 0 ; a < mapScores.length ; a++)
        {
        tableRow = document.createElement( 'tr' );
        position = document.createElement( 'td' );
        time = document.createElement( 'td' );

        $( position ).text( a + 1 );
        $( time ).text( timeToString( mapScores[ a ] ) );

        tableRow.appendChild( position );
        tableRow.appendChild( time );

        table.appendChild( tableRow );
        }
    }


var back = HIGH_SCORE.querySelector( '#HighScore-back' );

back.onclick = function()
    {
        // clear the table (since we're always using the same <table> element)
    $( table ).empty();

    $( HIGH_SCORE ).css( 'display', 'none' );

    MainMenu.open();
    };

$( HIGH_SCORE ).css( 'display', 'block' );

centerElement( HIGH_SCORE );
};



window.MainMenu = MainMenu;

}(window));