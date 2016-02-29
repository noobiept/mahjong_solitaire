/*global Utilities, Game, MainMenu, GameMenu*/
'use strict';


function MapInformation( mapObject, playerNumber )
{
if ( typeof playerNumber === 'undefined' )
    {
    playerNumber = 1;
    }

    // add the html elements to the game menu
var player = document.createElement( 'div' );
var tilesLeft = document.createElement( 'div' );
var pairsLeft = document.createElement( 'div' );
var score = document.createElement( 'div' );
var container = document.createElement( 'div' );

$( player ).text( 'Player ' + playerNumber );
$( tilesLeft ).text( 'Tiles Left: ' );
$( pairsLeft ).text( 'Pairs Left: ' );
$( score ).text( 'Score: ' );

var tilesLeftValue = document.createElement( 'span' );
var pairsLeftValue = document.createElement( 'span' );
var scoreValue = document.createElement( 'span' );

tilesLeft.appendChild( tilesLeftValue );
pairsLeft.appendChild( pairsLeftValue );
score.appendChild( scoreValue );

container.className = 'GameMenu-infoContainer';
player.className = 'MapInformation-playerNumber';
tilesLeft.className = 'MapInformation-tilesLeft';
pairsLeft.className = 'MapInformation-pairsLeft';
score.className = 'MapInformation-timer';

container.appendChild( player );
container.appendChild( tilesLeft );
container.appendChild( pairsLeft );
container.appendChild( score );

var mainContainer = document.querySelector( '#GameMenu-MapInformation' );

mainContainer.appendChild( container );

this.tilesLeft_ui = tilesLeftValue;
this.pairsLeft_ui = pairsLeftValue;
this.score_ui = scoreValue;
this.container_ui = container;
this.timesUpdateWasCalled = 0;
this.mapObject = mapObject;

this.updateScore( 0 );
}


MapInformation.prototype.startTimer = function()
{
var _this = this;

this.interval_f = window.setInterval( function()
    {
    _this.mapObject.addTimerScore();

    }, 1000 );
};


MapInformation.prototype.stopTimer = function()
{
window.clearInterval( this.interval_f );
};


MapInformation.prototype.updateScore = function( score )
{
$( this.score_ui ).text( score );
};


MapInformation.prototype.updateTilesLeft = function()
{
var tilesLeft = this.mapObject.all_tiles.length;

$( this.tilesLeft_ui ).text( tilesLeft );

return tilesLeft;
};


MapInformation.prototype.updatePairsLeft = function()
{
var pairsLeft = this.mapObject.howManySelectablePairs();

$( this.pairsLeft_ui ).text( pairsLeft );

return pairsLeft;
};


MapInformation.prototype.update = function()
{
if ( this.updateTilesLeft() <= 0 )
    {
    Game.finished();
    }

else
    {
    var pairsLeft = this.updatePairsLeft();

    if ( pairsLeft <= 0 )
        {
        this.timesUpdateWasCalled++;

            // we're in an endless recursion, due to not being possible to get a valid map with pairs left (after .shuffle() is called)
            // end the game
        if (this.timesUpdateWasCalled > 1)
            {
            Message.show( 'No More Possible Plays' );
            Game.resetStuff();

            window.setTimeout( function()
                {
                Message.hide();
                MainMenu.open();
                }, 2500 );

            return;
            }

        Game.getActiveMap().shuffle();
        GameMenu.showMessage( 'No More Pairs Left (shuffling)' );
        Game.updateInformation();
        }
    }
};


MapInformation.prototype.clear = function()
{
this.stopTimer();

var mainContainer = document.querySelector( '#GameMenu-MapInformation' );


mainContainer.removeChild( this.container_ui );
};
