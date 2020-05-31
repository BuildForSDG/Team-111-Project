from learning.custom import helpers
from learning.models import *
from marshmallow import fields as _fields, Schema, validate, post_load, validates_schema, ValidationError, validates, \
    EXCLUDE
import re
import phonenumbers
import pycountry


# Validator class for
# email address on users


class EmailExistsValidator(validate.Validator):
    """ Custom username validator to check that all usernames are unique and available """

    def __call__(self, value):
        """
        Execute the validation logic
        Arguments:
            value {object} -- Value to validate.
        """
        search_value = re.escape(value)
        search_value = "^%s$" % search_value
        # Check that the username isn't present with any existing user
        if User.objects.raw({"$or": [
            {"username": re.compile(search_value, re.IGNORECASE)},
            {"phone": re.compile(search_value, re.IGNORECASE)},
            {"email": re.compile(search_value, re.IGNORECASE)},
        ]}).count() > 0:
            raise validate.ValidationError("Username is already in use")


class LoginExistsValidator(validate.Validator):
    """ Custom username validator to check that all usernames are unique and available """

    def __call__(self, value):
        """
        Execute the validation logic
        Arguments:
            value {object} -- Value to validate.
        """
        # Check that the username isn't present with any existing user
        value = re.escape(value)
        search_value = "^%s$" % value
        print(search_value, "=======================")
        params = {"$or": [
            {"username": re.compile(search_value, re.IGNORECASE)},
            {"email": re.compile(search_value, re.IGNORECASE)},
            {"phone": re.compile(search_value, re.IGNORECASE)},
        ]}
        if User.objects.raw(params).count() == 0:
            raise validate.ValidationError("Username does not exist")


def phone_exists_validator(phone, country_code="NG"):
    """ Custom phone number validator to check that all phone numbers are unique and available """

    try:

        parsed_phone = phonenumbers.parse(phone, country_code)
        if not phonenumbers.is_valid_number(parsed_phone):
            raise ValidationError(message='Invalid phone number', field_names=['phone'])

        phone = phonenumbers.format_number(parsed_phone, phonenumbers.PhoneNumberFormat.E164)
        params = {'phone': phone}

        if User.objects.raw(params).count() > 0:
            raise validate.ValidationError("Phone number already exits, login to continue", field_names=['phone'])
    except phonenumbers.phonenumberutil.NumberParseException:
        raise ValidationError(message='Phone number invalid', field_names=['phone'])


def phone_number_validator(phone, country_code="NG"):
    """ Custom phone number validator to check that all phone numbers are unique and available """

    try:
        parsed_phone = phonenumbers.parse(phone, country_code)
        if not phonenumbers.is_valid_number(parsed_phone):
            return None
        phone = phonenumbers.format_number(parsed_phone, phonenumbers.PhoneNumberFormat.E164)
    except phonenumbers.phonenumberutil.NumberParseException:
        return None
    return phone


class CountryCodeValidator(validate.Validator):
    """ Custom validator for country code.
    This will check that it comes in short code (2digits) and is a valid country code """

    def __call__(self, value):
        """
        Execute the validation logic
        Arguments:
            value {object} -- Value to validate.
        """

        if len(value) != 2:
            raise validate.ValidationError(("Country code can only be 2 characters."
                                            " Please provide a valid alpha-2 (two-letter) code."))

        # fetch country and test validation
        if pycountry.countries.get(alpha_2=value.strip().upper()) is None:
            raise validate.ValidationError(("Invalid country code provided."
                                            " Please provide a valid alpha-2 (two-letter) code."))


class CoreResponseSchema(Schema):
    """
    CoreResponseSchema
    """
    _id = _fields.String(required=True, allow_none=False)
    code = _fields.String(required=False, allow_none=True)
    name = _fields.String(required=False, allow_none=True)
    description = _fields.String(required=False, allow_none=True)


class RegistrationSchema(Schema):
    """ Schema to validate data for registering a new user """

    name = _fields.String(required=True, allow_none=False,
                          validate=validate.Length(min=6, error="Name can not be less than 6 characters"))
    username = _fields.String(required=True, allow_none=False, validate=EmailExistsValidator())
    email = _fields.Email(required=False, allow_none=True, validate=EmailExistsValidator())
    country_code = _fields.String(required=True, allow_none=False, validate=CountryCodeValidator())
    phone = _fields.String(required=True, allow_none=False)
    app_group = _fields.String(required=False, allow_none=True)
    password = _fields.String(required=True, allow_none=False,
                              validate=validate.Length(min=6, error="Password can not be less than 6 characters"))
    verify_password = _fields.String(required=False, allow_none=True, )

    @post_load
    def prepare_payload(self, data, **kwargs):
        """
        Prepare the data such that the data necessary data is case insensitive

        Arguments:
            data {dict} -- data that has been successfully loaded after validation
        """
        return helpers.prepare_user_data(data)

    @validates_schema
    def validate_schema(self, data, **kwargs):
        password = data.get("password")
        verify_password = data.get("verify_password", None)
        if verify_password and password != verify_password:
            raise validate.ValidationError("Passwords must be the same", field_names=['verify_password'])

        phone = data.get('phone')
        country_code = data.get('country_code')
        phone_exists_validator(phone, country_code)


class LoginSchema(Schema):
    username = _fields.String(required=True, allow_none=False, validate=LoginExistsValidator())
    password = _fields.String(required=True, allow_none=False)


class UserResponseSchema(Schema):
    """
    User Response Schema
    """
    name = _fields.String(required=False, allow_none=True)
    username = _fields.String(required=False, allow_none=True)
    email = _fields.Email(required=False, allow_none=True)
    country = _fields.Nested(CoreResponseSchema, required=False, allow_none=True, unknown=EXCLUDE)
    phone = _fields.String(required=False, allow_none=True)
    _id = _fields.String(required=False, allow_none=True)
    pk = _fields.String(required=False, allow_none=True)


class PostRequestSchema(Schema):
    title = _fields.String(required=False, allow_none=True)
    subject = _fields.String(required=True, allow_none=False)
    content = _fields.String(required=True, allow_none=False)


class CommentRequestSchema(Schema):
    text = _fields.String(required=True, allow_none=False)


class ReplyRequestSchema(Schema):
    text = _fields.String(required=True, allow_none=False)


class DefaultResponseSchema(Schema):
    user = _fields.Nested(UserResponseSchema, required=False, only=("name",))


class ReplyResponseSchema(DefaultResponseSchema):
    text = _fields.String(allow_none=True)


class CommentResponseSchema(DefaultResponseSchema):
    text = _fields.String(allow_none=True)
    replies = _fields.List(_fields.Nested(UserResponseSchema, only=("name",)), required=False)


class LikeResponseSchema(Schema):
    user_id = _fields.String(allow_none=True)


class PostResponseSchema(Schema):
    pk = _fields.String(required=False, allow_none=True)
    _id = _fields.String(required=False, allow_none=True)
    title = _fields.String(required=False, allow_none=True)
    subject = _fields.String(required=True, allow_none=False)
    content = _fields.String(required=True, allow_none=False)
    comments = _fields.List(_fields.Nested(CommentResponseSchema), required=False, allow_none=True)
    likes = _fields.List(_fields.Nested(LikeResponseSchema))
    user = _fields.Nested(UserResponseSchema, required=True, allow_none=False)
    date_created = _fields.DateTime(required=False, allow_none=True)
    last_updated = _fields.DateTime(required=False, allow_none=True)


class AuthUserResponseSchema(UserResponseSchema):
    auth_token = _fields.String(required=False, allow_none=True)


class BlankSchema(Schema):
    """

    """

