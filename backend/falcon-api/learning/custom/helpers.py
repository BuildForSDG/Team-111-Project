"""
helpers.py

shared functions and methods that are required in multiple places
"""
import hashlib
import hmac

import phonenumbers
import pycountry
from validator_collection import checkers
import re


def prepare_user_data(data):
    """ Helper function to clean up user data before saving it """

    name = data.get("name", "")
    username = data.get("username", "")
    email = data.get("email", "")
    country_code = data.pop("country_code", "NG")
    phone = data.get("phone")

    try:
        parsed_phone = phonenumbers.parse(phone, country_code)
        phone = phonenumbers.format_number(parsed_phone, phonenumbers.PhoneNumberFormat.E164)
    except phonenumbers.phonenumberutil.NumberParseException:
        # fail silently because at this point the info is already validated
        raise

    country = pycountry.countries.get(alpha_2=country_code)

    data.update({
        "name": name.strip(),
        "username": username.strip().lower(),
        "phone": phone.strip().lower(),
        "email": email.strip().lower(),
        "country": country.alpha_2
    })

    return data
