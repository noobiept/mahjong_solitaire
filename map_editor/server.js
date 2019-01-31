const Express = require( 'express' );
const BodyParser = require( 'body-parser' );
const Path = require( 'path' );
const Fs = require( 'fs' );

const app = Express();
const port = 8080;

app.use( BodyParser.json() );
app.use( Express.static( Path.join( __dirname, 'static' ) ) );
app.use( '/static', Express.static( Path.join( __dirname, '..' ) ) );


/**
 * Update or create a new map file based on the given data.
 */
app.post( '/save_map', function( req, res ) {
    const data = req.body.data;

    if ( !data ) {
        res.status( 400 ).send( "Need a 'body' argument." );
        return;
    }

    console.log( `Saving map: ${data.mapName}` );

    const filePath = Path.join( __dirname, `../maps/${data.mapName}.json` );
    const dataString = JSON.stringify( data, null, 4 );

    Fs.writeFileSync( filePath, dataString );

    return res.sendStatus( 200 );
} );


/**
 * Load an existing map.
 */
app.post( '/load_map', function( req, res ) {
    const mapName = req.body.mapName;

    if ( !mapName ) {
        res.status( 400 ).send( "Need a 'mapName' argument." );
        return;
    }

    console.log( `Loading map: ${mapName}` );

    const filePath = Path.join( __dirname, `../maps/${mapName}.json` );
    const content = Fs.readFileSync( filePath, 'utf8' );

    return res.send( content );
} );


app.listen( port, function() {
    console.log( `Running on port ${port}` );
} );
