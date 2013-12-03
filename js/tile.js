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
        mapObject  : Map,
        drawShape  : Boolean,
        scale      : Number
    }
 */

function Tile( args )
{
    // :: validate the arguments :: //

if ( typeof args.tileId == 'undefined' )
    {
    console.log( 'Provide the .tileId. Got:', args.tileId );
    return;
    }

if ( typeof args.gridObject == 'undefined' )
    {
    console.log( 'Provide the .gridObject. Got:', args.gridObject );
    return;
    }

if ( typeof args.mapObject == 'undefined' )
    {
    console.log( 'Provide the .mapObject. Got:', args.mapObject );
    return;
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

    container.on( 'click', this.onClick, this );

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
this.mapObject = args.mapObject;
this.scale = args.scale;


if ( args.drawShape !== false )
    {
    args.gridObject.addTile( this, args.column, args.line );

    this.unSelectTile();
    }

else
    {
    args.gridObject.addTile( this, args.column, args.line, false );
    }
}



Tile.prototype.onClick = function( event )
{
if ( event.paused ) //HERE this one doesnt seem to work?..
    {
    return;
    }

if ( !this.isTileSelectable() )
    {
    GameMenu.showMessage( 'Un-selectable tile.' );
    return;
    }

var selectedTile = this.mapObject.selected_tile;

    // no tile is selected, so we select the first one
if ( !selectedTile )
    {
    this.selectTile();
    }

    // 2 tiles selected, check if its a valid match or not
else
    {
        // can't select the same tile again
    if ( selectedTile !== this )
        {
            // valid match
        if ( selectedTile.tileName == this.tileName )
            {
            this.mapObject.removeTile( selectedTile );
            this.mapObject.removeTile( this );

            selectedTile = null;

            Game.updateInformation();
            this.mapObject.mapInformation.update();
            }

        else
            {
            selectedTile.unSelectTile();
            this.selectTile();
            }
        }
    }
};


Tile.prototype.selectTile = function()
{
this.mapObject.selected_tile = this;

var g = this.background.graphics;

g.beginFill( 'rgba(255, 0, 0, 0.3)' );
g.drawRoundRect( 3, 3, TILE_WIDTH + 2, TILE_HEIGHT + 2, 5 );    // seems to already consider the .scale ?..
};


Tile.prototype.unSelectTile = function()
{
this.mapObject.selected_tile = null;

this.clearBackground();
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



/*
    to be able to select a tile, one of the sides (left or right) as to be free, and the tile can't have other tiles on top of it (in a grid above)
 */

Tile.prototype.isTileSelectable = function()
{
var column = this.column;
var line = this.line;
var grid = this.gridObject;

var isLeftFree = true;
var isRightFree = true;

if ( column > 0 )
    {
    if ( grid.grid_array[ column - 1 ][ line ] ||
         grid.grid_array[ column - 1 ][ line + 1 ] )
        {
        isLeftFree = false;
        }
    }

if ( column + 2 < grid.grid_array.length )
    {
    if ( grid.grid_array[ column + 2 ][ line ] ||
            grid.grid_array[ column + 2 ][ line + 1 ] )
        {
        isRightFree = false;
        }
    }


if ( !isLeftFree && !isRightFree )
    {
    return false;
    }

    // check grids above, if there's any tile on top of this one
var gridAbove;
var gridPosition = grid.position;

while( true )
    {
    gridPosition++;

    gridAbove = this.mapObject.all_grids[ gridPosition ];

    if ( !gridAbove )
        {
        break;
        }

    if ( gridAbove.grid_array[ column ][ line ] ||
         gridAbove.grid_array[ column ][ line + 1 ] ||
         gridAbove.grid_array[ column + 1 ][ line ] ||
         gridAbove.grid_array[ column + 1 ][ line + 1 ] )
        {
        return false;
        }
    }

return true;
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