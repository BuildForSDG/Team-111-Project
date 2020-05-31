from learning.services.base import *
from learning.models import *


ApplicationService = ServiceFactory.create_service(Application)
ApplicationGroupService = ServiceFactory.create_service(ApplicationGroup)
AccountTypeService = ServiceFactory.create_service(AccountType)
AcademicLevelService = ServiceFactory.create_service(AcademicLevel)
CourseService = ServiceFactory.create_service(Course)
CountryService = ServiceFactory.create_service(Country)
