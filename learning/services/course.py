# coding=utf-8
"""
COurseService
"""
from pprint import pprint

from learning.services.base import *
from learning.models import *
from learning.services.core import ApplicationService, CourseTypeService
import dateutil.parser
import re

BaseCourseService = ServiceFactory.create_service(Course)
SyllabusService = ServiceFactory.create_service(Syllabus)


class CourseService(BaseCourseService):
    """
    CourseService
    """

    @classmethod
    def prepare_data(cls, **kwargs):
        """
        prepare_data
        """

        print("ssssssssssssssssssssssssssssss")
        pprint(kwargs)
        course_type = kwargs.get("course_type").strip().lower()
        print("osnddnd")
        user_data = kwargs.get("user_data")
        user_id = user_data.get("pk")
        course_t = CourseType.objects.raw({"_id": course_type})
        print("dddddddddddddddddddd")
        CourseTypeService.create(**dict(name=course_type.title(), code=course_type.replace(" ", "_")),
                                 description=kwargs.get("description")) if course_t.count() < 1 else course_t.first()
        kwargs["course_data"] = dict(type=course_type.replace(" ", "_"), user=user_id, user_id=user_id,
                                     user_data=user_data, status="pending")
        return kwargs

    @classmethod
    def register(cls, **kwargs):
        """
        Register course method
        """
        kwargs = cls.prepare_data(**kwargs)
        course_data = kwargs.get("course_data")
        user_id = kwargs.get("user_data", {}).get("pk")
        course = cls.create(**course_data)
        for syl in kwargs.get("syllabus", []):
            syl.update(course=course.pk, user_id=user_id, user=user_id)
            SyllabusService.create(**syl)
        return course

    @classmethod
    def update_data(cls, obj_id, **kwargs):
        """
        Register course method
        """

        kwargs = cls.prepare_data(**kwargs)
        course_data = kwargs.get("course_data")
        user_id = kwargs.get("user_data", {}).get("pk")
        course = cls.update(obj_id, **course_data)
        for sa in Syllabus.objects.raw({"course": ObjectId(obj_id)}):
            sa.delete()

        for syl in kwargs.get("syllabus", []):
            syl.update(course=course.pk, user_id=user_id, user=user_id)
            SyllabusService.create(**syl)
        return course

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

    @classmethod
    def update_course(cls, obj_id, **kwargs):
        """
        UpdateCourse
        """
