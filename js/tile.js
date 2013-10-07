(function(window)
{
var ALL_TILES = [];

    // to clear tiles you need to select 2 tiles of same type, this variable points to the first one being selected
var SELECTED_TILE = null;

/*
    A tile is a manufactured piece of hard-wearing material such as ceramic, stone, metal, or even glass.

    args = {
        tileId   : String,      // the id of the image to be loaded
        tileName : String,      // tile name plus the number ('bamboo1' for example). This is going to be used to know which tiles match (we can't use the id for that, since there's for example flower tiles that have different images, but can be matched between them
        x        : Number,
        y        : Number
    }
 */

function Tile( args )
{
    // validate the arguments
if ( typeof args.tileId == 'undefined' )
    {
    console.log( 'Provide the .tileId.' );
    return;
    }

if ( typeof args.tileName == 'undefined' )
    {
        // if not provided, we assume its the same as the id
    args.tileName = args.tileId;
    }

if ( typeof args.x == 'undefined' )
    {
    args.x = 0;
    }

if ( typeof args.y == 'undefined' )
    {
    args.y = 0;
    }

this.width = 44;
this.height = 53;

    // load the image
var shape = new createjs.Bitmap( PRELOAD.getResult( args.tileId ) );

    // and the background (its used to tell when a tile is selected or not)
var background = new createjs.Shape();

background.setBounds( 0, 0, this.width, this.height );


var container = new createjs.Container();

container.addChild( background );
container.addChild( shape );

container.x = args.x;
container.y = args.y;

container.on( 'click', this.onClick, this );

STAGE.addChild( container );

ALL_TILES.push( this );

this.tileName = args.tileName;
this.background = background;
this.shape = shape;
this.container = container;


this.unSelectTile();
}



Tile.prototype.onClick = function( event )
{
if ( event.paused ) //HERE this one doesnt seem to work?..
    {
    return;
    }


    // no tile is selected, so we select the first one
if ( !SELECTED_TILE )
    {
    this.selectTile();
    }

    // 2 tiles selected, check if its a valid match or not
else
    {
        // can't select the same tile again
    if ( SELECTED_TILE !== this )
        {
            // valid match
        if ( SELECTED_TILE.tileName == this.tileName )
            {
            SELECTED_TILE.remove();
            this.remove();

            SELECTED_TILE = null;
            }

        else
            {
            SELECTED_TILE.unSelectTile();
            this.selectTile();
            }
        }
    }
};


Tile.prototype.selectTile = function()
{
SELECTED_TILE = this;

var g = this.background.graphics;

g.beginFill( 'red' );
g.drawRoundRect( 0, 0, this.width, this.height, 2 );
};


Tile.prototype.unSelectTile = function()
{
SELECTED_TILE = null;

var g = this.background.graphics;

g.clear();
g.beginFill( 'transparent' );
g.drawRoundRect( 0, 0, this.width, this.height, 2 );
};


Tile.prototype.remove = function()
{
STAGE.removeChild( this.container );

var position = ALL_TILES.indexOf( this );

ALL_TILES.splice( position, 1 );
};



window.Tile = Tile;

}(window));