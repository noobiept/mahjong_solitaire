/*global Game, HighScore, Utilities*/
'use strict';

var MainMenu;
(function(MainMenu) {


var MENU;
var HIGH_SCORE;

    // has the mapInfo of the maps (the .json loaded from /maps/)
var MAPS_AVAILABLE = [];
var SELECTED_MAP = 0;

    // has reference for the html elements used to select the map in the main menu
var MAPS_ELEMENTS = [];


MainMenu.init = function()
{
MENU = document.querySelector( '#MainMenu' );
HIGH_SCORE = document.querySelector( '#HighScore' );

var startGame = MENU.querySelector( '#MainMenu-startGame' );
var twoPlayers = MENU.querySelector( '#MainMenu-twoPlayers' );
var highScore = MENU.querySelector( '#MainMenu-highScore' );


startGame.onclick = function( event )
    {
    MainMenu.hide();

    Game.start( MAPS_AVAILABLE[ SELECTED_MAP ], false );

    event.stopPropagation();
    };

twoPlayers.onclick = function( event )
    {
    MainMenu.hide();

    Game.start( MAPS_AVAILABLE[ SELECTED_MAP ], true );

    event.stopPropagation();
    };

highScore.onclick = function( event )
    {
    MainMenu.hide();

    MainMenu.openHighScore();

    event.stopPropagation();
    };


var selectMapContainer = MENU.querySelector( '#MainMenu-selectMap' );

var maps = selectMapContainer.getElementsByTagName( 'div' );

for (var a = 0 ; a < maps.length ; a++)
    {
    maps[ a ].mapPosition = a;

    maps[ a ].onclick = function()
        {
            // this points to the html element
        MainMenu.selectMap( this.mapPosition );
        }
    }

MAPS_ELEMENTS = maps;
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

MainMenu.selectMap( SELECTED_MAP );

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


if ( !mapScores || mapScores.length === 0 )
    {
    table.innerHTML = 'No Score Yet.';
    }

    // fill the table with the scores
else
    {
        // header
    var tableRow = document.createElement( 'tr' );
    var header = [ '', 'Score' ];
    var tableHeader;
    var a;

    for (a = 0 ; a < header.length ; a++)
        {
        tableHeader = document.createElement( 'th' );

        $( tableHeader ).text( header[ a ] );
        tableRow.appendChild( tableHeader );
        }

    table.appendChild( tableRow );


    var position, score;

    for (a = 0 ; a < mapScores.length ; a++)
        {
        tableRow = document.createElement( 'tr' );
        position = document.createElement( 'td' );
        score = document.createElement( 'td' );

        $( position ).text( a + 1 );
        $( score ).text( mapScores[ a ] );

        tableRow.appendChild( position );
        tableRow.appendChild( score );

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
};


MainMenu.selectMap = function( position )
{
$( MAPS_ELEMENTS[ SELECTED_MAP ] ).removeClass( 'mapSelected' );
$( MAPS_ELEMENTS[ position ] ).addClass( 'mapSelected' );

SELECTED_MAP = position;
};


})(MainMenu || (MainMenu = {}));
