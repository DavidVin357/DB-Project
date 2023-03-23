CREATE TABLE IF NOT EXISTS users (
    first_name VARCHAR(64) NOT NULL
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS drivers (
    first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL,
	email VARCHAR(64) PRIMARY KEY,
	licence_number CHAR(9),
	car_number CHAR(8)
);

CREATE TABLE IF NOT EXISTS rides (
    customer_email references customers(email),
	driver_email VARCHAR(64) references drivers(email),
	start_location VARCHAR(64) NOT NULL,
	end_location VARCHAR(64) NOT NULL,
	departure_time TIME NOT NULL,
	departure_date DATE NOT NULL,
	price NUMERIC NOT NULL,
	status VARCHAR(64) NOT NULL
);
	