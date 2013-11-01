function GridPosition( column, line, gridObject )
{
var width = Tile.getImageWidth();
var height = Tile.getImageHeight();

var container = new createjs.Container();

container.setBounds( width, height );

var background = new createjs.Shape();

var g = background.graphics;

g.beginFill( 'gray' );
g.drawRoundRect( 0, 0, width, height, 3 );

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

gridObject.addTile( this, column, line );
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
            gridObject: this.gridObject
        });


    this.tileObject.container.on('click', this.onClick, this);
    }
};

