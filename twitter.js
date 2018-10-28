var twit = require( 'twit' );

var sandwich = require( './sandwich.js' );

var config = {
    twitter: {
        consumer_key:        process.env.CONSUMER_KEY,
        consumer_secret:     process.env.CONSUMER_SECRET,
        access_token:        process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    },
};

var TWITTER = new twit( config.twitter );

function getSandwichComps()
{
    var baseSandwich = sandwich.getBaseSandwich();
  
    var rval = {
        baseSandwich: baseSandwich['name'],
        bread:        sandwich.getBread(),
    };
  
    if( baseSandwich['can_customize_cheese'] )
        rval['cheese'] = sandwich.getCheese();
  
    if( baseSandwich['can_customize_extras'] )
        rval['extras'] = sandwich.getExtras();
  
    if( baseSandwich['can_customize_toppings'] )
        rval['toppings'] = sandwich.getToppings();
  
    if( baseSandwich['can_customize_condiments'] )
        rval['condiments'] = sandwich.getCondiments();
  
    if( baseSandwich['can_customize_heating_option'] )
        rval['heatingOption'] = sandwich.getHeatingOption();
  
    return rval;
}

function postStatusUpdate( req, res )
{
    var sandwichComps = getSandwichComps();
    var sandwichName  = sandwichComps['baseSandwich'];
    var bread         = sandwichComps['bread'];
    var cheese        = sandwichComps['cheese'];
    var extras        = sandwichComps['extras'];
    var toppings      = sandwichComps['toppings'];
    var condiments    = sandwichComps['condiments'];
    var heatingOption = sandwichComps['heatingOption'];

    var statusClauses = [ sandwichName + ' on ' + bread ];
  
    if( heatingOption )
        statusClauses.push( heatingOption );
  
    if( cheese || extras || toppings || condiments )
    {
        var additionalClause = 'with ';
  
        var statusParts = [];
      
        if( cheese )
            statusParts.push( cheese );
      
        if( extras )
        {
            extras.forEach( ( e ) => {
                statusParts.push( e )
            } );
        }
      
        if( toppings )
        {
            toppings.forEach( ( t ) => {
                statusParts.push( t );
            } );
        }
      
        if( condiments )
        {
            condiments.forEach( ( c ) => {
                statusParts.push( c );
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
        status: statusClauses.join( '; ' ),
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