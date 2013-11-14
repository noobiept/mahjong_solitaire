/*
    Each GridPosition represents a point in the grid, not a tile, since each tile occupies a 2x2 square
 */

    // position in array corresponds to position in the grid
    // the value is another array with the GridPosition
var ALL_POSITIONS = [];

function GridPosition( column, line, gridObject, scale, hidden )
{
var width = Tile.getImageWidth() / 2 * scale;
var height = Tile.getImageHeight() / 2 * scale;

var container = new createjs.Container();

container.setBounds( width, height );

var background = new createjs.Shape();

var g = background.graphics;

g.beginFill( 'gray' );
g.drawRoundRect( 0, 0, 10, 10, 3 );

container.addChild( background );

container.on( 'click', this.onClick, this );


if ( hidden !== true )
    {
    STAGE.addChild( container );
    }


this.container = container;
this.width = width;
this.height = height;
this.hasTile = false;
this.tileObject = null;
this.column = column;
this.line = line;
this.gridObject = gridObject;
this.scale = scale;


this.moveTo( gridObject.startingX + column * this.width, gridObject.startingY + line * this.height );


var gridPosition = gridObject.position;

if ( !ALL_POSITIONS[ gridPosition ] )
    {
    ALL_POSITIONS[ gridPosition ] = [];
    }

this.gridPosition = gridPosition;

ALL_POSITIONS[ gridPosition ].push( this );
}


GridPosition.prototype.moveTo = function( x, y )
{
this.container.x = x;
this.container.y = y;
};


GridPosition.prototype.onClick = function()
{
if ( this.hasTile )
    {
    this.hasTile = false;

    this.tileObject.remove();
    this.tileObject = null;
    }

else
    {
    this.hasTile = true;

    this.tileObject = new Tile({
            tileId: 'bamboo1',
            column: this.column,
            line: this.line,
            gridObject: this.gridObject,
            scale: this.scale
        });


    this.tileObject.container.removeAllEventListeners( 'click' );
    }
};


GridPosition.prototype.show = function()
{
STAGE.addChild( this.container );

if ( this.tileObject )
    {
    STAGE.addChild( this.tileObject.container );
    }
};


GridPosition.prototype.hide = function()
{
STAGE.removeChild( this.container );

if ( this.tileObject )
    {
    STAGE.removeChild( this.tileObject.container );
    }
};


GridPosition.prototype.remove = function()
{
if ( this.tileObject )
    {
    this.tileObject.remove();
    this.tileObject = null;
    }


STAGE.removeChild( this.container );

var position = ALL_POSITIONS[ this.gridPosition ].indexOf( this );

ALL_POSITIONS[ this.gridPosition ].splice( position, 1 );
};



GridPosition.removeAll = function()
{
for (var a = 0 ; a < ALL_POSITIONS.length ; a++)
    {
    var grids = ALL_POSITIONS[ a ];

    for (var b = 0 ; b < grids.length ; b++)
        {
        var gridPosition = grids[ b ];

        gridPosition.remove();

        b--;
        }
    }

ALL_POSITIONS = [];
};



/*
    Get all the GridPosition elements from a selected grid
 */

GridPosition.getGrid = function( gridPosition )
{
return ALL_POSITIONS[ gridPosition ];
};


GridPosition.getAll = function()
{
return ALL_POSITIONS;
};
