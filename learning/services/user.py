from learning.services.base import *
from learning.models import *
from learning.services.core import ApplicationService
import dateutil.parser
import re

BaseUserService = ServiceFactory.create_service(User)


class UserService(BaseUserService):
    """
    User SERVICE
    """

    @classmethod
    def register_account(cls, **kwargs):
        """
        Register a new user account.

        Returns:
            {mini_blog.models.User} -- The newly created object
        """

        # Clean the data and set the password

        password = kwargs.pop("password")

        obj = cls.create(**kwargs)

        obj.set_password(password)

        AppRegisterService().make_profiles(user_id=str(obj.pk), **kwargs)
        return obj

    @classmethod
    def authenticate_account(cls, username, password, **kwargs):
        """
        Authenticate a user
        Arguments:
            username {str} -- username for the account to authenticate
            password {str} -- password for the account to authenticate

        Raises:
            an --
            ValidationError -- The user credentials are invalid and a user was not found

        Returns:
            Blog.models.User -- Valid user object
        """
        username = re.escape(username)
        search_value = "^%s$" % username
        params = {"$or": [
            {"username": re.compile(search_value, re.IGNORECASE)},
            {"email": re.compile(search_value, re.IGNORECASE)},
            {"phone": re.compile(search_value, re.IGNORECASE)},
        ]}

        obj = cls.find_one(params)
        # Check if user is valid and password is correct
        if not obj or not obj.check_password(password):
            # Raise an invalid user error here. Change to a custom exception handler
            return None

        return obj

    @classmethod
    def link_user_to_app(cls, user_id, application_id, remote_id, permissions=[], **kwargs):
        """
        Link an existing user account to an application

        Arguments:
            user_id {str|uuid} -- User id within the Auth Service
            application_id {str|inuuidt} -- App ID within the Auth Service
            remote_id {str|uuid} -- Remote application or profile id of the user

        Keyword Arguments:
            permissions {list} -- Optional list of permissions required by the application (default: {[]})

        Returns:
            {mini_blog.models.User} -- The updated user object
        """
        obj = cls.get(user_id)
        app = ApplicationService.get(application_id)
        # Remove existing profile for user if it existed before now
        obj.remove_profile(app.domain)
        date_created = dateutil.parser.parse(kwargs.get("date_created", datetime.now().isoformat()))
        obj.add_profile(id=remote_id, domain=app.domain, perm=permissions, date_created=date_created)
        obj = cls.update(obj.pk)
        return obj

    @classmethod
    def unlink_user_from_app(cls, user_id, application_id, **kwargs):
        """
        Unlink an existing user from an application (Deactivate user)

        Arguments:
            user_id {str|uuid} -- User ID to unlink
            application_id {str|uuid} -- [description]

        Returns:
            [type] -- [description]
        """

        obj = cls.get(user_id)
        app = ApplicationService.get(application_id)

        # Remove existing profile for user if it existed before now
        obj.remove_profile(app.domain)

        obj.save()

        return obj


# noinspection PyMethodMayBeStatic
class AppRegisterService:
    """the class to manage registration of profiles on different apps"""

    def __init__(self, app_names=None):
        self.app_names = app_names if app_names else [app.name for app in ApplicationService.objects]

    def prepare_kwargs(self, **kwargs):
        """

        :param kwargs:
        :return:
        """
        app_group = kwargs.get("account_type")
        if not app_group:
            return kwargs
        group = ApplicationGroup.objects.raw({"_id": app_group})
        if group.count() < 1:
            return kwargs
        kwargs.update({app_name.lower(): True for app_name in group.first().applications})
        return kwargs

    def register_teacher(self, application_id, **kwargs):

        """
        profile a user on the Sendbox payments sub service
        :param application_id:
        :param kwargs:
        :return:
        """
        if not kwargs.get("teacher", False):
            print("no access to teacher account")
            return
        print("registering Teacher profile")
        user = UserService.find_one({"_id": ObjectId(kwargs.get("user_id"))})
        UserService.link_user_to_app(user_id=kwargs.get("user_id"), application_id=application_id,
                                     remote_id=user.pk,
                                     permissions=['user_can_read', 'user_can_write', 'user_can_delete'])
        return True

    def register_student(self, application_id, **kwargs):

        """
        profile a user on the Sendbox payments sub service
        :param application_id:
        :param kwargs:
        :return:
        """
        if not kwargs.get("student", False):
            print("no access to student account")
            return

        print("registering Student profile")
        user = UserService.find_one({"_id": ObjectId(kwargs.get("user_id"))})
        UserService.link_user_to_app(user_id=kwargs.get("user_id"), application_id=application_id,
                                     remote_id=user.pk,
                                     permissions=['user_can_read', 'user_can_write', 'user_can_delete'])
        return True

    def register_admin(self, application_id, **kwargs):

        """
        profile a user on the Sendbox payments sub service
        :param application_id:
        :param kwargs:
        :return:
        """

        print("registering Admin Shipping profile")
        user = UserService.find_one({"_id": ObjectId(kwargs.get("user_id"))})
        admin = kwargs.get('admin', False)
        if not admin:
            print("User not granted access to admin app")
            return admin
        UserService.link_user_to_app(user_id=kwargs.get("user_id"), application_id=application_id,
                                     remote_id=user.pk,
                                     permissions=['user_can_read', 'user_can_write', 'user_can_delete'])
        return True

    def make_profiles(self, user_id, **kwargs):
        """

        """

        print(self.app_names, "all the name<<<<<<<<<<<<<<<<<<<<<<<")
        kwargs = self.prepare_kwargs(**kwargs)
        print(kwargs)
        for name in self.app_names:
            print(name, "trying to do==================")
            method = getattr(self, "register_%s" % name.lower(), None)
            if method:
                print("found method")
                application = ApplicationService.find_one({"name": name})
                if application:
                    user = UserService.get(user_id)
                    print("found app")
                    data = user.to_dict()
                    kwargs.update(**data)
                    kwargs["user_id"] = str(user.pk)
                    method(application.pk, **kwargs)
