CREATE TYPE status AS ENUM ('PENDING', 'CONFIRMED');

CREATE TABLE IF NOT EXISTS customers (
    first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY,
	credit_card VARCHAR(20) NOT NULL,
	ewallet_balance NUMERIC CHECK (ewallet_balance>=0) NOT NULL
);

CREATE TABLE IF NOT EXISTS topups (
  id SERIAL PRIMARY KEY,
  amount NUMERIC NOT NULL CHECK (amount>0),
  customer_email VARCHAR(64) references customers(email)
);

CREATE TABLE IF NOT EXISTS drivers (
	email VARCHAR(64) PRIMARY KEY,
    first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	license_number CHAR(9) CHECK (length(license_number) = 9) UNIQUE NOT NULL,
	car_number CHAR(8) CHECK (length(car_number) = 8) UNIQUE NOT NULL,
	ewallet_balance NUMERIC CHECK (ewallet_balance>=0) NOT NULL,
	is_available BOOLEAN
);

CREATE TABLE IF NOT EXISTS transactions (
	id SERIAL PRIMARY KEY,
    customer_email VARCHAR(64) references customers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	driver_email VARCHAR(64) references drivers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	amount INT CHECK (amount>=0),
	status STATUS NOT NULL
);

CREATE TABLE IF NOT EXISTS rides (
	id SERIAL PRIMARY KEY,
    customer_email VARCHAR(64) references customers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	driver_email VARCHAR(64) references drivers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	start_location VARCHAR(64) NOT NULL,
	end_location VARCHAR(64) NOT NULL,
	departure_time TIME NOT NULL,
	departure_date DATE NOT NULL,
	price NUMERIC NOT NULL,
	status STATUS NOT NULL,
	transaction_id INT references transactions(id) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED
);
	
CREATE TABLE IF NOT EXISTS groceriesorder (
	id SERIAL PRIMARY KEY,
	customer_email VARCHAR(64) references customers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	driver_email VARCHAR(64) references drivers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	select_grocery VARCHAR(64) NOT NULL,
	receiving_location VARCHAR(64) NOT NULL,
	order_time TIME NOT NULL,
	order_date DATE NOT NULL,
	price NUMERIC NOT NULL,
	status VARCHAR(64) NOT NULL,
	transaction_id INT references transactions(id)
);

CREATE TABLE IF NOT EXISTS businesses (
	email VARCHAR(64) PRIMARY KEY,
    fullname VARCHAR(64) NOT NULL,
	credit_card VARCHAR(20) NOT NULL, 
	ewallet_balance NUMERIC CHECK (ewallet_balance>=0)
);

CREATE TABLE IF NOT EXISTS foodorder (
	id SERIAL PRIMARY KEY,
    customer_email VARCHAR(64) references customers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	driver_email VARCHAR(64) references drivers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	select_restaurant VARCHAR(64) NOT NULL,
	receiving_location VARCHAR(64) NOT NULL,
	order_time TIME NOT NULL,
	order_date DATE NOT NULL,
	price NUMERIC NOT NULL,
	status VARCHAR(64) NOT NULL,
	transaction_id INT references transactions(id)
);