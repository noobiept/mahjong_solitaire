import Tile from '/static/scripts/tile.js';
import Grid from '/static/scripts/grid.js';
import GridPosition from './grid_position.js';
import { CANVAS, updateMenuValues } from './map_editor.js';


var ALL_GRIDS = [];
var ALL_TILES = [];

    // current selected grid (0+), or -1 is none is selected (when its showing the whole map)
var SELECTED_GRID = -1;
var TILES_LEFT = 144;


export function constructGrid( mapInfo )
{
var numberOfGrids;

if ( mapInfo.numberOfGrids )
    {
    numberOfGrids = mapInfo.numberOfGrids;
    }

else
    {
    numberOfGrids = mapInfo.mapDescription.length;
    }

var columns = mapInfo.numberOfColumns;
var lines = mapInfo.numberOfLines;
var grid;
var tileWidth = Tile.getImageWidth();
var tileHeight = Tile.getImageHeight();
var startingX = 100;
var startingY = 0;

CANVAS.width = columns * tileWidth + startingX;
CANVAS.height = lines * tileHeight + startingY;

var gridsContainer = document.querySelector( '#Grids-container' );

for (let a = 0 ; a < numberOfGrids ; a++)
    {
    addGrid({
            numberOfColumns : columns + 1,
            numberOfLines   : lines
        });


    var gridElement = document.createElement( 'div' );

    $( gridElement ).text( a + 1 );

    gridElement.onclick = function()
        {
        var newGrid = parseInt( $( this ).text() ) - 1;

        selectGrid( newGrid );
        };

    gridsContainer.appendChild( gridElement );
    }


    // no grid selected initially
SELECTED_GRID = -1;


for (let a = 0 ; a < numberOfGrids ; a++)
    {
    grid = getGrid( a );

    for (var b = 0 ; b < columns ; b++)
        {
        for (var c = 0 ; c < lines ; c++)
            {
            var gridPosition = new GridPosition({
                column: b,
                line: c,
                grid: grid,
                hidden: true
            });

            gridPosition.moveTo( startingX + tileWidth * b, startingY + tileHeight * c );
            }
        }

    startingX -= 6;
    startingY += 6;
    }

selectGrid( SELECTED_GRID );
updateMenuValues( mapInfo );
}


export function constructMap( mapInfo )
{
var mapDescription = mapInfo.mapDescription;

for (var a = 0 ; a < mapDescription.length ; a++)
    {
    var gridDescription = mapDescription[ a ];
    var gridPositions = GridPosition.getGrid( a );

        // so that we don't change the array in GridPosition, we get a new one (clone)
    var gridPositionsCopy = gridPositions.slice( 0 );

    for (var b = 0 ; b < gridDescription.length ; b++)
        {
        var tile = gridDescription[ b ];

            // find the GridPosition that corresponds to the column/line tile
        for (var c = 0 ; c < gridPositionsCopy.length ; c++)
            {
            var gridPosition = gridPositionsCopy[ c ];

            if ( gridPosition.column === tile.column && gridPosition.line === tile.line )
                {
                gridPosition.onClick( false );

                    // remove this GridPosition, since its already got an hit (so that the next search is faster)
                gridPositionsCopy.splice( c, 1 );
                break;
                }
            }
        }
    }
}


export function selectGrid( gridPosition )
{
    // -1 is to show all grids, 0+ is to select a specific grid
if ( gridPosition < -1 || gridPosition >= ALL_GRIDS.length )
    {
    return;
    }

    // already selected
if ( gridPosition === SELECTED_GRID )
    {
    return;
    }

var previousGridPositions;
var allTiles = getAllTiles();
var allGridPositions = GridPosition.getAll();

    // show all the tiles (but not the GridPosition)
if ( gridPosition < 0 )
    {
    previousGridPositions = GridPosition.getGrid( SELECTED_GRID );

            // hide previous grid
    for (let a = 0 ; a < previousGridPositions.length ; a++)
        {
        previousGridPositions[ a ].hide();
        }

        // show all the tiles
        // add the tiles starting on the bottom grid, and going up (so that the z-index is correct (the tiles on top grids, are above the tiles on grids below))
    for (let a = 0 ; a < allGridPositions.length ; a++)
        {
        var individualGrid = allGridPositions[ a ];

        for (var b = 0 ; b < individualGrid.length ; b++)
            {
            var gridPositionObject = individualGrid[ b ];

            if ( gridPositionObject.tileObject )
                {
                STAGE.addChild( gridPositionObject.tileObject.container );
                }
            }
        }


    $( '#Grids-currentGrid' ).text( 'All Grids.' );
    }

    // show only the selected GridPosition/Tile elements
else
    {
        // when previously wasn't any grid selected
    if ( SELECTED_GRID < 0 )
        {
            // hide all tiles
        for (let a = 0 ; a < allTiles.length ; a++)
            {
            STAGE.removeChild( allTiles[ a ].container );
            }
        }

        // a grid was selected, and now we're choosing a different one
    else
        {
        previousGridPositions = GridPosition.getGrid( SELECTED_GRID );

            // hide previous grid
        for (var a = 0 ; a < previousGridPositions.length ; a++)
            {
            previousGridPositions[ a ].hide();
            }
        }

        // show next one
    var gridPositions = GridPosition.getGrid( gridPosition );

    for (let a = 0 ; a < gridPositions.length ; a++)
        {
        gridPositions[ a ].show();
        }

    $( '#Grids-currentGrid' ).text( 'Selected Grid: ' + (gridPosition + 1) );
    }

SELECTED_GRID = gridPosition;
}


export async function save()
{
var mapName = document.querySelector( '#mapName' ).value;

var grid = getGrid( 0 );
var allGrids = getAllGrids();
var allTiles = getAllTiles();

var numberOfColumns = grid.numberOfColumns;
var numberOfLines = grid.numberOfLines;
var a;
var mapDescription = [];

    // init mapDescription
for (a = 0 ; a < allGrids.length ; a++)
    {
    mapDescription[ a ] = [];
    }

for (a = 0 ; a < allTiles.length ; a++)
    {
    var tile = allTiles[ a ];

    var gridPosition = tile.gridObject.position;

    mapDescription[ gridPosition ].push({
            column : tile.column,
            line   : tile.line
        });
    }

var mapDefinition = {
    mapName         : mapName,
    numberOfColumns : numberOfColumns,
    numberOfLines   : numberOfLines,
    mapDescription  : mapDescription
    };

const response = await fetch( '/save_map', {
    method: 'post',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: mapDefinition })
} );

if ( response.status === 200 )
    {
    console.log( `Saved: ${mapName}` );
    }
}


export async function load( mapName?: string )
{
clear();

    // try to load the latest map (that was loaded in the previous session)
if ( typeof mapName === 'undefined' )
    {
    var previousMap = localStorage.getItem( 'previousMap' );

    if ( previousMap !== null )
        {
        mapName = previousMap;
        }

    else
        {
        console.log( 'Invalid map name.' );
        return;
        }
    }

    try {
        const response = await fetch( '/load_map', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mapName: mapName })
        } );
        const mapInfo = await response.json();

        constructGrid( mapInfo );
        constructMap( mapInfo );

        localStorage.setItem( 'previousMap', mapName );
        console.log( `Loaded: ${mapName}` );
    }

    catch( error ) {
        console.log( error );
    }
}


export function addTile( args )
{
args.mapObject = Map;

var tile = new Tile( args );

ALL_TILES.push( tile );

tile.container.removeAllEventListeners( 'click' );

TILES_LEFT--;

return tile;
}


export function removeTile( tileObject )
{
var position = ALL_TILES.indexOf( tileObject );

ALL_TILES.splice( position, 1 );

tileObject.remove();

TILES_LEFT++;
}


export function addGrid( args )
{
var grid = new Grid( args.numberOfColumns, args.numberOfLines, ALL_GRIDS.length );

ALL_GRIDS.push( grid );

return grid;
}


export function removeGrid( gridObject )
{
var position = ALL_GRIDS.indexOf( gridObject );

ALL_GRIDS.splice( position, 1 );
}


export function getGrid( position )
{
return ALL_GRIDS[ position ];
}


export function getAllGrids()
{
return ALL_GRIDS;
}


export function getAllTiles()
{
return ALL_TILES;
}


export function removeAllGrids()
{
ALL_GRIDS.length = 0;
}


export function removeAllTiles()
{
for (var a = 0 ; a < ALL_TILES.length ; a++)
    {
    ALL_TILES[ a ].remove();
    }

ALL_TILES.length = 0;
}


export function clear()
{
GridPosition.removeAll();
removeAllGrids();

TILES_LEFT = 144;

document.querySelector( '#Grids-container' ).innerHTML = '';
}


export function updateTilesLeft()
{
$( '#TilesLeft' ).text( 'Tiles Left: ' + TILES_LEFT );
}
