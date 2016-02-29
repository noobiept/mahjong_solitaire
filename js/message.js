var Message;
(function(Message) {


var HTML_ELEMENT;


Message.init = function()
{
HTML_ELEMENT = document.getElementById( 'Message' );

Message.center();
};


Message.show = function( text, center )
{
if ( center !== false )
    {
    Message.center();
    }

HTML_ELEMENT.style.display = 'block';
HTML_ELEMENT.innerHTML = text;
};


Message.hide = function()
{
HTML_ELEMENT.style.display = 'none';
};


Message.center = function()
{
var height = $( window ).outerHeight( true ) - $( '#GameMenu' ).outerHeight( true );

HTML_ELEMENT.style.top = (height / 2) + 'px';
};


})(Message || (Message = {}));
