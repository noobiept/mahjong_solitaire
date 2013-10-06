(function(window)
{
var ALL_TILES = [];

    // to clear tiles you need to select 2 tiles of same type, this variable points to the first one being selected
var SELECTED_TILE = null;

/*
    A tile is a manufactured piece of hard-wearing material such as ceramic, stone, metal, or even glass.

    args = {
        tileName : String,      // tile name plus the number ('bamboo1' for example)
        x        : Number,
        y        : Number
    }
 */

function Tile( args )
{
if ( typeof args.tileName == 'undefined' )
    {
    console.log( 'Provide the .tileName.' );
    return;
    }


var shape = new createjs.Bitmap( PRELOAD.getResult( args.tileName ) );


if ( typeof args.x == 'undefined' )
    {
    args.x = 0;
    }

if ( typeof args.y == 'undefined' )
    {
    args.y = 0;
    }

shape.x = args.x;
shape.y = args.y;

shape.on( 'click', this.onClick );

STAGE.addChild( shape );

ALL_TILES.push( this );

this.tileName = args.tileName;
this.shape = shape;
}



Tile.prototype.onClick = function( event )
{
if ( event.paused ) //HERE this one doesnt seem to work?..
    {
    return;
    }


if ( !SELECTED_TILE )
    {
    SELECTED_TILE = this;

        //HERE have some visual change in the tile
    }

    // 2 tiles selected, check if its a valid match or not
else
    {
        // can't select the same tile again
    if ( SELECTED_TILE == this )
        {
        return;
        }

        // valid match
    if ( SELECTED_TILE.tileName == this.tileName )
        {
        SELECTED_TILE.remove();
        this.remove();

        SELECTED_TILE = null;
        }
    }
};



Tile.prototype.remove = function()
{
STAGE.remove( this.shape );

var position = ALL_TILES.indexOf( this );

ALL_TILES.splice( position, 1 );
};



window.Tile = Tile;

}(window));