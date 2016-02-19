/*global AppStorage*/

(function(window)
{
function HighScore()
{

}

    // HIGH_SCORE = { mapName: [ time1, time2, ... ] }
var HIGH_SCORE = {};

    // max. number of scores saved per map (the top 5 scores)
var MAX_SCORES_SAVED = 5;


HighScore.load = function( score )
{
if ( score )
    {
    HIGH_SCORE = score;
    }
};


HighScore.save = function()
{
AppStorage.setData({ mahjong_high_score: HIGH_SCORE });
};


/**
    @param {String} mapName
    @param {Number} score
 */

HighScore.add = function( mapName, score )
{
if ( !HIGH_SCORE[ mapName ] )
    {
    HIGH_SCORE[ mapName ] = [];
    }

HIGH_SCORE[ mapName ].push( score );

    // have the better scores first (better means a lesser value (finished the map faster))
HIGH_SCORE[ mapName ].sort( function( a, b )
    {
    return a - b;
    });

    // if we pass the limit, remove one of the lesser scores
if ( HIGH_SCORE[ mapName ].length > MAX_SCORES_SAVED )
    {
    HIGH_SCORE[ mapName ].pop();
    }

HighScore.save();
};


HighScore.getAll = function()
{
return HIGH_SCORE;
};


HighScore.get = function( mapName )
{
return HIGH_SCORE[ mapName ];
};


HighScore.removeAll = function()
{
HIGH_SCORE.length = 0;

AppStorage.removeData( [ 'mahjong_high_score' ] );
};


window.HighScore = HighScore;
}(window));
