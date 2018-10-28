var fs      = require( 'fs' );
var sqlite3 = require( 'better-sqlite3' );

const DB_FILE = './.data/sqlite.db';
var SQLITE    = new sqlite3( DB_FILE );

function _selectFromTable( tableName )
{
    var boundsQuery = `
select min_quantity,
       max_quantity
  from tb_selection_range
 where table_name = ?
`.trim();
    
    var boundsQueryParams = [ tableName ];
  
    var boundsStmt = SQLITE.prepare( boundsQuery );
    var boundsRow  = boundsStmt.get( tableName );
  
    var minQuantity = boundsRow.min_quantity;
    var maxQuantity = boundsRow.max_quantity;
  
    var limit = Math.floor( Math.random() * maxQuantity );
  
    if( !limit )
        limit = minQuantity;
  
    var itemsQuery  = 'select label from ' + tableName;
        itemsQuery += ' order by random()';
        itemsQuery += ' limit ' + limit;
    
    var rvalStmt = SQLITE.prepare( itemsQuery );
    var rvalAll  = rvalStmt.all();
    var rval     = rvalAll.map( r => r.label );

    return rval.length ? rval : null;
}

function getBaseSandwich()
{
    var sandwichQuery = `
  select name,
         can_customize_cheese,
         can_customize_extras,
         can_customize_toppings,
         can_customize_condiments,
         can_customize_heating_option
    from tb_base_sandwich
order by random()
   limit 1
`.trim();
  
    var rvalStmt = SQLITE.prepare( sandwichQuery );
    var rval     = rvalStmt.get();
  
    return rval;
}

function getBread()
{
    return _selectFromTable( 'tb_bread' );
}

function getCheese()
{
    return _selectFromTable( 'tb_cheese' );
}

function getExtras()
{
    return _selectFromTable( 'tb_extra' );
}

function getToppings()
{
    return _selectFromTable( 'tb_topping' );
}

function getCondiments()
{
    return _selectFromTable( 'tb_condiment' );
}

function getHeatingOption()
{
    return _selectFromTable( 'tb_heating_option' );
}

module.exports = {
    'getBaseSandwich':  getBaseSandwich,
    'getBread':         getBread,
    'getCheese':        getCheese,
    'getExtras':        getExtras,
    'getToppings':      getToppings,
    'getCondiments':    getCondiments,
    'getHeatingOption': getHeatingOption,
};