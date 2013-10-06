/*
    Dependencies:

        - jquery : 2.0
        - createjs
            easeljs   : 0.7
            preloadjs : 0.4
            soundjs   : 0.5
            tweenjs   : 0.5


    to doo:
        - para gerar o mapa, fazer ao contrario, tipo ter o mapa vazio, e adicionar par a par, ate ter o mapa completo. assim garante-se k o mapa tem uma solucao
        
        
        - eh mahjongg solitaire, visto k o original mahjongg eh diferente, joga-se com 4 pessoas e tem regras diferentes

        - have different tick for drawing, and game logic
    
    links:
    
        - http://en.wikipedia.org/wiki/Mahjong_solitaire
        - http://en.wikipedia.org/wiki/Mahjong_tiles
        - http://pt.wikipedia.org/wiki/Mahjong

    Tiles images license:

        - Creative Commons Attribution-Share Alike 3.0 Unported (from wikipedia links above)
    
 */


var CANVAS;

var BASE_URL = '';

    // createjs
var STAGE;
var PRELOAD;

window.onload = function()
{
CANVAS = document.querySelector( '#mainCanvas' );

CANVAS.width = 800;
CANVAS.height = 600;

STAGE = new createjs.Stage( CANVAS );

centerCanvas( CANVAS );

createjs.Ticker.setInterval( 50 );

PRELOAD = new createjs.LoadQueue();

var manifest = [
        { id: 'bamboo1', src: BASE_URL + 'images/bamboo1.png' },
        { id: 'bamboo2', src: BASE_URL + 'images/bamboo2.png' },
        { id: 'bamboo3', src: BASE_URL + 'images/bamboo3.png' },
        { id: 'bamboo4', src: BASE_URL + 'images/bamboo4.png' },
        { id: 'bamboo5', src: BASE_URL + 'images/bamboo5.png' },
        { id: 'bamboo6', src: BASE_URL + 'images/bamboo6.png' },
        { id: 'bamboo7', src: BASE_URL + 'images/bamboo7.png' },
        { id: 'bamboo8', src: BASE_URL + 'images/bamboo8.png' },
        { id: 'bamboo9', src: BASE_URL + 'images/bamboo9.png' },
        { id: 'circle1', src: BASE_URL + 'images/circle1.png' },
        { id: 'circle2', src: BASE_URL + 'images/circle2.png' },
        { id: 'circle3', src: BASE_URL + 'images/circle3.png' },
        { id: 'circle4', src: BASE_URL + 'images/circle4.png' },
        { id: 'circle5', src: BASE_URL + 'images/circle5.png' },
        { id: 'circle6', src: BASE_URL + 'images/circle6.png' },
        { id: 'circle7', src: BASE_URL + 'images/circle7.png' },
        { id: 'circle8', src: BASE_URL + 'images/circle8.png' },
        { id: 'circle9', src: BASE_URL + 'images/circle9.png' }
    ];

PRELOAD.installPlugin( createjs.Sound );
//PRELOAD.addEventListener( 'progress', updateLoading );
PRELOAD.addEventListener( 'complete', startGame );
PRELOAD.loadManifest( manifest, true );
};



function startGame()
{
resetStuff();

new Tile({
    x: 100,
    y: 100,
    tileName: 'bamboo1'
    });

createjs.Ticker.on( 'tick', tick );
}


function resetStuff()
{

}

function pause()
{
createjs.Ticker.setPaused( true );
}


function resume()
{
createjs.Ticker.setPaused( false );
}



function tick( event )
{
if ( event.paused )
    {
    return;
    }

STAGE.update();
}