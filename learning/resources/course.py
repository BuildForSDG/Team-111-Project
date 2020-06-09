# coding=utf-8

"""
Courses resource
"""

from learning.resources.base import *

from learning.schemas import *

class CourseResource(BaseResource):
    """CourseResource"""
    serializers = {
        "response": CourseResponseSchema
    }
    