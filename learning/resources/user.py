from learning.resources.base import *

from learning.schemas import *


class UserResource(BaseResource):
    serializers = {
        "default": RegistrationSchema,
        "response": UserResponseSchema
    }

    def on_post(self, req, res, obj_id=None, resource_name=None):
        raise falcon.HTTP_NOT_IMPLEMENTED


class ProfileResource(BaseResource):
    serializers = {
        "response": UserResponseSchema
    }

    def on_get(self, req, res, obj_id=None, resource_name=None):
        user_context = req.context.get('user_context')
        req.context["obj_id"] = user_context.uuid
        user_id = user_context.uuid
        return super(ProfileResource, self).on_get(obj_id=user_id, resource_name=None, req=req, res=res)



