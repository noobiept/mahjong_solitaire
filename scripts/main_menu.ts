import * as Game from './game.js';
import * as HighScore from './high_score.js';
import * as Utilities from './utilities.js';
import { MapInfo } from './map.js';


var MENU: HTMLElement;
var HIGH_SCORE: HTMLElement;

    // has the mapInfo of the maps (the .json loaded from /maps/)
var MAPS_AVAILABLE: MapInfo[] = [];
var SELECTED_MAP = 0;

    // has reference for the html elements used to select the map in the main menu
var MAPS_ELEMENTS: HTMLElement[] = [];


export function init( maps: MapInfo[] )
{
MENU = document.getElementById( 'MainMenu' )!;
HIGH_SCORE = document.getElementById( 'HighScore' )!;

var startGame = document.getElementById( 'MainMenu-startGame' )!;
var twoPlayers = document.getElementById( 'MainMenu-twoPlayers' )!;
var highScore = document.getElementById( 'MainMenu-highScore' )!;

startGame.onclick = function( event )
    {
    hide();
    Game.start( MAPS_AVAILABLE[ SELECTED_MAP ], false );

    event.stopPropagation();
    };

twoPlayers.onclick = function( event )
    {
    hide();
    Game.start( MAPS_AVAILABLE[ SELECTED_MAP ], true );

    event.stopPropagation();
    };

highScore.onclick = function( event )
    {
    hide();
    openHighScore();

    event.stopPropagation();
    };


var selectMapContainer = document.getElementById( 'MainMenu-selectMap' );

for (var a = 0 ; a < maps.length ; a++)
    {
    const capitalizedName = Utilities.capitalize( maps[ a ].mapName );

    var item = document.createElement( 'div' );
    item.className = 'button';
    item.innerText = capitalizedName;
    item.setAttribute( 'data-position', a );
    item.onclick = function()
        {
            // this points to the html element
        selectMap( parseInt( this.getAttribute( 'data-position' ), 10 ) );
        }

    selectMapContainer.appendChild( item );
    }

MAPS_AVAILABLE = maps;
MAPS_ELEMENTS = selectMapContainer.children;
}


export function open()
{
Game.resetStuff();

selectMap( SELECTED_MAP );

$( MENU ).css( 'display', 'flex' );
}


export function hide()
{
$( MENU ).css( 'display', 'none' );
}


export function openHighScore()
{
var table = document.getElementById( 'HighScore-table' )!;
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

var back = document.getElementById( 'HighScore-back' )!;

back.onclick = function()
    {
        // clear the table (since we're always using the same <table> element)
    $( table ).empty();

    $( HIGH_SCORE ).css( 'display', 'none' );

    open();
    };

$( HIGH_SCORE ).css( 'display', 'flex' );
}


export function selectMap( position: number )
{
$( MAPS_ELEMENTS[ SELECTED_MAP ] ).removeClass( 'mapSelected' );
$( MAPS_ELEMENTS[ position ] ).addClass( 'mapSelected' );

SELECTED_MAP = position;
}
