# settings.py
"""
settings.py

The base settings file for the project. This file will be imported by any modules that require settings functionality.
All variables and paths are loaded up from the environmental variables setup by in the .env file in use.
"""

import os
from dotenv import load_dotenv

# import the necessary
# .env file based on what environment you are in
# The base folder will be the env folder at the root of the project

env = os.getenv("ENV", "")  # get environment


# Implementing staging and production bypass. Useful for kubernetes environment.
if env not in ["staging", "production"]:
    dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__name__)), "configs", "{env}.env".format(env=env)) # determine .env path
    # Load settings variables using dotenv
    load_dotenv(verbose=True, dotenv_path=dotenv_path)


MONGO_BASE = os.getenv("MONGO_BASE", "mongodb+srv")
MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_USERNAME = os.getenv("MONGO_USERNAME", "")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "")
MONGO_DATABASE = os.getenv("MONGO_DATABASE")
M = '{username}:{password}'.format(username=MONGO_USERNAME, password=MONGO_PASSWORD)
MONGO_CRED = "" if len(M) < 6 else M
D = '{mongo_base}://{cred}{host}/{database}?retryWrites=true&w=majority'.format(
    mongo_base=MONGO_BASE,
    cred=MONGO_CRED,
    host=MONGO_HOST,
    database=MONGO_DATABASE
)

DATABASE_URL = os.getenv("MONGODB_URI", D)

print(DATABASE_URL, "modddddddddddddddddddddddddddddddd")

API_BASE = os.getenv("API_BASE", "")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "EOMEOMEMEE")
JWT_AUDIENCE_CLAIM = os.getenv("JWT_AUDIENCE_CLAIM")
JWT_ISSUER_CLAIM = os.getenv("JWT_ISSUER_CLAIM", "backend.learning")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRES_IN_HOURS = os.getenv("JWT_EXPIRES_IN_HOURS", 49)
OPEN_APP = os.getenv("OPEN_APP", "True")
