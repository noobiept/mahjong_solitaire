(function(window)
{
function GameMenu()
{

}


GameMenu.updateInformation = function( mapObject )
{
GameMenu.updateTilesLeft();
GameMenu.updatePairsLeft( mapObject );
};


GameMenu.updateTilesLeft = function()
{
console.log( 'Tiles Left:', Tile.getAll().length );
};


GameMenu.updatePairsLeft = function( mapObject )
{
console.log( 'Pairs Left:', mapObject.howManySelectablePairs() );   //HERE
};


window.GameMenu = GameMenu;

}(window));