(function(window)
{
function MapInformation( mapObject, playerNumber )
{
if ( typeof playerNumber == 'undefined' )
    {
    playerNumber = 1;
    }

    // add the html elements to the game menu
var player = document.createElement( 'div' );
var tilesLeft = document.createElement( 'div' );
var pairsLeft = document.createElement( 'div' );
var timer = document.createElement( 'div' );
var container = document.createElement( 'div' );

$( player ).text( 'Player ' + playerNumber );
$( tilesLeft ).text( 'Tiles Left: ' );
$( pairsLeft ).text( 'Pairs Left: ' );
$( timer ).text( 'Timer: ' );

var tilesLeftValue = document.createElement( 'span' );
var pairsLeftValue = document.createElement( 'span' );
var timerValue = document.createElement( 'span' );

tilesLeft.appendChild( tilesLeftValue );
pairsLeft.appendChild( pairsLeftValue );
timer.appendChild( timerValue );


container.className = 'GameMenu-infoContainer';
player.className = 'MapInformation-playerNumber';
tilesLeft.className = 'MapInformation-tilesLeft';
pairsLeft.className = 'MapInformation-pairsLeft';
timer.className = 'MapInformation-timer';

container.appendChild( player );
container.appendChild( tilesLeft );
container.appendChild( pairsLeft );
container.appendChild( timer );

var mainContainer = document.querySelector( '#GameMenu-MapInformation' );

mainContainer.appendChild( container );

this.tilesLeft_ui = tilesLeftValue;
this.pairsLeft_ui = pairsLeftValue;
this.timer_ui = timerValue;
this.container_ui = container;
this.timesUpdateWasCalled = 0;

this.mapObject = mapObject;

    // time passed in milliseconds
this.time = 0;

this.updateTimer();
}



MapInformation.prototype.startTimer = function()
{
var informationObject = this;

var interval = 500;

    // value returned from window.setInterval()
this.interval_f = window.setInterval( function()
    {
    informationObject.time += interval;

    informationObject.updateTimer();

    }, interval );
};


MapInformation.prototype.stopTimer = function()
{
window.clearInterval( this.interval_f );
};



MapInformation.prototype.updateTimer = function()
{
$( this.timer_ui ).text( Utilities.timeToString( this.time ) );
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
            var endMessage = document.querySelector( '#Message' );

            $( endMessage ).text( 'No More Possible Plays' );
            $( endMessage ).css( 'display', 'block' );

            Game.resetStuff();

            window.setTimeout( function()
                {
                $( endMessage ).css( 'display', 'none' );

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

window.MapInformation = MapInformation;

}(window));
