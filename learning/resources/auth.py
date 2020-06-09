# coding=utf-8
"""
Authentication
"""
import falcon

from learning.custom.errors import ValidationFailed
from learning.resources.base import BaseResource
from learning.schemas import *


class SignupResource(BaseResource):
    """
    The user resource
    """
    # to raise an error on get
    serializers = {
        "default": RegistrationSchema,
        "response": AuthUserResponseSchema
    }

    def on_get(self, req, res, obj_id=None, resource_name=None):
        """"""

        raise falcon.HTTP_NOT_IMPLEMENTED

    def save(self, data, user_context, req):
        """"""
        print(data)
        obj = self.service_class.register_account(**data)
        return obj


class LoginResource(BaseResource):
    """

    """
    serializers = {
        "default": LoginSchema,
        "response": AuthUserResponseSchema
    }

    def on_get(self, req, res, obj_id=None, resource_name=None):
        """
        """

        raise falcon.HTTP_NOT_IMPLEMENTED

    def on_post(self, req, res, obj_id=None, resource_name=None):
        """

        :param req:
        :param res:
        :param obj_id:
        :param resource_name:
        :return:
        """

        data = req.media
        un = data.get('username')
        pw = data.get('password')
        obj = self.service_class.authenticate_account(un, pw)
        if not obj:
            raise ValidationFailed({"username": ["Invalid username or password supplied"]})
        res.status = falcon.HTTP_201
        res.media = obj.to_full_dict()


class CheckExistsResource(BaseResource):
    """
    Checks if email or phone already exist
    """

    serializers = {
        "default": CheckExistsRequestSchema,
        "response": CheckExistsResponseSchema
    }

    def save(self, data, user_context, req):
        """
        Save function
        """
        return {"exists": False}
