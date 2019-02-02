import * as AppStorage from './app_storage.js';


export interface Score {
    [mapName: string]: number[];
}


    // HIGH_SCORE = { mapName: [ time1, time2, ... ] }
var HIGH_SCORE: Score = {};

    // max. number of scores saved per map (the top 5 scores)
var MAX_SCORES_SAVED = 5;


export function load( score: Score )
{
if ( score )
    {
    HIGH_SCORE = score;
    }
}


export function save()
{
AppStorage.setData({ mahjong_high_score: HIGH_SCORE });
}


export function add( mapName: string, score: number )
{
if ( !HIGH_SCORE[ mapName ] )
    {
    HIGH_SCORE[ mapName ] = [];
    }

HIGH_SCORE[ mapName ].push( score );

    // have the better scores first (better means an higher value)
HIGH_SCORE[ mapName ].sort( function( a, b )
    {
    return b - a;
    });

    // if we pass the limit, remove one of the lesser scores
if ( HIGH_SCORE[ mapName ].length > MAX_SCORES_SAVED )
    {
    HIGH_SCORE[ mapName ].pop();
    }

save();
}


export function getAll()
{
return HIGH_SCORE;
}


export function get( mapName: string )
{
return HIGH_SCORE[ mapName ];
}


export function removeAll()
{
HIGH_SCORE = {};
AppStorage.removeData( [ 'mahjong_high_score' ] );
}


export function getMaxScoresSaved()
{
return MAX_SCORES_SAVED;
}
