var bodyParser = require( 'body-parser' );
var express    = require( 'express' );
var fs         = require( 'fs' );
var path       = require( 'path' );

var twitter = require( './twitter.js' );

var app = express();

app.use( express.static( 'public' ) );
app.use(bodyParser.urlencoded({ extended: true }));

app.all( process.env.BOT_POST_ENDPOINT, twitter.postStatusUpdate);

var listener = app.listen( process.env.PORT, () => {
    console.log( 'Running on port ' + listener.address().port );
} );