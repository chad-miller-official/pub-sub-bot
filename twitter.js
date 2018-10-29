var twit     = require( 'twit' );
var sandwich = require( './sandwich.js' );

const TWITTER = new twit( {
    consumer_key:        process.env.CONSUMER_KEY,
    consumer_secret:     process.env.CONSUMER_SECRET,
    access_token:        process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
} );

function postStatusUpdate( req, res )
{
    var sandwichComps = sandwich.getSandwichComps();
    var sandwichName  = sandwichComps['baseSandwich'];
    var bread         = sandwichComps['bread'];
    var cheese        = sandwichComps['cheese'];
    var extras        = sandwichComps['extras'];
    var toppings      = sandwichComps['toppings'];
    var condiments    = sandwichComps['condiments'];
    var heatingOption = sandwichComps['heatingOption'];
  
    var breadLabel = bread[0].toLowerCase();
  
    if( breadLabel === 'italian 5 grain' )
        breadLabel = 'Italian 5 grain';

    var statusClauses = [ sandwichName + ' on ' + breadLabel ];
  
    if( heatingOption )
        statusClauses.push( heatingOption[0].toLowerCase() );
  
    if( cheese || extras || toppings || condiments )
    {
        var additionalClause = 'with ';
        var statusParts      = [];
            
        if( cheese )
        {
            var cheeseLabel = cheese[0].toLowerCase();
          
            switch( cheeseLabel )
            {
                case 'swiss':
                    cheeseLabel = 'Swiss';
                    break;
                case 'white american':
                    cheeseLabel = 'white American';
                    break;
                case 'yellow american':
                    cheeseLabel = 'yellow American';
                    break;
            }

            statusParts.push( cheeseLabel );
        }
      
        if( toppings )
        {
            toppings.forEach( ( t ) => {
                statusParts.push( t.toLowerCase() );
            } );
        }
      
        if( condiments )
        {
            condiments.forEach( ( c ) => {
                statusParts.push( c.toLowerCase() );
            } );
        }
      
        if( extras )
        {
            extras.forEach( ( e ) => {
                statusParts.push( e.toLowerCase() )
            } );
        }
      
        if( statusParts.length == 1 )
            additionalClause += statusParts[0];
        else if( statusParts.length == 2 )
            additionalClause += statusParts[0] + ' and ' + statusParts[1];
        else
        {
            statusParts.slice( 0, statusParts.length - 1 ).forEach( ( p ) => {
                additionalClause += p + ', '
            } );

            additionalClause += 'and ' + statusParts[statusParts.length - 1];
        }
      
        statusClauses.push( additionalClause );
    }
  
    var postData = {
        status: statusClauses.join( ', ' ),
    };
  
    TWITTER.post( 'statuses/update', postData, ( err, data, response ) => {
        if( err )
        {
            console.log( 'Error calling statuses/update route.' );
            res.sendStatus( 500 );
            throw err;
        }
        
        res.sendStatus( 200 );
    } );
}

module.exports = {
    'postStatusUpdate': postStatusUpdate,
};
