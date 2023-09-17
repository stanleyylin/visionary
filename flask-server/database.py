#!/usr/bin/env python3
"""
Test SQLite for Screen Time Tracking.
"""

import logging
import os
import random
import time
import uuid
from argparse import ArgumentParser, RawTextHelpFormatter
import sqlite3

from glasses import FrontendData  # Import FrontendData

def connect_to_database():
    return sqlite3.connect("screen_time_tracker.db")

def create_accounts(conn):
    id1 = str(uuid.uuid4())
    id2 = str(uuid.uuid4())
    with conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS accounts (
                id TEXT PRIMARY KEY,
                distance REAL
            )
        """)
        cursor.execute("INSERT INTO accounts (id, distance) VALUES (?, ?), (?, ?)",
                       (id1, 1.5, id2, 2.0))
    return [id1, id2]

def delete_accounts(conn):
    with conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM accounts")

def print_distance(conn):
    with conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, distance FROM accounts")
        print(f"Distance at {time.asctime()}:")
        for row in cursor.fetchall():
            print(f"account id: {row[0]}  Distance: {row[1]} m")

def update_distance_with_gaze_values(conn, ids, gaze_values):
    with conn:
        cursor = conn.cursor()
        for id, gaze_value in zip(ids, gaze_values):
            cursor.execute(
                "UPDATE accounts SET distance = ? WHERE id = ?", (gaze_value, id))

def run_transaction(conn, op, max_retries=3):
    for retry in range(1, max_retries + 1):
        try:
            op(conn)
            conn.commit()
            return
        except sqlite3.Error as e:
            conn.rollback()
            logging.debug("EXECUTE SQLITE_ERROR BRANCH")
            sleep_seconds = (2**retry) * 0.1 * (random.random() + 0.5)
            logging.debug("Sleeping %s seconds", sleep_seconds)
            time.sleep(sleep_seconds)
        except Exception as e:
            logging.debug("got error: %s", e)
            logging.debug("EXECUTE NON-SQLITE_ERROR BRANCH")
            raise e
    raise ValueError(
        f"transaction did not succeed after {max_retries} retries")

def main():
    opt = parse_cmdline()
    logging.basicConfig(level=logging.DEBUG if opt.verbose else logging.INFO)
    try:
        conn = connect_to_database()
        ids = create_accounts(conn)
        print_distance(conn)
            
        try:
            frontend = FrontendData()  # Initialize FrontendData
            gaze_values = frontend.getGazeValues()  # Get gaze values from FrontendData
            run_transaction(conn, lambda conn: update_distance_with_gaze_values(conn, ids, gaze_values))
        except ValueError as ve:
            logging.debug("run_transaction(conn, op) failed: %s", ve)
            pass
        except sqlite3.Error as e:
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

    opt = parser.parse_args()
    return opt

if __name__ == "__main__":
    main()
