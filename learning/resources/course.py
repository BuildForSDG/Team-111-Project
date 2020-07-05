# coding=utf-8

"""
Courses resource
"""
from pprint import pprint

from learning.resources.base import *

from learning.schemas import *
from learning.services.user import UserService


class CourseResource(BaseResource):
    """CourseResource"""
    serializers = {
        "default": CourseRequestSchema,
        "response": CourseResponseSchema,
        "activate": BlankSchema,
    }

    def save(self, data, user_context, req):
        """
        Course Create
        """
        data["user_data"] = UserService.prepare_user_data(user_context.uuid)
        # pprint(data)
        return self.service_class.register(**data)

    def update(self, obj_id, data, user_context, req):
        """
        Course Create
        """
        data["user_data"] = UserService.prepare_user_data(user_context.uuid)
        # pprint(data)
        data["course_type"] = data.get("name")

        # pprint(data)
        return self.service_class.update_data(obj_id, **data)

    def activate(self, obj_id, data, user_context, req):
        """
        Activate
        """
        course = self.service_class.get(obj_id)
        course.status = "active"
        return course.save()
