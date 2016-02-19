/*global createjs, PRELOAD, STAGE*/

(function(window)
{
    // the original image dimensions, this can be scaled
var TILE_WIDTH = 36;
var TILE_HEIGHT = 45;


/*
    A tile is a manufactured piece of hard-wearing material such as ceramic, stone, metal, or even glass.

    args = {
        tileId   : String,      // the id of the image to be loaded
        tileName : String,      // tile name plus the number ('bamboo1' for example). This is going to be used to know which tiles match (we can't use the id for that, since there's for example flower tiles that have different images, but can be matched between them
        column : Number,
        line   : Number,
        gridObject : Grid,
        drawShape  : Boolean,
        onClick    : (tile: Tile) => any,
        scale      : Number
    }
 */

function Tile( args )
{
var _this = this;

    // :: validate the arguments :: //

if ( typeof args.tileId == 'undefined' )
    {
    throw new Error( 'Provide the .tileId. Got: ' + args.tileId );
    }

if ( typeof args.gridObject == 'undefined' )
    {
    throw new Error( 'Provide the .gridObject. Got: ' + args.gridObject );
    }

if ( typeof args.tileName == 'undefined' )
    {
        // if not provided, we assume its the same as the id
    args.tileName = args.tileId;
    }

if ( typeof args.column == 'undefined' )
    {
    args.column = 0;
    }

if ( typeof args.line == 'undefined' )
    {
    args.line = 0;
    }

if ( typeof args.scale == 'undefined' )
    {
    args.scale = 1;
    }


this.width = TILE_WIDTH * args.scale;
this.height = TILE_HEIGHT * args.scale;


    // :: draw the shape :: //
var shape, background, container;

if ( args.drawShape !== false )
    {
        // load the image
    shape = new createjs.Bitmap( PRELOAD.getResult( args.tileId ) );

        // and the background (its used to tell when a tile is selected or not)
    background = new createjs.Shape();

    container = new createjs.Container();

    container.addChild( shape );
    container.addChild( background );

    container.scaleX = args.scale;
    container.scaleY = args.scale;

    container.on( 'click', function()
        {
        args.onClick( _this );
        });

    STAGE.addChild( container );
    }


    // :: set properties :: //

this.tileId = args.tileId;
this.tileName = args.tileName;
this.background = background;
this.shape = shape;
this.container = container;
this.column = args.column;
this.line = args.line;
this.gridObject = args.gridObject;
this.scale = args.scale;
}


Tile.prototype.selectTile = function()
{
var g = this.background.graphics;

g.beginFill( 'rgba(255, 0, 0, 0.3)' );
g.drawRoundRect( 3, 3, TILE_WIDTH + 2, TILE_HEIGHT + 2, 5 );    // seems to already consider the .scale ?..
};


Tile.prototype.highlightTile = function()
{
var g = this.background.graphics;

g.clear();
g.beginFill( 'rgba(255, 215, 0, 0.3)' );
g.drawRoundRect( 3, 3, TILE_WIDTH + 2, TILE_HEIGHT + 2, 5 );
};


Tile.prototype.clearBackground = function()
{
var g = this.background.graphics;

g.clear();
g.beginFill( 'transparent' );
g.drawRoundRect( 3, 3, TILE_WIDTH + 2, TILE_HEIGHT + 2, 5 );
};


Tile.prototype.shadow = function()
{
var g = this.background.graphics;

g.clear();
g.beginFill( 'rgba(0, 0, 0, 0.3)' );
g.drawRoundRect( 3, 3, TILE_WIDTH + 2, TILE_HEIGHT + 2, 5 );
};


Tile.prototype.moveTo = function( x, y )
{
this.container.x = x;
this.container.y = y;
};


Tile.prototype.remove = function()
{
STAGE.removeChild( this.container );

this.gridObject.removeTile( this.column, this.line );
};


Tile.getImageWidth = function()
{
return TILE_WIDTH;
};


Tile.getImageHeight = function()
{
return TILE_HEIGHT;
};


window.Tile = Tile;
}(window));
