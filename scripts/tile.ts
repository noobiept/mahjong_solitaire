import Grid from './grid.js';
import { PRELOAD, STAGE } from './main.js';


// the original image dimensions, this can be scaled
const TILE_WIDTH = 36;
const TILE_HEIGHT = 45;


export type TileName = 'bamboo' | 'character' | 'circle' | 'wind' | 'dragon' | 'flower' | 'season';
export type TileId = 'bamboo1' | 'bamboo2' | 'bamboo3' | 'bamboo4' | 'bamboo5' | 'bamboo6' | 'bamboo7' | 'bamboo8' | 'bamboo9' | 'character1' | 'character2' | 'character3' | 'character4' | 'character5' | 'character6' | 'character6' | 'character7' | 'character8' | 'character9' | 'circle1' | 'circle2' | 'circle3' | 'circle4' | 'circle5' | 'circle6' | 'circle7' | 'circle8' | 'circle9' | 'wind1' | 'wind2' | 'wind3' | 'wind4' | 'dragon1' | 'flower' | 'season';

export interface TileArgs {
    tileId    : TileId,      // the id of the image to be loaded
    tileName? : TileName,    // tile name plus the number ('bamboo1' for example). This is going to be used to know which tiles match (we can't use the id for that, since there's for example flower tiles that have different images, but can be matched between them
    column? : number,
    line?   : number,
    gridObject : Grid,
    drawShape? : boolean,
    onClick?   : (tile: Tile) => any
}


/**
 * A tile is a manufactured piece of hard-wearing material such as ceramic, stone, metal, or even glass.
 */
export default class Tile
{
width: number;
height: number;
tileId: TileId;
tileName: TileName;
background: createjs.Shape | undefined;
shape: createjs.Bitmap | undefined;
container: createjs.Container | undefined;
column: number;
line: number;
gridObject: Grid;


constructor( args: TileArgs )
    {
    var _this = this;

        // :: validate the arguments :: //

    if ( typeof args.tileId === 'undefined' )
        {
        throw new Error( 'Provide the .tileId. Got: ' + args.tileId );
        }

    if ( typeof args.gridObject === 'undefined' )
        {
        throw new Error( 'Provide the .gridObject. Got: ' + args.gridObject );
        }

    if ( typeof args.tileName === 'undefined' )
        {
            // if not provided, we assume its the same as the id
        args.tileName = args.tileId as TileName;
        }

    if ( typeof args.column === 'undefined' )
        {
        args.column = 0;
        }

    if ( typeof args.line === 'undefined' )
        {
        args.line = 0;
        }

    this.width = TILE_WIDTH;
    this.height = TILE_HEIGHT;

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

        container.on( 'click', function()
            {
            if ( args.onClick )
                {
                args.onClick( _this );
                }
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
    }


selectTile()
    {
    if ( !this.background )
        {
        return;
        }

    var g = this.background.graphics;

    g.beginFill( 'rgba(255, 0, 0, 0.3)' );
    g.drawRoundRect( 3, 3, TILE_WIDTH + 2, TILE_HEIGHT + 2, 5 );
    }


highlightTile()
    {
    if ( !this.background )
        {
        return;
        }

    var g = this.background.graphics;

    g.clear();
    g.beginFill( 'rgba(255, 215, 0, 0.3)' );
    g.drawRoundRect( 3, 3, TILE_WIDTH + 2, TILE_HEIGHT + 2, 5 );
    }


clearBackground()
    {
    if ( !this.background )
        {
        return;
        }

    var g = this.background.graphics;

    g.clear();
    g.beginFill( 'transparent' );
    g.drawRoundRect( 3, 3, TILE_WIDTH + 2, TILE_HEIGHT + 2, 5 );
    }


shadow()
    {
    if ( !this.background )
        {
        return;
        }

    var g = this.background.graphics;

    g.clear();
    g.beginFill( 'rgba(0, 0, 0, 0.3)' );
    g.drawRoundRect( 3, 3, TILE_WIDTH + 2, TILE_HEIGHT + 2, 5 );
    }


moveTo( x: number, y: number )
    {
    if ( !this.container )
        {
        return;
        }

    this.container.x = x;
    this.container.y = y;
    }


remove()
    {
    if ( this.container )
        {
        STAGE.removeChild( this.container );
        }

    this.gridObject.removeTile( this.column, this.line );
    }


static getImageWidth()
    {
    return TILE_WIDTH;
    }


static getImageHeight()
    {
    return TILE_HEIGHT;
    }
}
