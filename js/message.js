'use strict';

var Message;
(function(Message) {


var HTML_ELEMENT;
var TIMEOUT = null;


Message.init = function()
{
HTML_ELEMENT = document.getElementById( 'Message' );

Message.center();
HTML_ELEMENT.style.display = 'block';
};


Message.show = function( text, center= true, timeoutDuration= -1 )
{
cancelTimeout();

if ( center !== false )
    {
    Message.center();
    }

    // set the new message
HTML_ELEMENT.style.display = 'block';
HTML_ELEMENT.innerHTML = text;

if ( timeoutDuration > 0 )
    {
    TIMEOUT = window.setTimeout( function()
        {
        Message.hide();
        TIMEOUT = null;

        }, timeoutDuration );
    }
};


Message.hide = function()
{
cancelTimeout();
HTML_ELEMENT.style.display = 'none';
};


Message.center = function()
{
var height = $( window ).outerHeight( true ) - $( '#GameMenu' ).outerHeight( true );

HTML_ELEMENT.style.top = (height / 2) + 'px';
};


function cancelTimeout()
{
    // a timeout is active, from a previous call. cancel it
if ( TIMEOUT !== null )
    {
    window.clearTimeout( TIMEOUT );
    TIMEOUT = null;
    }
}


})(Message || (Message = {}));
