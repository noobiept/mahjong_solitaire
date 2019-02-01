import * as Game from './game.js';
import * as Message from './message.js';
import * as Utilities from './utilities.js';
import Tile, { TileName, TileArgs } from './tile.js';
import Grid, { GridArgs } from './grid.js';
import MapInformation from './map_information.js';
import { STAGE } from './main.js';


export interface MapPosition
    {
    line: number;
    column: number;
    }

export interface MapTilePosition extends MapPosition
    {
    tileId: TileName;
    tileName: TileName;
    }

export interface MapInfo
    {
    mapName: number;
    numberOfColumns: number;
    numberOfLines: number;
    mapDescription: MapPosition[][];    // first dimension is the grid, and then its a list of positions where the tiles are positioned (check the maps in the `/maps/*.json` for examples)
    }

export interface MapArgs
    {
    mapInfo: MapInfo;
    playerNumber: number;
    }


/*
    Generates a map. Each map has 144 tiles.

        - 4x bamboo suit (1 to 9)
        - 4x character suit (1 to 9)
        - 4x circle suit (1 to 9)
        - 4x wind tiles (4)
        - 4x dragon tiles (3)
        - flower tiles (4)
        - season tiles (4)
 */
export default class Map
{
static SHUFFLE_SCORE = -100;
static HELP_SCORE = -100;
static COMBINE_SCORE = 50;
static SHADOW_SCORE = -4;
static TIMER_SCORE = -1;

columns: number;
lines: number;
all_tiles: Tile[];
all_grids: Grid[];
selected_tile: Tile | null;
mapInformation: MapInformation;
playerNumber: number;
score: number;
isCurrentActive: boolean;
hasShadows: boolean;


constructor( args: MapArgs )
    {
    let playerNumber = args.playerNumber;
    const mapInfo = args.mapInfo;

    this.columns = mapInfo.numberOfColumns;
    this.lines = mapInfo.numberOfLines;

        // contain all grids/tiles of this map
    this.all_tiles = [];
    this.all_grids = [];

        // to clear tiles you need to select 2 tiles of same type, this variable points to the first one being selected
    this.selected_tile = null;

    this.mapInformation = new MapInformation({ map: this, playerNumber: playerNumber });

    var newMap = this.determineTileNames( mapInfo.mapDescription );

    this.playerNumber = playerNumber;
    this.score = 0;

        // when there's more than 1 player, only one map is active at a time (can be played)
    this.isCurrentActive = false;
    this.hasShadows = false;
    this.buildMap( newMap );
    }


/*
    mapDescription = [
            [           // grid 1
                { column: 0, line: 0, tileId: 'bamboo1', tileName: 'bamboo1' },
                { column: 2, line: 2, tileId: 'flower1', tileName: 'flower' },
                    // ...
            ],
            [           // grid 2
                // ...
            ]
        ]
 */
buildMap( mapDescription: MapTilePosition[][] )
    {
    var mapObject = this;
    var grid;
    var a, b;

        // add the tiles, each grid at a time
    for (a = 0 ; a < mapDescription.length ; a++)
        {
        var gridDescription = mapDescription[ a ];

        grid = this.addGrid({
                numberOfColumns : this.columns,
                numberOfLines   : this.lines
            });


        for (b = 0 ; b < gridDescription.length ; b++)
            {
            var position = gridDescription[ b ];

            this.addTile({
                    tileId     : position.tileId,
                    tileName   : position.tileName,
                    column     : position.column,
                    line       : position.line,
                    gridObject : grid,
                    onClick    : function( tile )
                        {
                        mapObject.onTileClick( tile );
                        }
                });
            }
        }

    var line;
    var column;
    var element;

        // we need to order the tiles z-index (which element is drawn on top of which)
        // so that the tiles don't look out of place
    for (a = 0 ; a < this.all_grids.length ; a++)
        {
        grid = this.all_grids[ a ];

        var numberOfLines = this.lines;
        var numberOfColumns = this.columns;

            // get last column/line, go diagonal up right
        for (b = numberOfLines - 1 ; b >= 0 ; b--)
            {
            line = b;
            column = 0;

            while( line < numberOfLines && column < numberOfColumns )
                {
                element = grid.grid_array[ column ][ line ];

                if ( element )
                    {
                    STAGE.addChild( element.container );
                    }

                line++;
                column++;
                }
            }

            // get 2nd last line, and do all diagonals, in first column
        for (b = 1 ; b < numberOfColumns ; b++)
            {
            line = 0;
            column = b;

            while( line < numberOfLines && column < numberOfColumns )
                {
                element = grid.grid_array[ column ][ line ];

                if ( element )
                    {
                    STAGE.addChild( element.container );
                    }

                line++;
                column++;
                }
            }
        }

    this.mapInformation.update();
    }


/*
    Determines the tile name for each position in the map, in a way so that the map is solvable

    Start with a complete map, and find the selectable tiles. Determine the tile names, and remove those tiles, find again the selectable tiles, and so on.
 */
determineTileNames( mapDescription: MapPosition[][], tilePairs?: TileName[] )
    {
    var newMap = [];
    var grid;
    var gridDescription;
    var tilePosition;

        // construct the map
    for (var a = 0 ; a < mapDescription.length ; a++)
        {
        gridDescription = mapDescription[ a ];

        grid = this.addGrid({
                numberOfColumns : this.columns,
                numberOfLines   : this.lines
            });

            // initialize the grid's array
        newMap[ a ] = [];

        for (var b = 0 ; b < gridDescription.length ; b++)
            {
            tilePosition = gridDescription[ b ];

            this.addTile({
                    tileId     : '', // doesn't matter, since we aren't drawing the shape
                    column     : tilePosition.column,
                    line       : tilePosition.line,
                    gridObject : grid
                });
            }
        }

        // determine the selectable tiles
    var allTiles = this.all_tiles;
    var selectableTiles = [];
    var tile;
    var nextTile = this.getNextTile( tilePairs );


        // while we haven't cleared the map
    while( allTiles.length > 0 )
        {
        selectableTiles = this.getSelectableTiles();

        while( selectableTiles.length > 0 )
            {
            var nextTileName = nextTile();

            var position = Utilities.getRandomInt( 0, selectableTiles.length - 1 );

            tile = selectableTiles.splice( position, 1 )[ 0 ];

            newMap[ tile.gridObject.position ].push({
                    column   : tile.column,
                    line     : tile.line,
                    tileId   : nextTileName.tileId,
                    tileName : nextTileName.tileName
                });

            this.removeTile( tile );
            }
        }

        // clear the grids
    this.removeAllGrids();

    return newMap;
    }


shuffle( addToScore= true )
    {
    var allTiles = this.all_tiles;
    var a;

    var numberOfGrids = this.all_grids.length;
    var currentMap = [];

    for (a = 0 ; a < numberOfGrids ; a++)
        {
        currentMap[ a ] = [];
        }


    var tile;
    var tileNames = [];

        // get the current positions and tile names
    for (a = 0 ; a < allTiles.length ; a++)
        {
        tile = allTiles[ a ];

        currentMap[ tile.gridObject.position ].push({
                column: tile.column,
                line: tile.line
            });

        tileNames.push( tile.tileName );
        }


        // remove the pairs, since the .getNextTile() already takes care of that (only have one for each pair)
    var tilePairs = [];
    var firstTile, secondTile;

    for (a = 0 ; a < tileNames.length ; a++)
        {
        firstTile = tileNames[ a ];

        for (var b = a + 1 ; b < tileNames.length ; b++)
            {
            secondTile = tileNames[ b ];

            if ( firstTile === secondTile )
                {
                tilePairs.push( firstTile );

                tileNames.splice( b, 1 );
                tileNames.splice( a, 1 );

                a--;
                break;
                }
            }
        }

        // clear the current map
    this.removeAllTiles();
    this.removeAllGrids();

        // re-make the map, with the current tiles
    var newMap = this.determineTileNames( currentMap, tilePairs );

    if ( addToScore )
        {
        this.addToScore( Map.SHUFFLE_SCORE );
        }

    this.buildMap( newMap );
    Game.resize();
    }


getNextTile( tilesNames?: TileName[] )
    {
    if ( typeof tilesNames === 'undefined' )
        {
            // i'll get a pair of each one of the names here
            // so for example, there's 2 'bamboo1', each means we'll get 4 of them in the map (2 pairs)
        tilesNames = [
            'bamboo1', 'bamboo1',
            'bamboo2', 'bamboo2',
            'bamboo3', 'bamboo3',
            'bamboo4', 'bamboo4',
            'bamboo5', 'bamboo5',
            'bamboo6', 'bamboo6',
            'bamboo7', 'bamboo7',
            'bamboo8', 'bamboo8',
            'bamboo9', 'bamboo9',

            'character1', 'character1',
            'character2', 'character2',
            'character3', 'character3',
            'character4', 'character4',
            'character5', 'character5',
            'character6', 'character6',
            'character7', 'character7',
            'character8', 'character8',
            'character9', 'character9',

            'circle1', 'circle1',
            'circle2', 'circle2',
            'circle3', 'circle3',
            'circle4', 'circle4',
            'circle5', 'circle5',
            'circle6', 'circle6',
            'circle7', 'circle7',
            'circle8', 'circle8',
            'circle9', 'circle9',

            'wind1', 'wind1',
            'wind2', 'wind2',
            'wind3', 'wind3',
            'wind4', 'wind4',

            'dragon1', 'dragon1',
            'dragon1', 'dragon1',
            'dragon1', 'dragon1',

            'flower', 'flower',
            'season', 'season'
            ];
        }


    var previousTile = null;
    var flowerNumber = 1;
    var seasonNumber = 1;

    return function()
        {
        var tileName;
        var tileId;

            // we need to return the same tile 2 times (a pair), so check if its time to return the 2nd, otherwise get a new pair from the 'tileNames' array
        if ( previousTile )
            {
            tileName = previousTile;

            previousTile = null;
            }

        else
            {
            var position = Utilities.getRandomInt( 0, tilesNames.length - 1 );

            tileName = tilesNames.splice( position, 1 )[ 0 ];

            previousTile = tileName;
            }


            // the flower/season works a bit differently than the others, since they can match with each other, but have different images
        if ( tileName === 'flower' )
            {
            tileId = tileName + flowerNumber;

            flowerNumber++;
            }

        else if ( tileName === 'season' )
            {
            tileId = tileName + seasonNumber;

            seasonNumber++;
            }

        else
            {
            tileId = tileName;
            }

        return {
            tileId   : tileId,
            tileName : tileName
            };
        }
    }


/*
    Returns an array with the tiles that can be selected in the map
 */
getSelectableTiles()
    {
    var allTiles = this.all_tiles;
    var tile;
    var selectableTiles = [];

    for (var a = 0 ; a < allTiles.length ; a++)
        {
        tile = allTiles[ a ];

        if ( this.isTileSelectable( tile ) )
            {
            selectableTiles.push( tile );
            }
        }

    return selectableTiles;
    }


howManySelectablePairs()
    {
    var selectableTiles = this.getSelectableTiles();
    var count = 0;
    var first;

    for (var a = 0 ; a < selectableTiles.length ; a++)
        {
        first = selectableTiles[ a ];

        for (var b = a + 1 ; b < selectableTiles.length ; b++)
            {
            if ( first.tileName === selectableTiles[ b ].tileName )
                {
                count++;

                selectableTiles.splice( b, 1 );
                selectableTiles.splice( a, 1 );

                a--;
                break;
                }
            }
        }

    return count;
    }


getPair()
    {
    var tiles = this.getSelectableTiles();
    var first, second;

    for (var a = 0 ; a < tiles.length ; a++)
        {
        first = tiles[ a ];

        for (var b = a + 1 ; b < tiles.length ; b++)
            {
            second = tiles[ b ];

            if ( first.tileName === second.tileName )
                {
                return [ first, second ];
                }
            }
        }

    return null;
    }


highlightRandomPair()
    {
    var pair = this.getPair();

    if ( pair )
        {
        pair[ 0 ].highlightTile();
        pair[ 1 ].highlightTile();

        this.addToScore( Map.HELP_SCORE );
        }
    }


/*
    shadows the un-selectable tiles in the map
 */
shadowTiles()
    {
    this.hasShadows = true;
    var allTiles = this.all_tiles;

    for (var a = 0 ; a < allTiles.length ; a++)
        {
        var tile = allTiles[ a ];

        if ( !this.isTileSelectable( tile ) )
            {
            tile.shadow();
            }

        else
            {
            tile.clearBackground();
            }
        }
    }


unShadowTiles()
    {
    this.hasShadows = false;
    var allTiles = this.all_tiles;

    for (var a = 0 ; a < allTiles.length ; a++)
        {
        var tile = allTiles[ a ];

        tile.clearBackground();
        }
    }


addTile( args: TileArgs )
    {
    var tile = new Tile( args );

    if ( args.drawShape !== false )
        {
        args.gridObject.addTile( tile, args.column, args.line );
        this.unSelectTile( tile );
        }

    else
        {
        args.gridObject.addTile( tile, args.column, args.line, false );
        }

    this.all_tiles.push( tile );

    return tile;
    }


removeTile( tileObject: Tile )
    {
    var position = this.all_tiles.indexOf( tileObject );

    this.all_tiles.splice( position, 1 );

    tileObject.remove();
    }


addGrid( args: GridArgs )
    {
    var grid = new Grid({
        numberOfColumns: args.numberOfColumns,
        numberOfLines: args.numberOfLines,
        position: this.all_grids.length
    });

    this.all_grids.push( grid );

    return grid;
    }


removeGrid( gridObject: Grid )
    {
    var position = this.all_grids.indexOf( gridObject );

    this.all_grids.splice( position, 1 );
    }


removeAllGrids()
    {
    this.all_grids.length = 0;
    }


removeAllTiles()
    {
    for (var a = 0 ; a < this.all_tiles.length ; a++)
        {
        this.all_tiles[ a ].remove();
        }

    this.all_tiles.length = 0;
    }


clear()
    {
    this.removeAllTiles();
    this.removeAllGrids();
    this.mapInformation.clear();
    }


selectTile( tile: Tile )
    {
    this.selected_tile = tile;

    tile.selectTile();
    }


unSelectTile( tile: Tile )
    {
    this.selected_tile = null;

    tile.clearBackground();
    }


/**
 * A tile has been clicked on, see if we can select it, or combine it with a previously selected tile.
 * Clicking on the selected tile de-selects it.
 */
onTileClick( tile: Tile )
    {
    if ( !this.isTileSelectable( tile ) || !this.isCurrentActive )
        {
        Message.show( 'Un-selectable tile.', true, 1000 );
        return;
        }

    var selectedTile = this.selected_tile;

        // no tile is selected, so we select the first one
    if ( !selectedTile )
        {
        this.selectTile( tile );
        }

        // 2 tiles selected, check if its a valid match or not
    else
        {
            // different tile selected, see if we can combine them
        if ( selectedTile !== tile )
            {
                // valid match
            if ( selectedTile.tileName === tile.tileName )
                {
                this.removeTile( selectedTile );
                this.removeTile( tile );

                this.selected_tile = null;

                Game.updateInformation();

                this.addToScore( Map.COMBINE_SCORE );
                this.mapInformation.timesUpdateWasCalled = 0;
                this.mapInformation.update();

                if ( !Game.hasEnded() )
                    {
                    Game.changePlayer();
                    }
                }

            else
                {
                this.unSelectTile( selectedTile );
                this.selectTile( tile );
                }
            }

            // same tile selected, so we un-select it
        else
            {
            this.unSelectTile( selectedTile );
            }
        }
    }


/**
 * To be able to select a tile, one of the sides (left or right) has to be free, and the tile can't have other tiles on top of it (in a grid above).
 */
isTileSelectable( tile: Tile )
    {
    var column = tile.column;
    var line = tile.line;
    var grid = tile.gridObject;

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

    for ( ;; )
        {
        gridPosition++;

        gridAbove = this.all_grids[ gridPosition ];

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
    }


addToScore( score: number )
    {
    this.score += score;

    this.mapInformation.updateScore( this.score );
    }


addTimerScore()
    {
    this.addToScore( Map.TIMER_SCORE + this.hasShadows * Map.SHADOW_SCORE );
    }


scaleMap( dimensions )
    {
    var tileWidth = Tile.getImageWidth();
    var tileHeight = Tile.getImageHeight();

        // find the scale value that occupies the whole width/height of the canvas, then choose the lesser value (since width/height can have different values)
        // we're dividing the columns/lines by 2 because the tile occupies a 2x2 square in the grid
    var scaleWidth = dimensions.width / ( this.columns / 2 * tileWidth );
    var scaleHeight = dimensions.height / ( this.lines / 2 * tileHeight );
    var scale = scaleHeight;

    if ( scaleWidth < scaleHeight )
        {
        scale = scaleWidth;
        }

        // center the map horizontally
    var mapWidth = this.columns / 2 * Tile.getImageWidth() * scale;
    var startingX = dimensions.x + dimensions.width / 2 - mapWidth / 2;
    var startingY = dimensions.y;

    for (var a = 0 ; a < this.all_grids.length ; a++)
        {
        var grid = this.all_grids[ a ];

        grid.positionElements( startingX, startingY, scale );

            // so that its possible to tell the tiles below (so they aren't all stack on the same spot)
        startingX -= 6 * scale;
        startingY += 6 * scale;
        }
    }
}
