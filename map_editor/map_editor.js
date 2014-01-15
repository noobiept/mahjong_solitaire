/*
    to doo:

        - i have to add +1 column otherwise when adding a tile to the last column it gives an error...

        - add keyboard shortcuts to select the grids
 */

var CANVAS;
var STAGE;
var PRELOAD;


window.onload = function()
{
CANVAS = document.querySelector( '#canvas' );

CANVAS.width = 1600;
CANVAS.height = 800;

STAGE = new createjs.Stage( CANVAS );

createjs.Ticker.addEventListener('tick', function()
    {
    STAGE.update();
    });


document.querySelector( '#saveMap' ).onclick = Map.save;
document.querySelector( '#loadMap' ).onclick = function()
    {
    var mapName = document.querySelector( '#mapName' ).value;

    Map.load( mapName );
    };

document.querySelector( '#Grids-seeAll').onclick = function()
    {
    Map.selectGrid( -1 );
    };


document.querySelector( '#newMap' ).onclick = function()
    {
    var numberOfGrids = document.querySelector( '#grids' ).value;
    var numberOfColumns = document.querySelector( '#columns' ).value;
    var numberOfLines = document.querySelector( '#lines' ).value;

    Map.clear();

    Map.constructGrid({
            numberOfColumns: parseInt( numberOfColumns ),
            numberOfLines: parseInt( numberOfLines ),
            numberOfGrids: parseInt( numberOfGrids ),
            mapName: ''
        });
    };


PRELOAD = new createjs.LoadQueue();

var manifest = [
        { id: 'bamboo1', src: '/static/images/bamboo1.png' }
    ];

PRELOAD.loadManifest( manifest, true );

PRELOAD.addEventListener( 'complete', function()
    {
    Map.load();
    });
};






/*
    the number of grids/columns/lines value in the menu's input element
 */

function updateMenuValues( mapInfo )
{
var numberOfGrids = Map.getAllGrids().length;

    // all grids have the same number of columns/lines, so we only need to check the numbers of one
var grid = Map.getGrid( 0 );

var numberOfColumns = grid.numberOfColumns;
var numberOfLines = grid.numberOfLines;

document.querySelector( '#grids' ).value = numberOfGrids;
document.querySelector( '#columns' ).value = numberOfColumns;
document.querySelector( '#lines' ).value = numberOfLines;
document.querySelector( '#mapName' ).value = mapInfo.mapName;

Map.updateTilesLeft();
}





/*
 * For jquery ajax to work (server only)
 */

jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
