/*global createjs*/
'use strict';

var Sound;
(function(Sound) {


Sound.init = function()
{
var musicInstance = createjs.Sound.play( 'music', { loop: -1 } );

    // initialize the music control element
var audioControl = document.getElementById( 'AudioControl' );
audioControl.onclick = function()
    {
    musicInstance.muted = !musicInstance.muted;
    audioControl.classList.toggle( 'inactive' );
    };
audioControl.classList.remove( 'hidden' );
}


})(Sound || (Sound = {}));