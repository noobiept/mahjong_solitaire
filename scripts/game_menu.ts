/*global Game, MainMenu*/
'use strict';

var GameMenu;
(function(GameMenu) {


    // reference to html elements
var GAME_MENU_CONTAINER;


GameMenu.init = function()
{
var gameMenu = document.querySelector( '#GameMenu' );

var shuffle = gameMenu.querySelector( '#GameMenu-shuffle' );
var shadow = document.querySelector( '#GameMenu-shadow' );
var shadowValue = shadow.querySelector( 'span' );
var help = document.getElementById( 'GameMenu-help' );
var restart = gameMenu.querySelector( '#GameMenu-restart' );
var quit = gameMenu.querySelector( '#GameMenu-quit' );

shuffle.onclick = function()
    {
    Game.getActiveMap().shuffle();
    Game.updateInformation();
    };

shadow.onclick = function()
    {
    var shadowOn = Game.getShadowOption();

    if ( shadowOn )
        {
        Game.setShadowOption( false );
        Game.unShadowTiles();

        $( shadowValue ).text( 'Off' );
        }

    else
        {
        Game.setShadowOption( true );
        Game.shadowTiles();

        $( shadowValue ).text( 'On' );
        }
    };

help.onclick = function()
    {
    Game.highlightRandomPair();
    };

restart.onclick = function()
    {
    Game.restart();
    };

quit.onclick = function()
    {
    MainMenu.open();
    };

GAME_MENU_CONTAINER = gameMenu;
};


GameMenu.show = function()
{
$( GAME_MENU_CONTAINER ).css( 'display', 'inline-flex' );
};


GameMenu.clear = function()
{
    // hide the html elements
$( GAME_MENU_CONTAINER ).css( 'display', 'none' );
};


})(GameMenu || (GameMenu = {}));
