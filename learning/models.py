"""
models.py

Data model file for application. This will connect to the mongodb database and provide a source for storage for the application service

"""
import inspect
import json
import bcrypt
from bson import ObjectId
from pymodm import connect, fields, MongoModel, EmbeddedMongoModel
from pymongo.operations import IndexModel
from datetime import datetime, timedelta, date
import pymongo
from pymongo.write_concern import WriteConcern
import jwt
import settings

# Must always be run before any other database calls can follow

connect(settings.DATABASE_URL)


class CustomJSONEncoder(json.JSONEncoder):
    """ JSON encoder that supports date formats """

    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        if isinstance(obj, date):
            return datetime.combine(date, datetime.min.time()).isoformat()

        # Implement json decoder for ObjectId if needed
        if isinstance(obj, ObjectId):
            return str(obj)

        return json.JSONEncoder.default(self, obj)


def convert_dict(data, indent=None):
    return json.dumps(data, indent=indent, cls=CustomJSONEncoder)


class AppMixin(object):
    """ App mixin will hold special methods and field parameters to map to all model classes"""

    def to_dict(self):
        """

        :return:
        """
        if isinstance(self, (MongoModel, EmbeddedMongoModel)):
            return self.to_son().to_dict()
        return self.__dict__

    def to_full_dict(self):
        """
        Retrieve all values of this model as a dictionary including values of methods that are
        wrapped with the @property decorator
        """
        data = inspect.getmembers(self)
        data_ = dict()
        for d in data:
            if not inspect.ismethod(d[1]) and '__' not in d[0] \
                    and type(d[1]) in [str, int, dict, list, float, datetime, ObjectId, tuple] \
                    or isinstance(d[1], (MongoModel, EmbeddedMongoModel)):

                data_[d[0]] = d[1]
                print(type(d[1]), "the type", d[0])
                if type(d[1]) == ObjectId:
                    data_[d[0]] = str(d[1])
                if isinstance(d[1], (MongoModel, EmbeddedMongoModel)) and getattr(d[1], 'to_son', None):
                    data_[d[0]] = d[1].to_son().to_dict()
                if type(d[1]) in [list, tuple] and len(d[1]) > 0:
                    sub = []
                    for i in d[1]:
                        if getattr(i, 'to_son', None):
                            sub.append(i.to_son().to_dict())
                    data_[d[0]] = sub
                    #     print (i)

        # pprint(data_)

        return data_

    def to_full_json(self):
        """
        Retrieve all values of this model as a dictionary including values of methods that are
        wrapped with the @property decorator
        """
        data_ = self.to_full_dict()
        data_.pop("_defaults", None)
        data_ = convert_dict(data_)
        return data_


class AccountType(MongoModel, AppMixin):
    """
    AccountType
    """
    name = fields.CharField(required=False)
    code = fields.CharField(required=False, primary_key=True)
    description = fields.CharField(required=False)


class AcademicLevel(MongoModel, AppMixin):
    """
    AccountType
    """
    name = fields.CharField(required=False)
    code = fields.CharField(required=False, primary_key=True)
    description = fields.CharField(required=False)


class Course(MongoModel, AppMixin):
    """
    AccountType
    """
    name = fields.CharField(required=False)
    code = fields.CharField(required=False, primary_key=True)
    description = fields.CharField(required=False)


class Profile(EmbeddedMongoModel):
    """ Embedded object of user's application permissions. """

    id = fields.CharField(required=True, blank=False)
    domain = fields.CharField(required=True, blank=False)
    perm = fields.ListField(fields.CharField(), default=[])
    date_created = fields.DateTimeField(default=datetime.utcnow)

    def __hash__(self):
        """ custom hashing method so that comparison will work on an object level """
        return hash((self.id, self.domain))

    def __eq__(self, other):
        """ custom equality function to ensure object can be compared using either a string or object value """

        # compare permission with another permission object
        if isinstance(other, Profile):
            return hash((self.id, self.domain)) == other.__hash__()

        # compare permission with another string matching the domain
        if isinstance(other, str):
            return self.domain == other

        # # Return whatever the default is if all else fails
        # return super(Profile, self).__eq__()


class Application(MongoModel, AppMixin):
    """ Model class to describe each new application. """

    domain = fields.CharField(required=True, blank=False)
    name = fields.CharField(required=True, blank=False)
    description = fields.CharField(required=False, blank=True)
    date_created = fields.DateTimeField(required=True, blank=False, default=datetime.utcnow)
    last_updated = fields.DateTimeField(required=True, blank=False, default=datetime.utcnow)

    class Meta:
        write_concern = WriteConcern(j=True)
        ignore_unknown_fields = True

        indexes = [
            IndexModel([('domain', pymongo.ASCENDING)], unique=True)
        ]


class ApplicationGroup(MongoModel, AppMixin):
    """
    Application Group
    """
    name = fields.CharField(required=False, blank=True)
    code = fields.CharField(required=True, blank=False, primary_key=True)
    applications = fields.ListField(required=False, blank=True, default=[])


class Country(MongoModel, AppMixin):
    code = fields.CharField(required=True, primary_key=True, blank=False)
    name = fields.CharField(required=True, blank=False)


class User(MongoModel, AppMixin):
    """
    User
    """

    username = fields.CharField(required=True, blank=False)
    name = fields.CharField(required=True, blank=False)
    email = fields.EmailField(required=False, blank=True)
    country = fields.ReferenceField(Country, required=False, blank=True)
    academic_level = fields.ReferenceField(AcademicLevel, required=False, blank=True)
    phone = fields.CharField(required=False, blank=True)
    password = fields.CharField(required=False, blank=True)
    profiles = fields.EmbeddedDocumentListField(Profile, default=[], blank=True)
    date_created = fields.DateTimeField(required=True, blank=False, default=datetime.utcnow)
    last_updated = fields.DateTimeField(required=True, blank=False, default=datetime.utcnow)

    # noinspection PyClassicStyleClass
    class Meta:
        """meta"""
        write_concern = WriteConcern(j=True)
        ignore_unknown_fields = True

    def set_password(self, password):
        """
        Password hashing logic for each model.
        This will be run on every user object when it is created.

        Arguments:
            password {str or unidecode} -- The password, in clear text, to be hashed and set on the model
        """

        if not password or not isinstance(password, str):
            raise ValueError("Password must be non-empty string or unicode value")

        self.password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode('utf-8')
        # set last updated.
        self.last_updated = datetime.utcnow()

        self.save()

    def check_password(self, password):
        """
        Password checking logic.
        This will be used whenever a user attempts to authenticate.

        Arguments:
            password {str or unicode} -- The password to be compared, in clear text.

        Raises:
            ValueError -- Raised if there is an empty value in password

        Returns:
            bool -- True if password is equal to hashed password, False if not.
        """

        if not password or not isinstance(password, str):
            print("wommmmmmmmmmmmmmmmmmmmm")
            raise ValueError("Password must be non-empty string or unicode value")

        # both password and hashed password need to be encrypted.
        print(password, self.password)
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    @property
    def auth_token(self):
        """ Generate the auth token for this user from the current data embedded within the application """

        if not self.pk:
            raise ValueError("Cannot generate token for unsaved object")

        profiles = [dict(id=p.id, domain=p.domain, perm=p.perm) for p in self.profiles]
        audiences = set([settings.JWT_ISSUER_CLAIM] + [p.domain for p in self.profiles])

        expires_in = datetime.now() + timedelta(hours=settings.JWT_EXPIRES_IN_HOURS, days=2)

        payload = dict(uid=str(self.pk), username=self.username, name=self.name, email=self.email, phone=self.phone,
                       profiles=profiles, iss=settings.JWT_ISSUER_CLAIM, aud=list(audiences), exp=expires_in)
        print(payload, "token the payload")
        encoded = jwt.encode(payload, key=settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM).decode("utf-8")
        print(encoded)
        return encoded

    def add_profile(self, id, domain, perm, date_created=datetime.now(), **kwargs):
        """
        add profile to user

        Arguments:
            id {str|uuid} -- remote_id of the profile to include
            domain {str|uuid} -- application domain or uid
            perm {list|tuple} -- array of permissions to register

        """

        profile = Profile(id=id, domain=domain, perm=perm)
        self.profiles.append(profile)

        # set last updated.
        self.last_updated = datetime.utcnow()
        self.save()

    def has_profile(self, profile):
        """
        Checks if the provided profile exists for this user

        Arguments:
            profile {str|sendbox_auth.models.Profile} -- Profile to compare.
                    This can be the string name matching the domain or the profile object itself

        Returns:
            [type] -- [description]
        """

        return profile in self.profiles

    def get_profile(self, profile):
        """ Fetch profile from user """
        return next((p for p in self.profiles if p == profile), None)

    def remove_profile(self, profile):
        """ Remove a specific profile from the list of user profiles """

        try:
            self.profiles.remove(profile)
        except ValueError as e:
            pass
