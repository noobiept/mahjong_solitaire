(function()
{
function MainMenu()
{

}

var MENU;

var MAPS_AVAILABLE = [
        { mapName: 'pyramid', mapDescription: PYRAMID }
    ];
var SELECTED_MAP = 0;


MainMenu.init = function()
{
MENU = document.querySelector( '#MainMenu' );

var startGame = MENU.querySelector( '#MainMenu-startGame' );
var highScore = MENU.querySelector( '#MainMenu-highScore' );


startGame.onclick = function( event )
    {
    MainMenu.hide();

    Game.start( MAPS_AVAILABLE[ SELECTED_MAP ] );

    event.stopPropagation();
    };

highScore.onclick = function( event )
    {
    MainMenu.hide();

    MainMenu.openHighScore();

    event.stopPropagation();
    };

centerElement( MENU );
};


MainMenu.open = function()
{
Game.resetStuff();

$( MENU ).css( 'display', 'block' );
};



MainMenu.hide = function()
{
$( MENU ).css( 'display', 'none' );
};



MainMenu.openHighScore = function()
{

};



window.MainMenu = MainMenu;

}(window));