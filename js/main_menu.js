/*global Game, HighScore*/
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


MainMenu.init = function( maps )
{
MENU = document.querySelector( '#MainMenu' );
HIGH_SCORE = document.querySelector( '#HighScore' );

var startGame = MENU.querySelector( '#MainMenu-startGame' );
var twoPlayers = MENU.querySelector( '#MainMenu-twoPlayers' );
var highScore = MENU.querySelector( '#MainMenu-highScore' );


startGame.onclick = function( event )
    {
    MainMenu.hide();
    Game.start( MAPS_AVAILABLE[ SELECTED_MAP ].info, false );

    event.stopPropagation();
    };

twoPlayers.onclick = function( event )
    {
    MainMenu.hide();
    Game.start( MAPS_AVAILABLE[ SELECTED_MAP ].info, true );

    event.stopPropagation();
    };

highScore.onclick = function( event )
    {
    MainMenu.hide();
    MainMenu.openHighScore();

    event.stopPropagation();
    };


var selectMapContainer = document.getElementById( 'MainMenu-selectMap' );

for (var a = 0 ; a < maps.length ; a++)
    {
    var item = document.createElement( 'div' );
    item.className = 'button';
    item.innerText = maps[ a ].name;
    item.setAttribute( 'data-position', a );
    item.onclick = function()
        {
            // this points to the html element
        MainMenu.selectMap( parseInt( this.getAttribute( 'data-position' ), 10 ) );
        }

    selectMapContainer.appendChild( item );
    }

MAPS_AVAILABLE = maps;
MAPS_ELEMENTS = selectMapContainer.children;
};


MainMenu.open = function()
{
Game.resetStuff();

MainMenu.selectMap( SELECTED_MAP );

$( MENU ).css( 'display', 'flex' );
};


MainMenu.hide = function()
{
$( MENU ).css( 'display', 'none' );
};


MainMenu.openHighScore = function()
{
var table = HIGH_SCORE.querySelector( '#HighScore-table' );
var scores = HighScore.getAll();
var keys = Object.keys( scores );

if ( keys.length === 0 )
    {
    table.innerHTML = 'No Score Yet.';
    }

    // fill the table with the scores
else
    {
        // header
    var tableRow = document.createElement( 'tr' );
    var headers = [ '' ].concat( keys );
    var tableHeader;
    var a, b;
    var positionElement, scoreElement;
    var score;
    var mapScoreList;
    var maxScores = HighScore.getMaxScoresSaved();

    for (a = 0 ; a < headers.length ; a++)
        {
        tableHeader = document.createElement( 'th' );

        $( tableHeader ).text( headers[ a ] );
        tableRow.appendChild( tableHeader );
        }

    table.appendChild( tableRow );


    for (a = 0 ; a < maxScores ; a++)
        {
        tableRow = document.createElement( 'tr' );
        positionElement = document.createElement( 'td' );

        positionElement.innerHTML = a + 1;
        tableRow.appendChild( positionElement );

        for (b = 0 ; b < keys.length ; b++)
            {
            mapScoreList = scores[ keys[ b ] ];
            score = mapScoreList[ a ];
            scoreElement = document.createElement( 'td' );

            if ( !score )
                {
                scoreElement.innerHTML = '-';
                }

            else
                {
                scoreElement.innerHTML = score;
                }

            tableRow.appendChild( scoreElement );
            }

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

$( HIGH_SCORE ).css( 'display', 'flex' );
};


MainMenu.selectMap = function( position )
{
$( MAPS_ELEMENTS[ SELECTED_MAP ] ).removeClass( 'mapSelected' );
$( MAPS_ELEMENTS[ position ] ).addClass( 'mapSelected' );

SELECTED_MAP = position;
};


})(MainMenu || (MainMenu = {}));
