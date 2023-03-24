CREATE TABLE IF NOT EXISTS customers (
    first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS drivers (
    first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY,
	license_number CHAR(9) UNIQUE NOT NULL CHECK (length(license_number) = 9),
	car_number CHAR(8) UNIQUE NOT NULL CHECK (length(car_number) = 8)
);

CREATE TABLE IF NOT EXISTS rides (
    customer_email VARCHAR(64) references customers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	driver_email VARCHAR(64) references drivers(email) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED,
	start_location VARCHAR(64) NOT NULL,
	end_location VARCHAR(64) NOT NULL,
	departure_time TIME NOT NULL,
	departure_date DATE NOT NULL,
	price NUMERIC NOT NULL,
	status VARCHAR(64) NOT NULL
);
	