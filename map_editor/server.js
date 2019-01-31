const Express = require( 'express' );
const Path = require( 'path' );

const app = Express();
const port = 8080;

app.use( Express.static( Path.join( __dirname, 'static' ) ) );
app.use( '/static', Express.static( Path.join( __dirname, '..' ) ) );

app.listen( port, function() {
    console.log( `Running on port ${port}` );
} );
