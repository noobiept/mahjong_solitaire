import * as Map from './map.js';
import { MapInfo } from '../../scripts/map.js';


export var CANVAS: HTMLCanvasElement;
export var STAGE: createjs.Stage;
export var PRELOAD: createjs.LoadQueue;


window.onload = function()
{
CANVAS = document.getElementById( 'canvas' ) as HTMLCanvasElement;
CANVAS.width = 1500;
CANVAS.height = 850;

STAGE = new createjs.Stage( CANVAS );

createjs.Ticker.addEventListener('tick', function()
    {
    STAGE.update();
    });

document.getElementById( 'saveMap' )!.onclick = Map.save;
document.getElementById( 'loadMap' )!.onclick = function()
    {
    const label = document.getElementById('mapName') as HTMLInputElement;
    var mapName = label.value;

    Map.load( mapName );
    };

document.getElementById( 'Grids-seeAll' )!.onclick = function()
    {
    Map.selectGrid( -1 );
    };

document.getElementById( 'newMap' )!.onclick = function()
    {
    const gridsInput = document.getElementById( 'grids' ) as HTMLInputElement;
    const columnsInput = document.getElementById( 'columns' ) as HTMLInputElement;
    const linesInput = document.getElementById( 'lines' ) as HTMLInputElement;

    var numberOfGrids = gridsInput.value;
    var numberOfColumns = columnsInput.value;
    var numberOfLines = linesInput.value;

    Map.clear();
    Map.constructGrid({
            numberOfColumns: parseInt( numberOfColumns ),
            numberOfLines: parseInt( numberOfLines ),
            numberOfGrids: parseInt( numberOfGrids ),
            mapName: ''
        });
    };

document.onkeyup = keyboardShortcuts;


var manifest = [
        { id: 'bamboo1', src: '/static/images/bamboo1.png' }
    ];

PRELOAD = new createjs.LoadQueue();
PRELOAD.loadManifest( manifest, true );
PRELOAD.addEventListener( 'complete', function()
    {
    Map.load();
    });
};


/**
 * - 1, 2, ..., 9: Select a specific grid.
 * - a: See all the grids.
 */
function keyboardShortcuts( event: KeyboardEvent )
{
var key = event.key;
var selectGrid = [ '1', '2', '3', '4', '5', '6', '7', '8', '9' ];

for (var a = 0 ; a < selectGrid.length ; a++)
    {
    const gridId = selectGrid[ a ];

    if ( event.key === gridId )
        {
        Map.selectGrid( parseInt( selectGrid[ a ] ) - 1 );
        return;
        }
    }

if ( key.toLowerCase() === 'a' )
    {
    Map.selectGrid( -1 );
    }
}


/**
 * Update the number of grids/columns/lines value in the menu's input elements.
 */
export function updateMenuValues( mapInfo: MapInfo )
{
var numberOfGrids = Map.getAllGrids().length;

    // all grids have the same number of columns/lines, so we only need to check the numbers of one
var grid = Map.getGrid( 0 );

var numberOfColumns = grid.numberOfColumns;
var numberOfLines = grid.numberOfLines;

const gridsInput = document.getElementById( 'grids' ) as HTMLInputElement;
const columnsInput = document.getElementById( 'columns' ) as HTMLInputElement;
const linesInput = document.getElementById( 'lines' ) as HTMLInputElement;
const mapNameInput = document.getElementById( 'mapName' ) as HTMLInputElement;

gridsInput.value = numberOfGrids.toString();
columnsInput.value = numberOfColumns;
linesInput.value = numberOfLines;
mapNameInput.value = mapInfo.mapName;

Map.updateTilesLeft();
}
