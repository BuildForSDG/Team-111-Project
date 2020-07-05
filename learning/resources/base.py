import falcon
from bson.objectid import ObjectId

from learning.custom.errors import ObjectNotFoundException


class BaseResource(object):
    """
    Base Resource
    """

    def __init__(self, service_class, serializers={}, limiter=None, query=None,
                 is_admin=False, permissions=[], skip_obj_id=False, permit=None, searchable_fields=["date_created"],
                 default_page_limit=20):
        """
        the initialization of the baseResource
        :param service_class: This is the service class that this resource will operate on
        """
        self.service_class = service_class
        self.serializers = serializers
        self.limiter = limiter if limiter else self.limit_query
        self.permit = permit if permit else self.limit_get
        self.query = query if query else self.query_method
        self.skip_obj_id = skip_obj_id if skip_obj_id else False
        self.is_admin = is_admin if is_admin else is_admin
        self.searchable_fields = searchable_fields
        self.default_page_limit = default_page_limit

    def save(self, data, user_context, req):
        """
        Saves information sent in by on_post request, where no object id is specified.

        :param user_context
        :param data: the data to be saved.
        :return: Object that was created
        """
        return self.service_class.create(**data)

    def update(self, obj_id, data, user_context, req):
        """
        Updates information sent in by on_post request where an object id
        is specified with no action.

        :param obj_id: id of the object to be updated
        :param data: the data to be saved.
        """
        return self.service_class.update(obj_id, **data)

    def query_method(self):
        """this is the query that loads the data for a get request"""

        return self.service_class.objects

    def execute_query(self, query, user_context, req):
        """this is the query that loads the data for a get request"""
        view = req.context.get("view")
        view_func = getattr(self, "%s_query" % view.lower(), None) if view else None
        print("the view func", view_func)
        if view_func:
            print(" runningjthe  view now")
            query = view_func(query)
            print(query.count())

        return query

    def limit_query(self, query, **kwargs):
        """limit the results of a query to what want the user to see"""

        user_id = kwargs.get("user_id")
        raw_query = {'user': ObjectId(user_id)} if user_id else {}
        return query.raw(raw_query)

    def fetch(self, obj_id, user_context, req):
        """
        a helper function that is to be used in on_get requests when only obj_id is provided

        :param obj_id: the id of the object to get
        """
        try:
            obj = self.service_class.get(obj_id)
        except ObjectNotFoundException as e:
            print(e.data)
            raise falcon.HTTPError(falcon.HTTP_404, title=e.data.get("name"), description=e.data.get("message"))
        return obj

    def limit_get(self, obj, user_context, req):
        """limit the ability to view a singular object to the actual owner of the object"""
        if not obj:
            return
        resource_name = req.context.get("resource_name", None)
        if not resource_name:
            return obj
        pro = getattr(obj, "user", None)
        pro_id = getattr(obj, "user_id", None)
        _id = getattr(obj, "_id", None)
        pk = user_context.uuid
        print("peeeeeeeee", pk,pro_id)
        if pro and str(pro.pk) == str(pk) or str(pro_id) == str(pk) or str(_id) == str(pk):
            return obj
        raise falcon.HTTPError('401 ', title='Unauthorized', description="You are not permitted to view this object",
                               code=1839)

    def get_user_id(self, user_context, req):
        """
        extract only the profile id of the user making this request
        :param req: the falcon request object for call
        :return: user_id
        """
        user_id = user_context.get('uuid', None)
        return user_id

    def on_get(self, req, res, obj_id=None, resource_name=None):
        """

        :param req: the request body of the api call
        :param res: the response the api will send back
        :param obj_id:
        :param resource_name:
        :return:
        """

        # print req, dir(req), "get"
        print(req.path, obj_id, resource_name)
        user_context = req.context.get("user_context")
        if not obj_id:
            res.status = falcon.HTTP_200
            res.content_type = 'application/json'
            user_id = self.get_user_id(user_context, req)
            base_query = self.query()
            query = self.execute_query(base_query, user_context, req)
            limited_query = self.limiter(query, user_context=user_context, req=req, user_id=user_id)
            res.context["results"] = limited_query
            res.context["default_page_limit"] = self.default_page_limit

        if obj_id and not resource_name:
            res.status = falcon.HTTP_200
            res.content_type = 'application/json'
            obj = self.fetch(obj_id, user_context, req)
            if obj:
                obj = self.permit(obj, user_context, req)
            res.media = obj

    def on_post(self, req, res, obj_id=None, resource_name=None):
        """

        :param req: the request body of a call to the api
        :param res: the response the api will send back
        :param obj_id:
        :param resource_name:
        :return:
        """
        data = req.context.get("validated_data") or {}
        user_context = req.context.get("user_context")
        if not obj_id:
            print(req, dir(req), "post")
            res.status = falcon.HTTP_201
            res.media = self.save(data, user_context, req)

        if self.skip_obj_id:
            method = getattr(self, obj_id)

            if not method:
                desc = 'the method you are trying to access does not exist on this resource'
                raise falcon.HTTPError('409', title='Method Invalid', description=desc, code=1839)

            result = method(data, user_context, req)
            res.status = falcon.HTTP_201
            res.media = result

        if obj_id and not resource_name and not self.skip_obj_id:
            """This is primarily for doing a update on an object"""
            res.status = falcon.HTTP_201
            self.permit(self.fetch(obj_id, user_context, req), user_context, req)
            res.media = self.update(obj_id, data, user_context, req)

        if obj_id and resource_name:
            """this will handle actions that will be made available to the object"""

            method = getattr(self, resource_name)

            if not method:
                desc = 'the method you are trying to access does not exist on this resource'
                raise falcon.HTTPError('409', title='Method Invalid', description=desc, code=1839)

            self.permit(self.fetch(obj_id, user_context, req), user_context, req)

            result = method(obj_id, data, user_context, req)
            res.status = falcon.HTTP_201
            res.media = result

    def on_delete(self, req, res, obj_id=None, resource_name=None):
        """handle deleting of objects"""


