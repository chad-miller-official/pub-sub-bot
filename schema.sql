create table tb_uom
(
    uom   integer primary key,
    label varchar(10) not null unique
);

insert into tb_uom ( uom, label )
     values ( 1, 'Half Roll' ),
            ( 2, 'OZ' ),
            ( 3, 'Slice' ),
            ( 4, 'Piece' ),
            ( 5, 'Ring' ),
            ( 6, 'TSP' ),
            ( 7, 'TBSP' );

create table tb_base_sandwich
(
    base_sandwich                integer primary key,
    name                         varchar(50) not null unique,
    can_customize_cheese         integer not null default 1,
    can_customize_extras         integer not null default 1,
    can_customize_toppings       integer not null default 1,
    can_customize_condiments     integer not null default 1,
    can_customize_heating_option integer not null default 1
);

-- Fully customizable
insert into tb_base_sandwich ( name )
     values ( 'American Sub' ),
            ( 'BLT Hot Sub' ),
            ( 'Chicken Salad Sub' ),
            ( 'Chicken Tender Sub' ),
            ( 'Cuban Sub' ),
            ( 'Deli Mojo Pork Sub' ),
            ( 'Deluxe Sub' ),
            ( 'Egg Salad Sub' ),
            ( 'EverRoast Sub' ),
            ( 'Ham and Turkey Sub' ),
            ( 'Ham Sub' ),
            ( 'Homestyle Beef Meatball Sub' ),
            ( 'Italian Sub' ),
            ( 'Jerk Turkey & Gouda Sub' ),
            ( 'Maple Honey Turkey Sub' ),
            ( 'Philly Cheese Sub' ), --
            ( 'Roast Beef Sub' ),
            ( 'Tuna Salad Sub' ),
            ( 'Turkey Sub' ),
            ( 'Ultimate Sub' ),
            ( 'Veggie Sub' );
            
-- Partially customizable
insert into tb_base_sandwich
(
    name,
    can_customize_cheese,
    can_customize_extras,
    can_customize_toppings,
    can_customize_condiments,
    can_customize_heating_option
)
values ( 'Atlanta Falcons Sub', 0, 0, 0, 0, 0 ),
       ( 'Havana Bold Sub', 0, 1, 0, 1, 1 ),
       ( 'Chicken Cordon Bleu Sub Hot', 0, 0, 0, 0, 1 ),
       ( 'Turkey Cranberry Holiday Sub', 0, 0, 0, 0, 1 );

create table tb_bread
(
    bread                integer primary key,
    label                varchar(50) not null unique,
    calories             integer,
    calories_per_amount  double precision default 1,
    amount_uom           integer references tb_uom default 1
);

insert into tb_bread ( label, calories )
     values ( 'Italian 5 Grain', 270 ),
            ( 'White', 240 ),
            ( 'Whole Wheat', 220 ),
            ( 'Flatbread', 240 );
            
create table tb_cheese
(
    cheese              integer primary key,
    label               varchar(50) not null unique,
    calories            integer,
    calories_per_amount double precision default 0.75,
    amount_uom          integer references tb_uom default 2
);

insert into tb_cheese ( label, calories )
     values ( 'Cheddar', 90 ),
            ( 'White American', 80 ),
            ( 'Muenster', 80 ),
            ( 'Yellow American', 80 ),
            ( 'Provolone', 80 ),
            ( 'Swiss', 80 );

create table tb_extra
(
    extra               integer primary key,
    label               varchar(50) not null unique,
    price               numeric(1, 2) not null,
    calories            integer,
    calories_per_amount double precision,
    amount_uom          integer references tb_uom
);

insert into tb_extra ( label, price, calories, calories_per_amount, amount_uom )
     values ( 'Double Meat', 1.50, 110, 3, 2 ),
            ( 'Hummus', 0.50, 40, 0.5, 2 ),
            ( 'Double Cheese', 0.5, null, null, null ),
            ( 'Bacon', 0.5, 60, 2, 3 ),
            ( 'Guacamole', 0.5, 45, 1, 2 );

create table tb_topping
(
    topping             integer primary key,
    label               varchar(50) not null unique,
    calories            integer,
    calories_per_amount double precision,
    amount_uom          integer references tb_uom
);

insert into tb_topping ( label, calories, calories_per_amount, amount_uom )
     values ( 'Banana Peppers', 0, 5, 4 ),
            ( 'Dill Pickles', 0, 5, 3 ),
            ( 'Onions', 5, 5, 5 ),
            ( 'Black Pepper', 0, 0.0625, 6 ),
            ( 'Black Olives', 15, 10, 4 ),
            ( 'Green Peppers', 0, 3, 5 ),
            ( 'Spinach', 0, 0.67, 2 ),
            ( 'Oregano', 0, 0.625, 6 ),
            ( 'Garlic Pickles', 0, 5, 3 ),
            ( 'Jalapeno Peppers', 0, 4, 4 ),
            ( 'Tomato', 10, 2, 3 ),
            ( 'Oil & Vinegar', 10, 0.125, 7 ),
            ( 'Cucumbers', 0, 3, 3 ),
            ( 'Lettuce', 0, 0.75, 2 ),
            ( 'Salt', 0, 0.0625, 6 );

create table tb_condiment
(
    condiment           integer primary key,
    label               varchar(50) not null unique,
    calories            integer,
    calories_per_amount double precision default 1,
    amount_uom          integer references tb_uom default 7
);

insert into tb_condiment ( label, calories )
     values ( 'Honey Mustard', 25 ),
            ( 'Spicy Mustard', 15 ),
            ( 'Mayonnaise', 110 ),
            ( 'Yellow Mustard', 10 );

create table tb_heating_option
(
    heating_option integer primary key,
    label          varchar(50) not null unique
);

insert into tb_heating_option ( label )
     values ( 'Pressed' ),
            ( 'Toasted' );

create table tb_selection_range
(
    selection_range        integer primary key,
    table_name varchar(50) unique,
    min_quantity           integer,
    max_quantity           integer,
    check ( max_quantity is null or max_quantity >= min_quantity )
);

insert into tb_selection_range ( table_name, min_quantity, max_quantity )
     values ( 'tb_bread', 1, 1 ),
            ( 'tb_cheese', 0, 1 ),
            ( 'tb_extra', 0, 2 ),
            ( 'tb_topping', 0, 4 ),
            ( 'tb_condiment', 0, 1 ),
            ( 'tb_heating_option', 0, 1 );