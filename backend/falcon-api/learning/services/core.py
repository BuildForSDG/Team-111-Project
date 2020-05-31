from learning.services.base import *
from learning.models import *


ApplicationService = ServiceFactory.create_service(Application)
ApplicationGroupService = ServiceFactory.create_service(ApplicationGroup)
AccountTypeService = ServiceFactory.create_service(AccountType)
CategoryService = ServiceFactory.create_service(Category)
CourseService = ServiceFactory.create_service(Course)
