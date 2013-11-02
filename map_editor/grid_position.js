/*
    Each GridPosition represents a point in the grid, not a tile, since each tile occupies a 2x2 square
 */

function GridPosition( column, line, gridObject, scale )
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

STAGE.addChild( container );


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

