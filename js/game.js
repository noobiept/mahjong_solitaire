/*global CANVAS, Map, createjs, STAGE, GameMenu, HighScore, Utilities, MainMenu*/
'use strict';


var Game;
(function(Game) {


    // current map information
var CURRENT_MAP;
var TWO_PLAYER_MODE;    // either 1 player or 2 player mode

    // has all the map objects (one for each player)
var MAPS = [];

    // when there's more than 1 player, means each player takes turns to play, this keeps track of what player/map is currently playing
var ACTIVE_MAP = 0;

    // whether we shadow the un-selectable tiles or not
var SHADOW_ON = false;

    // a message to tell which player turn is
    // only for 2 player mode
var PLAYER_TURN = null;

    // tell if the game finished or not
var GAME_FINISHED = false;

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

    @param {Object} selectedMap
    @param {Boolean} twoPlayers
 */
Game.start = function( selectedMap, twoPlayers )
{
Game.resetStuff();

TWO_PLAYER_MODE = twoPlayers;
GAME_FINISHED = false;  // can't have this on Game.resetStuff() (leads to an issue when finishing the game)
CURRENT_MAP = selectedMap;

$( CANVAS ).css( 'display', 'block' );

if ( twoPlayers )
    {
    MAPS.push( new Map( selectedMap, 1 ));
    MAPS.push( new Map( selectedMap, 2 ));

        // init the player turn message
    PLAYER_TURN = new createjs.Text( '', '30px monospace', 'red' );

        // position just above the menu, in the left or right side of the window (depending on which turn it is)
    PLAYER_TURN.y = height - 32; // the 32 (30px + a bit of margin) depends on the font-size specified above when creating the Text()
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
Game.resize();
};


/**
 * Restart the game in the same map and same player mode as before.
 * Assumes `Game.start()` was already called at one point.
 */
Game.restart = function()
{
Game.start( CURRENT_MAP, TWO_PLAYER_MODE );
};


Game.finished = function()
{
var a;

    // confirm that all players have finished the game, otherwise return and wait until the last player finish to proceed
for (a = 0 ; a < MAPS.length ; a++)
    {
        // see if there's still tiles left
    if ( MAPS[ a ].all_tiles.length > 0 )
        {
        return;
        }
    }

GAME_FINISHED = true;

for (a = 0 ; a < MAPS.length ; a++)
    {
    HighScore.add( CURRENT_MAP.mapName, MAPS[ a ].score );
    }


var endMessage = document.querySelector( '#Message' );

    // 1 player mode
if ( MAPS.length === 1 )
    {
    $( endMessage ).text( 'Map Cleared! Score: ' + MAPS[ 0 ].score );
    }

    // more than 1 player, need to determine who won
else
    {
    var playerOneScore = MAPS[ 0 ].score;
    var playerTwoScore = MAPS[ 1 ].score;

    if ( playerOneScore < playerTwoScore )
        {
        $( endMessage ).text( 'Player 1 Wins! Score: ' + playerOneScore );
        }

    else if ( playerTwoScore < playerOneScore )
        {
        $( endMessage ).text( 'Player 2 Wins! Score: ' + playerTwoScore );
        }

    else
        {
        $( endMessage ).text( 'Its a Draw! Score: ' + playerOneScore );
        }
    }

Game.resetStuff();

$( endMessage ).css( 'display', 'block' );

window.setTimeout( function()
    {
    $( endMessage ).css( 'display', 'none' );

    MainMenu.open();
    }, 2500 );
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

    if ( playerName === 1 )
        {
            // position centered in the left side of the map
        PLAYER_TURN.x = CANVAS.width / 4;
        PLAYER_TURN.text = 'Player 1 Turn';
        }

    else
        {
            // centered in the right side of the map
        PLAYER_TURN.x = CANVAS.width * 3 / 4;
        PLAYER_TURN.text = 'Player 2 Turn';
        }
    }
};


Game.changePlayer = function()
{
    // only 1 player
if ( MAPS.length <= 1 )
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


Game.highlightRandomPair = function()
{
Game.getActiveMap().highlightRandomPair();
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


Game.hasEnded = function()
{
return GAME_FINISHED;
};


Game.resize = function()
{
if ( MAPS.length === 1 )
    {
    var width = $( window ).outerWidth( true );
    var height = $( window ).outerHeight( true ) - $( '#GameMenu' ).outerHeight( true );

    CANVAS.width = width;
    CANVAS.height = height;

    MAPS[ 0 ].scaleMap({
            x: 0,
            y: 0,
            width: width,
            height: height
        });
    }
};


})(Game || (Game = {}));
