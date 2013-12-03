(function(window)
{
function Game()
{

}

    // current map information
var CURRENT_MAP;


    // has all the map objects (one for each player)
var MAPS = [];

    // when there's more than 1 player, means each player takes turns to play, this keeps track of what player/map is currently playing
var ACTIVE_MAP = 0;

    // whether we shadow the un-selectable tiles or not
var SHADOW_ON = false;

    // a message to tell which player turn is
    // only for 2 player mode
var PLAYER_TURN = null;

/**
    mapDescription:
        each array (inside the main one) corresponds to a grid (an array of 'grids')
        inside the grid array, we have several objects with the position where we'll put a tile

    selectedMap = {
        "mapName": "pyramid",
        "numberOfColumns": 20,
        "numberOfLines": 22,
        "mapDescription":
            [
                    // first grid
                [
                    { "column": 0, "line": 0 },
                    { "column": 18, "line": 0 },
                        // ...
                ],
                    // second grid
                [
                    { "column": 4, "line": 4 },
                        // ...
                ],
                    // ...
            ]
    }

    @param {Object=} selectedMap
    @param {Boolean=false} twoPlayers
 */

Game.start = function( selectedMap, twoPlayers )
{
if ( typeof selectedMap == 'undefined' )
    {
        // use the previous map -- assumes this isn't the first time its being called
    selectedMap = CURRENT_MAP;
    }

if ( twoPlayers !== true )
    {
    twoPlayers = false;
    }

Game.resetStuff();

CANVAS.width = $( window ).width();
CANVAS.height = $( window ).height() - $( '#GameMenu' ).height();
$( CANVAS ).css( 'display', 'block' );

CURRENT_MAP = selectedMap;


if ( twoPlayers )
    {
    MAPS.push( new Map( selectedMap, 'left', 1 ) );
    MAPS.push( new Map( selectedMap, 'right', 2 ) );

        // init the player turn message
    PLAYER_TURN = new createjs.Text( '', '30px monospace', 'white' );

    PLAYER_TURN.x = CANVAS.width / 2;
    PLAYER_TURN.y = CANVAS.height / 2;
    PLAYER_TURN.textAlign = 'center';

    STAGE.addChild( PLAYER_TURN );
    }

else
    {
    MAPS.push( new Map( selectedMap ) );
    }


GameMenu.show();

Game.updateInformation();

Game.setActiveMap( 0 );
};



Game.finished = function()
{
for (var a = 0 ; a < MAPS.length ; a++)
    {
    HighScore.add( CURRENT_MAP.mapName, MAPS[ a ].mapInformation.time );
    }

Game.resetStuff();


var endMessage = document.querySelector( '#Message' );

    // 1 player mode
if ( MAPS.length == 1 )
    {
    $( endMessage ).text( 'Map Cleared in ' + timeToString( MAPS[ 0 ].mapInformation.time ) );
    }

    // more than 1 player, need to determine who won
else
    {
        //HERE
    $( endMessage ).text( 'Map Cleared!' );
    }

$( endMessage ).css( 'display', 'block' );


window.setTimeout( function()
    {
    $( endMessage ).css( 'display', 'none' );

    MainMenu.open();
    }, 2000 );
};



Game.setActiveMap = function( position )
{
var previousMap = MAPS[ ACTIVE_MAP ];

previousMap.mapInformation.stopTimer();
previousMap.isCurrentActive = false;

ACTIVE_MAP = position;

MAPS[ position ].mapInformation.startTimer();
MAPS[ position ].isCurrentActive = true;

    // for 2 players mode only
if ( MAPS.length > 1 )
    {
    var playerName = MAPS[ position ].playerNumber;

    if ( playerName == 1 )
        {
        PLAYER_TURN.text = '<-- Player 1 Turn';
        }

    else
        {
        PLAYER_TURN.text = 'Player 2 Turn -->';
        }
    }
};


Game.changePlayer = function()
{
    // only 1 player
if ( MAPS.length == 1 )
    {
    return;
    }

var nextPlayer = ACTIVE_MAP + 1;

if ( nextPlayer >= MAPS.length )
    {
    nextPlayer = 0;
    }

Game.setActiveMap( nextPlayer );
};




Game.shadowTiles = function()
{
for (var a = 0 ; a < MAPS.length ; a++)
    {
    MAPS[ a ].shadowTiles();

    var selectedTile = MAPS[ a ].selected_tile;

        // calling .shadowTiles() above will change the background of the selected tile (if there's one), so we need to select again
    if ( selectedTile )
        {
        selectedTile.selectTile();
        }
    }
};


Game.unShadowTiles = function()
{
for (var a = 0 ; a < MAPS.length ; a++)
    {
    MAPS[ a ].unShadowTiles();

    var selectedTile = MAPS[ a ].selected_tile;

        // calling .unShadowTiles() above will change the background of the selected tile (if there's one), so we need to select again
    if ( selectedTile )
        {
        selectedTile.selectTile();
        }
    }
};


Game.updateInformation = function()
{
if ( SHADOW_ON )
    {
    for (var a = 0 ; a < MAPS.length ; a++)
        {
        MAPS[ a ].shadowTiles();
        }
    }
};




Game.resetStuff = function()
{
for (var a = 0 ; a < MAPS.length ; a++)
    {
    MAPS[ a ].clear();
    }

MAPS.length = 0;
ACTIVE_MAP = 0;

GameMenu.clear();
$( CANVAS ).css( 'display', 'none' );

STAGE.removeChild( PLAYER_TURN );
PLAYER_TURN = null;
};


Game.pause = function()
{
createjs.Ticker.setPaused( true );
};


Game.resume = function()
{
createjs.Ticker.setPaused( false );
};



Game.getShadowOption = function()
{
return SHADOW_ON;
};

Game.setShadowOption = function( value )
{
SHADOW_ON = value;
};

Game.getActiveMap = function()
{
return MAPS[ ACTIVE_MAP ];
};


window.Game = Game;

}(window));