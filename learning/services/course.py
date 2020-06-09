# coding=utf-8
"""
COurseService
"""
from pprint import pprint

from learning.services.base import *
from learning.models import *
from learning.services.core import ApplicationService
import dateutil.parser
import re

BaseCourseService = ServiceFactory.create_service(Course)


class CourseService(BaseCourseService):
    """
    CourseService
    """

    @classmethod
    def register(cls, **kwargs):
        """
        Register course method
        """

        course_type = kwargs.get("course_type")
        user_data = kwargs.get("user_data")
        user_id = user_data.get("pk")
        course = dict(type=course_type, user=user_id, user_id=user_id, user_data=user_data, status="active")
        return cls.create(**course)

    @classmethod
    def register_student(cls, **kwargs):
        """
        Register student
        """
        course_type = kwargs.get("course_type")
        user_data = kwargs.get("user_data")
        user_id = user_data.get("pk")
        course = dict(type=course_type, user=user_id, user_id=user_id, user_data=user_data)
        available = cls.objects.raw({"user_data.account_type.code": "teacher", "status": "active"})
        available_teacher = available.first() if available.count() >= 1 else None
        teacher_id = str(available_teacher.user_id) if available_teacher else None
        course.update(status="pending" if teacher_id else "drafted", teacher=teacher_id)
        pprint(course)
        return cls.create(**course)





