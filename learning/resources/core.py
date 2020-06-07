# coding=utf-8
"""
Core resource
"""

from learning.resources.base import BaseResource
from learning.schemas import *


core_serializers = {
    # "default": CoreResponseSchema,
    "response": CoreResponseSchema
}


class CoreResource(BaseResource):
    """
    CoreResource
    """

    def limit_query(self, query, **kwargs):
        """
        CoreResource

        """
        return query
