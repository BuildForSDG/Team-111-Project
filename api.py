# coding=utf-8

"""
API file to run
"""

from wsgiref import simple_server

from learning.custom.middleware import *
from learning.resources.core import CoreResource, core_serializers
from learning.services.core import *
from learning.services.user import *
from learning.resources.user import *
from learning.resources.auth import *

import settings

app = falcon.API(middleware=[AuthenticateMiddleware(['/signup', '/login', '/check_exists', '/academic_levels',
                                                     '/account_types', '/subjects', '/countries'], settings),
                             RequestResponseMiddleware(),
                             QueryParamsMiddleware()], )

app.add_error_handler(ObjectNotFoundException, ObjectNotFoundError.handler)
app.add_error_handler(TypeError, MissingArgumentError.handler)
app.add_error_handler(MissingArgumentException, MissingArgumentError.handler)
app.add_error_handler(ActionFailedException, ActionFailedError.handler)

signup = SignupResource(UserService, SignupResource.serializers)
login = LoginResource(UserService, LoginResource.serializers)
profile = ProfileResource(UserService, ProfileResource.serializers)
countries = CoreResource(CountryService, core_serializers)
account_types = CoreResource(AccountTypeService, core_serializers)
academic_levels = CoreResource(AcademicLevelService, core_serializers)
subjects = CoreResource(CourseService, core_serializers)
check_exists = CheckExistsResource(UserService, CheckExistsResource.serializers)
register_api(app, login, '/login', prefix=settings.API_BASE)
register_api(app, check_exists, '/check_exists', prefix=settings.API_BASE)
register_api(app, academic_levels, '/academic_levels', prefix=settings.API_BASE)
register_api(app, account_types, '/account_types', prefix=settings.API_BASE)
register_api(app, countries, '/countries', prefix=settings.API_BASE)
register_api(app, subjects, '/subjects', prefix=settings.API_BASE)
register_api(app, profile, '/profile', prefix=settings.API_BASE)
register_api(app, signup, '/signup', prefix=settings.API_BASE)

# error handling block


if __name__ == "__main__":
    httpd = simple_server.make_server('127.0.0.1', 2000, app)
    # httpd = simple_server.make_server('192.168.4.248', 7000, app)
    # httpd = simple_server.make_server('192.168.4.246', 7000, app)
    #
    print("running on ", httpd.server_address)
    httpd.serve_forever()
