CREATE TYPE STATUS AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');


CREATE TABLE IF NOT EXISTS customers (
    first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY,
	credit_card VARCHAR(64) NOT NULL,
	ewallet_balance INT CHECK (ewallet_balance>=0) NOT NULL
);


CREATE TABLE IF NOT EXISTS drivers (
    first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY,
	license_number CHAR(9) CHECK (length(license_number) = 9) UNIQUE NOT NULL,
	car_number CHAR(8) CHECK (length(car_number) = 8) UNIQUE NOT NULL,
	ewallet_balance INT CHECK (ewallet_balance>=0) NOT NULL,
	is_available BOOLEAN
);

CREATE TABLE IF NOT EXISTS rides (
    customer_email VARCHAR(64) references customers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	driver_email VARCHAR(64) references drivers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	start_location VARCHAR(64) NOT NULL,
	end_location VARCHAR(64) NOT NULL,
	departure_time TIME NOT NULL,
	departure_date DATE NOT NULL,
	price NUMERIC NOT NULL,
	status STATUS NOT NULL,
	id int AUTO INCREMENT,
	PRIMARY KEY id
);
	

CREATE TABLE IF NOT EXISTS groceriesorder (
	customer_email VARCHAR(64) references customers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	driver_email VARCHAR(64) references drivers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	select_grocery VARCHAR(64) NOT NULL,
	receiving_location VARCHAR(64) NOT NULL,
	order_time TIME NOT NULL,
	order_date DATE NOT NULL,
	price NUMERIC NOT NULL,
	status VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS businesses (
    fullname VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY,
	credit_card VARCHAR(64) NOT NULL, 
	ewallet_balance INT CHECK (ewallet_balance>=0)
);

CREATE TABLE IF NOT EXISTS transactions (
    customer_email VARCHAR(64) references customers(email),
	driver_email VARCHAR(64) references drivers(email),
	amount INT CHECK (amount>=0),
	id SERIAL PRIMARY KEY
);


CREATE TABLE IF NOT EXISTS foodorder (
    customer_email VARCHAR(64) references customers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	driver_email VARCHAR(64) references drivers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	select_restaurant VARCHAR(64) NOT NULL,
	receiving_location VARCHAR(64) NOT NULL,
	order_time TIME NOT NULL,
	order_date DATE NOT NULL,
	price NUMERIC NOT NULL,
	status VARCHAR(64) NOT NULL
);
