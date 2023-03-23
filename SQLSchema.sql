CREATE TABLE IF NOT EXISTS users (
    first_name VARCHAR(64) NOT NULL
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS drivers (
    first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY,
	license_number CHAR(9) UNIQUE NOT NULL,
	car_number CHAR(8) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS rides (
    customer_email references customers(email) NOT NULL,
	driver_email VARCHAR(64) references drivers(email) NOT NULl,
	start_location VARCHAR(64) NOT NULL,
	end_location VARCHAR(64) NOT NULL,
	departure_time TIME NOT NULL,
	departure_date DATE NOT NULL,
	price NUMERIC NOT NULL,
	status VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
    first_name VARCHAR(64) NOT NULL
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY
	credit_card VARCHAR(64) NOT NULL
	ewallet_balance INT CHECK (ewallet_balance>=0)
);

CREATE TABLE IF NOT EXISTS businesses (
    fullname VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY,
	credit_card VARCHAR(64) NOT NULL, 
	ewallet_balance INT CHECK (ewallet_balance>=0)
);

CREATE TABLE IF NOT EXISTS transactions (
    customer_email references customers(email),
	business_email references businesses(email),
	amount INT CHECK (amount>=0),
	customer_ewallet references customers(ewallet_balance)
	business_ewallet references businesses(ewallet_balance)
	transaction_time TIME NOT NULL,
	transaction_date DATE NOT NULL
);
