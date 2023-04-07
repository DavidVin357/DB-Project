# ? Cross-origin Resource Sharing - here it allows the view and core applications deployed on different ports to communicate. No need to know anything about it since it's only used once
from flask_cors import CORS, cross_origin
# ? Python's built-in library for JSON operations. Here, is used to convert JSON strings inpipto Python dictionaries and vice-versa
import json
# ? flask - library used to write REST API endpoints (functions in simple words) to communicate with the client (view) application's interactions
# ? request - is the default object used in the flask endpoints to get data from the requests
# ? Response - is the default HTTP Response object, defining the format of the returned data by this api
from flask import Flask, request, Response
# ? sqlalchemy is the main library we'll use here to interact with PostgresQL DBMS
import sqlalchemy
# ? Just a class to help while coding by suggesting methods etc. Can be totally removed if wanted, no change
from typing import Dict

import random

from datetime import date, time
# ? web-based applications written in flask are simply called apps are initialized in this format from the Flask base class. You may see the contents of `__name__` by hovering on it while debugging if you're curious
app = Flask(__name__)

# ? Just enabling the flask app to be able to communicate with any request source
CORS(app)

# ? building our `engine` object from a custom configuration string
# ? for this project, we'll use the default postgres user, on a database called `postgres` deployed on the same machine
YOUR_POSTGRES_PASSWORD = "postgres"
connection_string = f"postgresql://postgres:{YOUR_POSTGRES_PASSWORD}@localhost/postgres"
engine = sqlalchemy.create_engine(
    "postgresql://postgres:postgres@localhost/postgres"
)

# ? `db` - the database (connection) object will be used for executing queries on the connected database named `postgres` in our deployed Postgres DBMS
db = engine.connect()

# ? A dictionary containing
data_types = {
    'boolean': 'BOOL',
    'integer': 'INT',
    'text': 'TEXT',
    'time': 'TIME',
}


## GRAB ENDPOINTS START
@app.post("/driver-insert")
def insert_driver():
    data = request.data.decode()

    try:
        post_data = json.loads(data)
        post_data['ewallet_balance'] = 100
        post_data['is_available'] = True
        insert = {
            'name': 'drivers',
            'body': post_data,
            'valueTypes': {
                'email': 'TEXT',
                'first_name': 'TEXT',
                'last_name': 'TEXT',
                'license_number': 'TEXT',
                'car_number': 'TEXT',
                'ewallet_balance': 'INT',
                'is_available': 'BOOL'
            }
        }

        statement = generate_insert_table_statement(insert)
        db.execute(statement)
        db.commit()
        return Response(data)

    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403)

@app.patch("/switch-availability")
def switch_availability():
    data = request.data.decode()
    try:
        post_data = json.loads(data)

        update_availability_statement = sqlalchemy.text(f"""
         UPDATE drivers 
         SET is_available = NOT is_available 
         WHERE email = '{post_data['email']}'  
         ;
        """)

        db.execute(update_availability_statement)
        db.commit()
        return Response(data)

    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403)

@app.post("/customer-insert")
def insert_customer():
    data = request.data.decode()
    try:
        post_data = json.loads(data)
        post_data['ewallet_balance'] = 100
        insert = {
            'name': 'customers',
            'body': post_data,
            'valueTypes': {
                'email': 'TEXT',
                'first_name': 'TEXT',
                'last_name': 'TEXT',
                'ewallet_balance': 'INT',
                'credit_card': 'TEXT'
            }
        }

        statement = generate_insert_table_statement(insert)
        db.execute(statement)
        db.commit()
        return Response(data)

    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403)


@app.post("/topup-insert")
def insert_topup():
    data = request.data.decode()
    try:
        post_data = json.loads(data)
        
        insert_topup = {
            'name': 'topups',
            'body': post_data,
            'valueTypes': {
                'customer_email': 'TEXT',
                'amount': 'INT'
            }
        }
        insert_topup_statement = generate_insert_table_statement(insert_topup)
        update_balance_statement = sqlalchemy.text(f"""
        UPDATE customers
        SET ewallet_balance = ewallet_balance + {post_data['amount']}
        WHERE email = '{post_data['customer_email']}'
        ;
        """)
        db.execute(insert_topup_statement)
        db.execute(update_balance_statement)
        db.commit()
        return Response(data)
    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403)


@app.post("/ride-insert")
def insert_ride():
    data = request.data.decode()
    try:
        post_data = json.loads(data)
        
        # Get random available driver
        random_driver_statement = sqlalchemy.text("""
        SELECT d.email 
        FROM drivers d
        WHERE d.is_available IS TRUE 
        ORDER BY RANDOM()
        LIMIT 1
        """) 
        res = db.execute(random_driver_statement)

        first_driver = res.first()
        if first_driver is None:
            return Response('No drivers available!', 403)
        
        random_driver_email = first_driver[0]

        # Set price, status, available driver email
        post_data['price'] = random.randint(1, 100)
        post_data['status'] = 'PENDING'
        post_data['driver_email'] = random_driver_email

        # Insert pending transaction and return its id
        transaction_insert_statement = sqlalchemy.text(f"""
            INSERT INTO transactions (customer_email, driver_email, amount, status)
            VALUES ('{post_data['customer_email']}',
                    '{post_data['driver_email']}',
                     {post_data['price']},
                    'PENDING'
               )
            RETURNING id
               ;
        """)
        transaction_id = db.execute(transaction_insert_statement).first()[0]

        post_data['transaction_id'] = transaction_id

        # Insert pending ride 
        ride_insert = {
            'name': 'rides',
            'body': post_data,
            'valueTypes': {
                'customer_email': 'TEXT',
                'driver_email': 'TEXT',
                'start_location': 'TEXT',
                'end_location': 'TEXT',
                'departure_time': 'TIME',
                'departure_date': 'DATE',
                'price': 'INT',
                'status': 'TEXT',
                'transaction_id': 'INT'
            }
        }
        
        ride_insert_statement = generate_insert_table_statement(ride_insert)

        db.execute(ride_insert_statement)
        db.commit()
        return Response(data)
    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403)

@app.put("/ride-confirm")
def confirm_ride():
    try:
        data = request.data.decode()
        post_data = json.loads(data)

        # Confirm ride and transaction
        confirm_statement = sqlalchemy.text(f"""
                UPDATE rides
                SET status = 'CONFIRMED' 
                WHERE id='{post_data['id']}'
                ;

                UPDATE transactions
                SET status = 'CONFIRMED'
                WHERE id = ( SELECT transaction_id
                             FROM rides
                             WHERE id ={post_data['id']}
                           );
                """)
        # Add ride price to the driver's ewallet and set the availability to FALSE
        deposit_statement = sqlalchemy.text(f"""
        UPDATE drivers
        SET is_available = FALSE, ewallet_balance = ewallet_balance + price
        FROM rides
        WHERE 
        rides.id = '{post_data['id']}'
        AND
        drivers.email = rides.driver_email
        ;"""
    )
        # Deduct price from customer's ewallet
        deduct_statement = sqlalchemy.text(f"""
        UPDATE customers
        SET ewallet_balance = ewallet_balance - price
        FROM rides
        WHERE 
        rides.id = '{post_data['id']}'
        AND
        customers.email = rides.customer_email
        ;
        """)     
        
        db.execute(confirm_statement)
        db.execute(deposit_statement)
        db.execute(deduct_statement)

        db.commit()
        return Response(data)
    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403) 

@app.put("/ride-cancel")
def cancel_ride():
    try:
        data = request.data.decode()
        post_data = json.loads(data)

        cancel_driver_order_statement = sqlalchemy.text(f"""
        UPDATE drivers
        SET is_available = TRUE, ewallet_balance = ewallet_balance - price
        FROM rides
        WHERE 
        rides.id = '{post_data['id']}'
        AND
        drivers.email = rides.driver_email
        ;"""
    )

        return_money_statement = sqlalchemy.text(f"""
        UPDATE customers
        SET ewallet_balance = ewallet_balance + price
        FROM rides
        WHERE 
        rides.id = '{post_data['id']}'
        AND
        customers.email = rides.customer_email
        ;
        """)     

        transaction_id = db.execute(sqlalchemy.text(f"""
                SELECT transaction_id 
                from rides WHERE id = '{post_data['id']}';""")).first()[0]
        
        delete_ride_statement = generate_delete_statement(details={
            'tableName': 'rides',
            'primaryKeyName': 'id',
            'primaryKeyValue': post_data['id']
            })
        
        delete_transaction_statement = generate_delete_statement(details={
            'tableName': 'transactions',
            'primaryKeyName': 'id',
            'primaryKeyValue': transaction_id
            })
        
        db.execute(return_money_statement)
        db.execute(cancel_driver_order_statement)
        db.execute(delete_ride_statement)
        db.execute(delete_transaction_statement)

        db.commit()
        return Response(data)
    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403) 
    
@app.post("/grocery-insert")
def insert_grocery():
    data = request.data.decode()
    try:
        post_data = json.loads(data)

        random_driver_statement = sqlalchemy.text("""
        SELECT d.email
        FROM drivers d
        WHERE d.is_available IS TRUE
        ORDER BY RANDOM()
        LIMIT 1
        """) 
        res = db.execute(random_driver_statement)
        
        first_driver = res.first()
        if first_driver is None:
            return Response('No drivers available!', 403)
        
        random_driver_email = first_driver[0]


        post_data['price'] = random.randint(1, 101)
        post_data['status'] = 'PENDING'
        post_data['driver_email'] = random_driver_email
        
        # Insert pending transaction and return its id
        transaction_insert_statement = sqlalchemy.text(f"""
            INSERT INTO transactions (customer_email, driver_email, amount, status)
            VALUES ('{post_data['customer_email']}',
                    '{post_data['driver_email']}',
                     {post_data['price']},
                    'PENDING'
               )
            RETURNING id
               ;
        """)
        transaction_id = db.execute(transaction_insert_statement).first()[0]
        post_data['transaction_id'] = transaction_id
        
        insert = {
            'name': 'groceriesorder',
            'body': post_data,
            'valueTypes': {
                'customer_email': 'TEXT',
                'driver_email': 'TEXT',
                'select_grocery': 'TEXT',
                'receiving_location': 'TEXT',
                'order_time': 'TIME',
                'order_date': 'DATE',
                'price': 'INT',
                'status': 'TEXT',
                'transaction_id': 'INT'
            }
        }
        statement = generate_insert_table_statement(insert)
        db.execute(statement)
        db.commit()
        return Response(data)
    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403)    
    
@app.put("/groceries-cancel")
def cancel_groceries():
    try:
        data = request.data.decode()
        post_data = json.loads(data)

        cancel_driver_order_statement = sqlalchemy.text(f"""
        UPDATE drivers
        SET is_available = TRUE, ewallet_balance = ewallet_balance - price
        FROM groceriesorder
        WHERE 
        groceriesorder.id = '{post_data['id']}'
        AND
        drivers.email = groceriesorder.driver_email
        ;"""
    )

        return_money_statement = sqlalchemy.text(f"""
        UPDATE customers
        SET ewallet_balance = ewallet_balance + price
        FROM groceriesorder
        WHERE 
        groceriesorder.id = '{post_data['id']}'
        AND
        customers.email = groceriesorder.customer_email
        ;
        """)     


        delete_statement = generate_delete_statement(details={
            'tableName': 'groceriesorder',
            'primaryKeyName': 'id',
            'primaryKeyValue': post_data['id']
            })
        
        db.execute(return_money_statement)
        db.execute(cancel_driver_order_statement)
        db.execute(delete_statement)

        db.commit()
        return Response(data)
    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403) 


@app.post("/food-insert")
def insert_food():
    data = request.data.decode()
    try:
        post_data = json.loads(data)
        
        # Get random available driver
        random_driver_statement = sqlalchemy.text("""
        SELECT d.email
        FROM drivers d
        WHERE d.is_available IS TRUE
        ORDER BY RANDOM()
        LIMIT 1
        """)
        
        res = db.execute(random_driver_statement)
        
        first_driver = res.first()
        if first_driver is None:
            return Response('No drivers available!', 403)
        
        random_driver_email = first_driver[0]
        
        post_data['price'] = random.randint(1, 100)
        post_data['status'] = 'PENDING'
        post_data['driver_email'] = random_driver_email
        
        # Insert pending transaction and return its id
        transaction_insert_statement = sqlalchemy.text(f"""
            INSERT INTO transactions (customer_email, driver_email, amount, status)
            VALUES ('{post_data['customer_email']}',
                    '{post_data['driver_email']}',
                     {post_data['price']},
                    'PENDING'
               )
            RETURNING id
               ;
        """)
        transaction_id = db.execute(transaction_insert_statement).first()[0]

        post_data['transaction_id'] = transaction_id
        
        insert = {
            'name': 'foodorder',
            'body': post_data,
            'valueTypes': {
                'customer_email': 'TEXT',
                'driver_email': 'TEXT',
                'select_restaurant': 'TEXT',
                'receiving_location': 'TEXT',
                'order_time': 'TIME',
                'order_date': 'DATE',
                'price': 'INT',
                'status': 'TEXT',
                'transaction_id': 'INT'
            }
        } 
        statement = generate_insert_table_statement(insert)
        db.execute(statement)

        db.commit()
        return Response(data)
    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403)

@app.put("/food-confirm")
def confirm_food():
    try:
        data = request.data.decode()
        post_data = json.loads(data)

        # Confirm food and transaction
        confirm_statement = sqlalchemy.text(f"""
                UPDATE foodorder
                SET status = 'CONFIRMED' 
                WHERE id='{post_data['id']}'
                ;

                UPDATE transactions
                SET status = 'CONFIRMED'
                WHERE id = ( SELECT transaction_id
                             FROM foodorder
                             WHERE id ={post_data['id']}
                           );
                """)
        # Add food price to the driver's ewallet and set the availability to FALSE
        deposit_statement = sqlalchemy.text(f"""
        UPDATE drivers
        SET is_available = FALSE, ewallet_balance = ewallet_balance + price
        FROM foodorder
        WHERE 
        foodorder.id = '{post_data['id']}'
        AND
        drivers.email = foodorder.driver_email
        ;"""
    )
        # Deduct price from customer's ewallet
        deduct_statement = sqlalchemy.text(f"""
        UPDATE customers
        SET ewallet_balance = ewallet_balance - price
        FROM foodorder
        WHERE 
        foodorder.id = '{post_data['id']}'
        AND
        customers.email = foodorder.customer_email
        ;
        """)     
        
        db.execute(confirm_statement)
        db.execute(deposit_statement)
        db.execute(deduct_statement)

        db.commit()
        return Response(data)
    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403) 

@app.put("/food-cancel")
def cancel_food():
    try:
        data = request.data.decode()
        post_data = json.loads(data)

        cancel_driver_order_statement = sqlalchemy.text(f"""
        UPDATE drivers
        SET is_available = TRUE, ewallet_balance = ewallet_balance - price
        FROM foodorder
        WHERE 
        foodorder.id = '{post_data['id']}'
        AND
        drivers.email = foodorder.driver_email
        ;"""
    )

        return_money_statement = sqlalchemy.text(f"""
        UPDATE customers
        SET ewallet_balance = ewallet_balance + price
        FROM foodorder
        WHERE 
        foodorder.id = '{post_data['id']}'
        AND
        customers.email = foodorder.customer_email
        ;
        """)     


        delete_statement = generate_delete_statement(details={
            'tableName': 'foodorder',
            'primaryKeyName': 'id',
            'primaryKeyValue': post_data['id']
            })
        
        db.execute(return_money_statement)
        db.execute(cancel_driver_order_statement)
        db.execute(delete_statement)

        db.commit()
        return Response(data)
    except Exception as e:
        db.rollback()
        return Response(str(e.__dict__['orig']), 403) 

## GRAB ENDPOINTS END

# ? @app.get is called a decorator, from the Flask class, converting a simple python function to a REST API endpoint (function)


# ? @app.get is called a decorator, from the Flask class, converting a simple python function to a REST API endpoint (function)

@app.get("/table")
def get_relation():
    # ? This method returns the contents of a table whose name (table-name) is given in the url `http://localhost:port/table?name=table-name`
    # ? Below is the default way of parsing the arguments from http url's using flask's request object
    relation_name = request.args.get('name', default="", type=str)
    # ? We use try-except statements for exception handling since any wrong query will crash the whole flow
    try:
        # ? Statements are built using f-strings - Python's formatted strings
        # ! Use cursors for better results
        statement = sqlalchemy.text(f"SELECT * FROM {relation_name};")
        # ? Results returned by the DBMS after execution are stored into res object defined in sqlalchemy (for reference)
        res = db.execute(statement)
        # ? committing the statement writes the db state to the disk; note that we use the concept of rollbacks for safe DB management
        db.commit()
        # ? Data is extracted from the res objects by the custom function for each query case
        # ! Note that you'll have to write custom handling methods for your custom queries
        data = generate_table_return_result(res)
        # ? Response object is instantiated with the formatted data and returned with the success code 200
        return Response(data, 200)
    except Exception as e:
        # ? We're rolling back at any case of failure
        db.rollback()
        # ? At any error case, the error is returned with the code 403, meaning invalid request
        # * You may customize it for different exception types, in case you may want
        return Response(str(e), 403)


# ? a flask decorator listening for POST requests at the url /table-create
@app.post("/table-create")
def create_table():
    # ? request.data returns the binary body of the POST request
    data = request.data.decode()
    try:
        # ? data is converted from stringified JSON to a Python dictionary
        table = json.loads(data)
        # ? data, or table, is an object containing keys to define column names and types of the table along with its name
        statement = generate_create_table_statement(table)
        # ? the remaining steps are the same
        db.execute(statement)
        db.commit()
        return Response(statement.text)
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)


@app.post("/table-insert")
# ? a flask decorator listening for POST requests at the url /table-insert and handles the entry insertion into the given table/relation
# * You might wonder why PUT or a similar request header was not used here. Fundamentally, they act as POST. So the code was kept simple here
def insert_into_table():
    # ? Steps are common in all of the POST behaviors. Refer to the statement generation for the explanatory
    data = request.data.decode()
    try:
        insertion = json.loads(data)
        statement = generate_insert_table_statement(insertion)
        db.execute(statement)
        db.commit()
        return Response(statement.text)
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)


@app.post("/table-update")
# ? a flask decorator listening for POST requests at the url /table-update and handles the entry updates in the given table/relation
def update_table():
    # ? Steps are common in all of the POST behaviors. Refer to the statement generation for the explanatory
    data = request.data.decode()
    try:
        update = json.loads(data)
        statement = generate_update_table_statement(update)
        db.execute(statement)
        db.commit()
        return Response(statement.text, 200)
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)


@app.post("/entry-delete")
# ? a flask decorator listening for POST requests at the url /entry-delete and handles the entry deletion in the given table/relation
def delete_row():
    # ? Steps are common in all of the POST behaviors. Refer to the statement generation for the explanatory
    data = request.data.decode()
    try:
        delete = json.loads(data)
        statement = generate_delete_statement(delete)
        db.execute(statement)
        db.commit()
        return Response(statement.text)
    except Exception as e:
        db.rollback()
        return Response(str(e), 403)

    
def generate_table_return_result(res):
    # ? An empty Python list to store the entries/rows/tuples of the relation/table
    rows = []

    # ? keys of the SELECT query result are the columns/fields of the table/relation
    columns = list(res.keys())

    # ? Constructing the list of tuples/rows, basically, restructuring the object format
    for row_number, row in enumerate(res):
        rows.append({})
        for column_number, value in enumerate(row):
            rows[row_number][columns[column_number]] = value

    # ? JSON object with the relation data
    output = {}
    output["columns"] = columns  # ? Stores the fields
    output["rows"] = rows  # ? Stores the tuples
    print(output)
    """
        The returned object format:
        {
            "columns": ["a","b","c"],
            "rows": [
                {"a":1,"b":2,"c":3},
                {"a":4,"b":5,"c":6}
            ]
        }
    """

    def json_serializer(obj):
        if isinstance(obj, (time, date)):
            return obj.isoformat()
        else:
            return str(obj)
    # ? Returns the stringified JSON object
    return json.dumps(output, default=json_serializer)


def generate_delete_statement(details: Dict):
    # ? Fetches the entry id for the table name
    table_name = details["tableName"]
    primary_key_name = details["primaryKeyName"]
    primary_key_value = "'" + details["primaryKeyValue"] + "'" if type(details["primaryKeyValue"]) is str else details["primaryKeyValue"]
    # ? Generates the deletion query for the given entry with the id
    statement = f"DELETE FROM {table_name} WHERE {primary_key_name}={primary_key_value};"
    return sqlalchemy.text(statement)


def generate_update_table_statement(update: Dict):

    # ? Fetching the table name, entry/tuple id and the update body
    table_name = update["name"]
    id = update["id"]
    body = update["body"]

    # ? Default for the SQL update statement
    statement = f"UPDATE {table_name} SET "
    # ? Constructing column-to-value maps looping
    for key, value in body.items():
        statement += f"{key}=\'{value}\',"

    # ?Finalizing the update statement with table and row details and returning
    statement = statement[:-1]+f" WHERE {table_name}.id={id};"
    return sqlalchemy.text(statement)


def generate_insert_table_statement(insertion: Dict):
    # ? Fetching table name and the rows/tuples body object from the request
    table_name = insertion["name"]
    body = insertion["body"]
    valueTypes = insertion["valueTypes"]

    # ? Generating the default insert statement template
    statement = f"INSERT INTO {table_name}  "

    # ? Appending the entries with their corresponding columns
    column_names = "("
    column_values = "("
    for key, value in body.items():
        column_names += (key+",")
        if valueTypes[key] == "TEXT" or valueTypes[key] == "TIME" or valueTypes[key] == "DATE":
            column_values += (f"\'{value}\',")
        else:
            column_values += (f"{value},")

    # ? Removing the last default comma
    column_names = column_names[:-1]+")"
    column_values = column_values[:-1]+")"

    # ? Combining it all into one statement and returning
    #! You may try to expand it to multiple tuple insertion in another method
    statement = statement + column_names+" VALUES "+column_values+";"
    return sqlalchemy.text(statement)


def generate_create_table_statement(table: Dict):
    # ? First key is the name of the table
    table_name = table["name"]
    # ? Table body itself is a JSON object mapping field/column names to their values
    table_body = table["body"]
    # ? Default table creation template query is extended below. Note that we drop the existing one each time. You might improve this behavior if you will
    # ! ID is the case of simplicity
    statement = f"DROP TABLE IF EXISTS {table_name}; CREATE TABLE {table_name} (id serial NOT NULL PRIMARY KEY,"
    # ? As stated above, column names and types are appended to the creation query from the mapped JSON object
    for key, value in table_body.items():
        statement += (f"{key}"+" "+f"{value}"+",")
    # ? closing the final statement (by removing the last ',' and adding ');' termination and returning it
    statement = statement[:-1] + ");"
    return sqlalchemy.text(statement)

# ? This method can be used by waitress-serve CLI 
def create_app():
   return app

# ? The port where the debuggable DB management API is served
PORT = 2222
# ? Running the flask app on the localhost/0.0.0.0, port 2222
# ? Note that you may change the port, then update it in the view application too to make it work (don't if you don't have another application occupying it)
if __name__ == "__main__":
    app.run("0.0.0.0", PORT)
    # ? Uncomment the below lines and comment the above lines below `if __name__ == "__main__":` in order to run on the production server
    # ? Note that you may have to install waitress running `pip install waitress`
    # ? If you are willing to use waitress-serve command, please add `/home/sadm/.local/bin` to your ~/.bashrc
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=PORT)
