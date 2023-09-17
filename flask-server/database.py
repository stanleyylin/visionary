#!/usr/bin/env python3
"""
Test psycopg with CockroachDB for Screen Time Tracking.
"""

import logging
import os
import random
import time
import uuid
from argparse import ArgumentParser, RawTextHelpFormatter

import psycopg
from psycopg.errors import SerializationFailure, Error
from psycopg.rows import namedtuple_row

from glasses import FrontendData  # Import FrontendData

def create_accounts(conn):
    id1 = uuid.uuid4()
    id2 = uuid.uuid4()
    with conn.cursor() as cur:
        cur.execute(
            "CREATE TABLE IF NOT EXISTS accounts (id UUID PRIMARY KEY, distance FLOAT)"
        )
        cur.execute(
            "UPSERT INTO accounts (id, distance) VALUES (%s, 1.5), (%s, 2.0)", (id1, id2))  # Dummy initial values
        logging.debug("create_accounts(): status message: %s",
                      cur.statusmessage)
    return [id1, id2]

def delete_accounts(conn):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM accounts")
        logging.debug("delete_accounts(): status message: %s",
                      cur.statusmessage)

def print_distance(conn):
    with conn.cursor() as cur:
        print(f"Distance at {time.asctime()}:")
        for row in cur.execute("SELECT id, distance FROM accounts"):
            print("account id: {0}  Distance: {1} m".format(row.id, row.distance))

def update_distance_with_gaze_values(conn, ids, gaze_values):
    with conn.cursor() as cur:
        for id, gaze_value in zip(ids, gaze_values):
            cur.execute(
                "UPDATE accounts SET distance = %s WHERE id = %s", (gaze_value, id))
    logging.debug("update_distance_with_gaze_values(): status message: %s", cur.statusmessage)

def run_transaction(conn, op, max_retries=3):
    with conn.transaction():
        for retry in range(1, max_retries + 1):
            try:
                op(conn)
                return
            except SerializationFailure as e:
                conn.rollback()
                logging.debug("EXECUTE SERIALIZATION_FAILURE BRANCH")
                sleep_seconds = (2**retry) * 0.1 * (random.random() + 0.5)
                logging.debug("Sleeping %s seconds", sleep_seconds)
                time.sleep(sleep_seconds)
            except psycopg.Error as e:
                logging.debug("got error: %s", e)
                logging.debug("EXECUTE NON-SERIALIZATION_FAILURE BRANCH")
                raise e
        raise ValueError(
            f"transaction did not succeed after {max_retries} retries")

def main():
    opt = parse_cmdline()
    logging.basicConfig(level=logging.DEBUG if opt.verbose else logging.INFO)
    try:
        db_url = opt.dsn
        conn = psycopg.connect(db_url, 
                               application_name="$ docs_simplecrud_psycopg3", 
                               row_factory=namedtuple_row)
        ids = create_accounts(conn)
        print_distance(conn)
            
        try:
            frontend = FrontendData()  # Initialize FrontendData
            gaze_values = frontend.getGazeValues()  # Get gaze values from FrontendData
            run_transaction(conn, lambda conn: update_distance_with_gaze_values(conn, ids, gaze_values))
        except ValueError as ve:
            logging.debug("run_transaction(conn, op) failed: %s", ve)
            pass
        except psycopg.Error as e:
            logging.debug("got error: %s", e)
            raise e

        print_distance(conn)
    except Exception as e:
        logging.fatal("database connection failed")
        logging.fatal(e)
        return

def parse_cmdline():
    parser = ArgumentParser(description=__doc__,
                            formatter_class=RawTextHelpFormatter)

    parser.add_argument("-v", "--verbose",
                        action="store_true", help="print debug info")

    parser.add_argument(
        "dsn",
        default=os.environ.get("DATABASE_URL"),
        nargs="?",
        help="""\
database connection string\
 (default: value of the DATABASE_URL environment variable)
            """,
    )

    opt = parser.parse_args()
    if opt.dsn is None:
        parser.error("database connection string not set")
    return opt

if __name__ == "__main__":
    main()
