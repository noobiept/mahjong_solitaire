(function(window)
{
function MapInformation( mapObject )
{
var informationObject = this;

    // add the html elements to the game menu
var tilesLeft = document.createElement( 'div' );
var pairsLeft = document.createElement( 'div' );
var timer = document.createElement( 'div' );
var container = document.createElement( 'div' );

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
tilesLeft.className = 'MapInformation-tilesLeft';
pairsLeft.className = 'MapInformation-pairsLeft';
timer.className = 'MapInformation-timer';

container.appendChild( tilesLeft );
container.appendChild( pairsLeft );
container.appendChild( timer );

var mainContainer = document.querySelector( '#GameMenu-MapInformation' );

mainContainer.appendChild( container );

this.tilesLeft_ui = tilesLeftValue;
this.pairsLeft_ui = pairsLeftValue;
this.timer_ui = timerValue;
this.container_ui = container;

this.mapObject = mapObject;

    // time passed in milliseconds
this.time = 0;

var interval = 500;


    // value returned from window.setInterval()
this.interval_f = window.setInterval( function()
    {
    informationObject.time += interval;

    informationObject.updateTimer();

    }, interval );

this.updateTimer();
}


MapInformation.prototype.updateTimer = function()
{
$( this.timer_ui ).text( timeToString( this.time ) );
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
        Game.getActiveMap().shuffle();
        GameMenu.showMessage( 'No More Pairs Left (shuffling)' );
        Game.updateInformation();
        }
    }
};


MapInformation.prototype.clear = function()
{
window.clearInterval( this.interval_f );

var mainContainer = document.querySelector( '#GameMenu-MapInformation' );


mainContainer.removeChild( this.container_ui );
};

window.MapInformation = MapInformation;

}(window));