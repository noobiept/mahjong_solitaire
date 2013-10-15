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
        column : Number,
        line   : Number,
        gridObject : Grid,
        drawShape : Boolean
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


this.width = 44;
this.height = 53;


    // :: draw the shape :: //
var shape, background, container;

if ( args.drawShape !== false )
    {
        // load the image
    shape = new createjs.Bitmap( PRELOAD.getResult( args.tileId ) );

        // and the background (its used to tell when a tile is selected or not)
    background = new createjs.Shape();

    background.setBounds( 0, 0, this.width, this.height );


    container = new createjs.Container();

    container.addChild( background );
    container.addChild( shape );

    container.on( 'click', this.onClick, this );

    STAGE.addChild( container );
    }


    // :: set properties :: //
ALL_TILES.push( this );

this.tileName = args.tileName;
this.background = background;
this.shape = shape;
this.container = container;
this.column = args.column;
this.line = args.line;
this.gridObject = args.gridObject;



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

            GameMenu.updateInformation( MAP );
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

    //HERE check max. column?...
if ( grid.grid_array[ column + 2 ][ line ] ||
     grid.grid_array[ column + 2 ][ line + 1 ] )
    {
    isRightFree = false;
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

    gridAbove = Grid.get( gridPosition );

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

var position = ALL_TILES.indexOf( this );

ALL_TILES.splice( position, 1 );

this.gridObject.removeTile( this.column, this.line );
};



Tile.getAll = function()
{
return ALL_TILES;
};


Tile.removeAll = function()
{
for (var a = 0 ; a < ALL_TILES.length ; a++)
    {
    ALL_TILES[ a ].remove();
    }
};


window.Tile = Tile;

}(window));