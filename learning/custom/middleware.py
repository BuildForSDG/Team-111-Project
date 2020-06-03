import six
from falcon.media import BaseHandler
from six.moves.urllib.parse import parse_qs

import ast
import pymongo
from jwt import InvalidAudienceError, InvalidIssuerError
from pymodm.base.models import MongoModel
from pymodm.manager import Manager
import falcon
from marshmallow import ValidationError, EXCLUDE
from pprint import pprint
import jwt
import urllib
from collections import OrderedDict
from munch import munchify
from learning.custom.errors import *
import json
import re
import urllib.parse


def marshal(resp, schema):
    """
    prepares the response object with the specified schema
    :param resp: the falcon response object
    :param schema: the schema class that should be used to validate the response
    :return: falcon.Response
    """
    data = resp
    resp_ = None
    if isinstance(data, list):
        resp_ = []
        for d in data:
            resp_.append(schema().dump(d))
        # resp.media = resp_
    if isinstance(data, dict):
        resp_ = schema().load(data=data, unknown=EXCLUDE)

    if isinstance(data, MongoModel):
        print(data)
        resp_ = schema().dump(data)
        print(resp_)
    return resp_


def register_api(app_, cls, *urls, **kwargs):
    prefix = kwargs.get('prefix', '')
    for url in urls:
        app_.add_route(prefix + url, resource=cls)


def validate(req, schema):
    """
    prepares the response object with the specified schema
    :param req: the falcon request object
    :param schema: the schema class that should be used to validate the response
    :return: falcon.Response
    """
    req_data = req.media
    print(req_data, type(req_data))
    data = schema().load(data=req_data, unknown=EXCLUDE)
    # print req.stream, data, "validated data"
    return data


def make_context_object(req, domain):
    """
    prepares the response object with the specified schema
    :param domain:
    :param req: the falcon request object
    :return: falcon.Response
    """
    context = req.context.get("user_context", {})
    profile = [item for item in context.get("profiles", []) if item.get("domain") == domain]
    print(context.get("profiles"))
    # profile = filter(lambda item: item.get('domain') == domain, context.get("profiles", []))
    dd = dict(username=context.get("username"), name=context.get("name"), phone=context.get("phone"),
              email=context.get("email"), domain=domain, profile={} if len(profile) == 0 else profile[0],
              uuid=context.get("uid"))
    return munchify(dd)


class RequestResponseMiddleware(object):
    """a middleware to be use to breakdown the url pattern"""

    def __init__(self, **kwargs):
        """"""
        self.domain = kwargs.get('domain', 'blog.auth')
        self.settings = kwargs.get('settings', {})

    def process_resource(self, req, res, resource, params):
        """
        performing some manipulation before the request is routed
        :param req:
        :param res:
        :param resource:
        :param params:
        :return: None
        """

        # print params
        resource_name = params.get('resource_name')
        obj_id = params.get('obj_id')
        # print req.path, params, req.query_string, resource_name, "values-------"
        req.context.update(params)
        req.context.update({"app_domain": self.domain})
        req.context.user_context = make_context_object(req, self.domain)
        # print req.context, "teh new context"
        if req.method.lower() in ['post', 'put']:

            try:
                serializer = resource.serializers["default"]
                if obj_id:
                    serializer = resource.serializers.get(obj_id, serializer)
                if resource_name:
                    serializer = resource.serializers.get(resource_name, serializer)
                print(serializer, "teh serializer")
            except (AttributeError, IndexError, KeyError):
                raise falcon.HTTPError(falcon.HTTP_NOT_IMPLEMENTED)
            else:
                try:
                    req.context["validated_data"] = validate(req, serializer)
                    # update_request_media(req, self.domain)
                except ValidationError as err:
                    print(err, "modafuckerrrrrrrrrrrr")
                    # raise HTTPError(status=status.HTTP_422 as errors=err.messages)
                    raise ValidationFailed(data=err.messages)
                    # raise falcon.HTTPError('409 ', "Validation_failed", err)

    def process_response(self, req, res, resource, req_succeeded):
        """
        performing some manipulation before the request is routed
        :param req:
        :param res:
        :param resource:
        :param req_succeeded:
        :return:
        """

        res.set_header('Access-Control-Allow-Origin', '*')

        if (req_succeeded
                and req.method == 'OPTIONS'
                and req.get_header('Access-Control-Request-Method')
        ):
            # NOTE(kgriffs): This is a CORS preflight request. Patch the
            #   resonse accordingly.

            allow = res.get_header('Allow')
            res.delete_header('Allow')

            allow_headers = req.get_header(
                'Access-Control-Request-Headers',
                default='*'
            )

            res.set_headers((
                ('Access-Control-Allow-Methods', allow),
                ('Access-Control-Allow-Headers', allow_headers),
                ('Access-Control-Max-Age', '86400'),  # 24 hours
            ))

        # print "i still ran=========================="
        splitted = req.path.split("/")
        # print len(splitted)
        keys = {}
        for i, v in enumerate(splitted):
            keys[i] = v
        # print keys
        # print req.path, req_succeeded, req.uri_template
        obj_id = req.context.get("obj_id")
        resource_name = req.context.get("resource_name")

        if req.method.lower() in ['post'] or (req.method.lower() in ['get'] and obj_id):
            try:
                serializer = resource.serializers['response']
                if obj_id:
                    serializer = resource.serializers.get("%s_response" % obj_id, serializer)
                if resource_name:
                    serializer = resource.serializers.get("%s_response" % resource_name, serializer)
                # print serializer, "teh serializer"
            except (AttributeError, IndexError, KeyError):
                return
            else:
                try:
                    data = res.media
                    print(data, "yooooooooooooooooooooooooooooooo")
                    res.media = marshal(data, serializer)
                except ValidationError as err:
                    print(err, "fuckkkkkkkkkkkkkkkkkkkkkkk")
                    # raise HTTPError(status=status.HTTP_422 as errors=err.messages)
                    raise falcon.HTTPError('409 ', "Validation_failed", "Schema was not matched")


class QueryParamsMiddleware(object):
    """
    a middleware to be use to breakdown the url pattern to process all
    query parameters sent in a GET (all) request
    """

    def __init__(self, **kwargs):
        """"""

    def process_request(self, req, res):

        self.parse_query_params(req.query_string, req)
        res.context['resp'] = {}
        # print req.context

    def parse_query_params(self, query_string, req):
        """parse the query params the come in the request"""

        # print query_string, "=============================="
        if not query_string:
            return
        query_params = dict()
        print(query_string)
        params = urllib.parse.unquote(query_string)
        print(params)
        # print params, "i am d"
        splitted = params.split("&")
        # print len(splitted)
        for i in splitted:
            # print i, i.split('=')[1]
            val = i.split('=')[1]
            print(val, type(str(val)), "val type")
            try:
                req.context[i.split('=')[0]] = json.loads(str(val))
                query_params[i.split('=')[0]] = json.loads(str(val))
            except Exception as e:
                print(e)
                req.context[i.split('=')[0]] = val
                query_params[i.split('=')[0]] = val
        req.context.query_params = query_params
        print(req.context, "the final context")

    def sort_response(self, req, res):
        """sort the response based on sort value in request context"""
        params_ = req.context.get("sort_by", [{"order_by": "date_created", "asc_desc": "descending"}])
        if not params_:
            params_ = [{"order_by": "date_created", "asc_desc": "descending"}]
        if isinstance(params_, dict):
            params_ = [params_]
        print(params_, "sorting params")
        query = res.context["results"]
        order_list = []
        for params in params_:
            print(params, "--------------")
            od = params.get("order_by", "date_created")
            sort = params.get("asc_desc", "descending")
            if sort.lower() in ['des', "desc", "descend"]:
                sort = "descending"
            if sort.lower() in ['asc', "ascend"]:
                sort = "ascending"
            direction = getattr(pymongo, sort.upper())
            op_direction = getattr(pymongo, "ascending".upper())
            order_list.append((od, direction))
        res.context['resp'].update(sort_by=params_)
        res.context["results"] = query.order_by(order_list)

    def parse_operator(self, dic):
        """parse the operator of a filter param"""

        if type(dic) in [str, str, bool, list, int, float]:
            return dic

        for k, v in dic.items():
            if k in ["$eq", "$ne", "$gt", "$gte", "$lt", "$lte"]:
                return dic
            if k in ["$ilike", "$contains"]:
                if type(v) in [str, str]:
                    print(v, "first v")
                    v = re.escape(v)
                    print(v, "escaped v")
                    v = r"%s" % v
                    v = re.compile(v, re.IGNORECASE)
                    dic = v
                else:
                    dic[k] = v
                return dic

    def filter_response(self, req, res, resource):
        """filter the response based on filter params in request context"""

        filter_params = req.context.get("filter_by", {})
        # params = req.context.get("filter_by", {})
        print(filter_params, "===djdjnf===-=")
        query = res.context["results"]
        params = dict()
        nparams = dict()
        for k, v in filter_params.items():
            nparams[k] = v
        for k, v in filter_params.items():
            params[k] = self.parse_operator(v)
        res.context['resp'].update(filter_by=nparams)
        res.context['resp'].update(count=query.raw(params).count())
        res.context["results"] = query.raw(params)

    def paginate_response(self, req, res):
        """paginate the response based on paging params in request context"""

        page_limit = res.context.get("default_page_limit", 20)

        params = req.context.get("page_by", {"page": 1, "per_page": page_limit})
        if type(params) in [str, str] or params == {} or not params:
            params = {"page": 1, "per_page": 20}
        print(params, "page params", params.items())
        print(params.items())
        page = int(params.get("page", 1))
        per_page = int(params.get("per_page", 20))
        skip = page * per_page - per_page
        # print skip, "the skip value"
        # query = res.media
        query = res.context["results"]
        count = query.count()
        np = None
        pp = None
        cc = count - (page * per_page)
        if count > per_page and cc > per_page:
            np = page + 1
        if page > 1:
            pp = page - 1
        pages = divmod(count, per_page)[0]
        if divmod(count, per_page)[1] > 1:
            pages = pages + 1
        print(count, np, pp, skip, page, per_page, '===============345============')
        page_args = dict(total=count, per_page=per_page, page=page, next_page=np, prev_page=pp, pages=pages)
        res.context['resp'].update(page_by=page_args)
        # res.context['page_args'] = page_args
        res.context["results"] = query.skip(skip).limit(per_page)

    def search_response(self, req, res, resource):
        """
        perform a search on the queried resource
        :param resource:
        :param req:
        :param res:
        :return:
        """
        params = req.context.get("query", None)
        # print params, "search params"
        search_params = []
        if not params:
            return
        searchable_fields = resource.searchable_fields
        print(searchable_fields, "===========searchable fields=========")
        for field in searchable_fields:
            params_ = re.escape(params)
            params_ = r"%s" % params_
            params_ = re.compile(params_, re.IGNORECASE)
            search_params_dict = {field: params_}
            search_params.append(search_params_dict)
        query = res.context.get("results")
        print(query)
        search_param = {"$or": search_params}
        res.context['resp'].update(query=params)
        res.context['resp'].update(count=query.raw(search_param).count())
        res.context["results"] = query.raw(search_param)

    def search_filter_response(self, req, res, resource):
        """handle the precedence of search and filter"""
        params = req.context.get("query", None)
        # filter_params = req.context.get("filter_by", {})
        res.context['resp'].update(query=None)
        res.context['resp'].update(filter_by=None)
        if params:
            self.search_response(req, res, resource)
        else:
            self.filter_response(req, res, resource)

    def process_response(self, req, res, resource, req_suc):
        """

        :param req: request object
        :param res: response object
        :param resource: resource class that produced the response
        :param req_suc:
        :return:
        """
        obj_id = req.context.get("obj_id")
        meta_only = req.context.get("query_params", {}).get("meta_only", False)
        if req.method.lower() not in ['get'] or obj_id:
            return
        resp = res.context.get("resp", {})
        print(resp, 'oonossosnso`')
        res.context.resp = resp
        res.context['resp'].update(filter_by=None, query=None, view=None, sort_by=None, page_by=None)
        if res.context.get("results", []) and not meta_only:
            self.search_filter_response(req, res, resource)
            self.paginate_response(req, res)
            self.sort_response(req, res)
            # self.search_response(req, res)
            results = list(res.context.get("results", []).all())
            serializer = resource.serializers['response']
            results = marshal(results, serializer)
            res.context['resp'].update(results=results)
            resp = res.context.get('resp')
            res.media = resp

        if meta_only:
            self.search_filter_response(req, res, resource)
            resp = res.context.get('resp')
            res.media = resp


class AuthenticateMiddleware(object):
    """
    This is a middleware that will be used to authenticate all API calls to the server.
    It works in two phases:
    1. Verify if the user account exist
    2. Verify if the user can access the resource at all
    3. Check that the user has base permissions
    """

    def __init__(self, ignored_endpoints=None, settings=None, registrar=None):
        self.ignored_endpoints = ignored_endpoints
        self.settings = settings
        self.registrar = registrar

    def process_request(self, req, res):
        """
        performing some manipulation before the request is routed
        :param req:
        :param res:
        :return:
        """
        # print req.headers
        # print req.path
        token = req.get_header('Authorization', None)
        validation_data = self.validate_token(token)

        if self.check_ignored_endpoints(req.path, self.ignored_endpoints, self.settings.API_BASE):
            pass
        elif not self.check_ignored_endpoints(req.path, self.ignored_endpoints, self.settings.API_BASE) \
                and not validation_data and token:
            description = ('The provided auth token is not valid. '
                           'Please request a new token and try again.')

            raise falcon.HTTPUnauthorized('Authentication failed',
                                          description)
        else:
            # token = req.get_header('Authorization')
            # print token
            if token is None:
                description = ('Please provide an auth token '
                               'as part of the request.')

                raise falcon.HTTPUnauthorized('Auth token required',
                                              description)
            # validation_data = self.validate_token(token)
            if not validation_data:
                description = ('The provided auth token is not valid. '
                               'Please request a new token and try again.')

                raise falcon.HTTPUnauthorized('Authentication failed',
                                              description)
            # else:
        req.context.user_context = validation_data

    def validate_issuer(self, token):
        """validate the issuer of this token"""

        try:
            data = jwt.decode(token, self.settings.JWT_SECRET_KEY, iss=self.settings.JWT_ISSUER_CLAIM,
                              audience=self.settings.JWT_ISSUER_CLAIM)

            print(data)
            return data
        except InvalidIssuerError as e:
            print(e)
        except Exception as e:
            print(e)

    def validate_token(self, token):
        """check the validity of a token sent with request"""

        aud_data = self.validate_issuer(token)

        print(aud_data)
        if not aud_data:
            return {}

        data = self.validate_audience(token)

        if not data:
            data = self.validate_open_audience(token)

        return data or aud_data or {}

    def validate_audience(self, token):
        """ Validate audience assuming it is contained in the JWT """

        try:
            print(self.settings.JWT_AUDIENCE_CLAIM)
            data = jwt.decode(token, self.settings.JWT_SECRET_KEY, audience=self.settings.JWT_AUDIENCE_CLAIM)
            return data
        except InvalidAudienceError as e:
            print(e)
        except Exception as e:
            print(e)

    def validate_open_audience(self, token):
        """
        OPen audience
        """
        try:
            data = jwt.decode(token, self.settings.JWT_SECRET_KEY, audience=self.settings.JWT_ISSUER_CLAIM)
            open_app = ast.literal_eval(self.settings.OPEN_APP)
            if open_app and self.registrar:
                pro = self.registrar(**data)
                data = self.update_validation_data(data, pro)
                return data
        except InvalidAudienceError as e:
            print(e)
        except Exception as e:
            print(e)

    def check_ignored_endpoints(self, path, ignored_endpoints, base_path=''):
        """separate possible base api endpoints """

        if base_path is None:
            base_path = ""
        stripped = path.strip(base_path)
        relative_path = "/" + path.strip(base_path)
        if stripped.startswith('/'):
            relative_path = stripped
        for i in ignored_endpoints:
            l = len(i)
            if i[:] == relative_path[:l]:
                return True
        return False

    def update_validation_data(self, data, profile):
        """
        add more validation info to the validation data to include
        on the fly profiles created
        """
        aud = data.get("aud", [])
        profiles = data.get("profiles", [{}])
        print("====================", aud, profiles)
        data.update(aud=[p for p in aud] + [self.settings.JWT_AUDIENCE_CLAIM],
                    profiles=[p for p in profiles] + [profile])
        return data

#
#
# class UrlEncodedFormHandler(BaseHandler):
#     """Handler built using ...."""
#
#     def deserialize(self, raw):
#         """
#
#         :param raw:
#         :return:
#         """
#         parsed = parse_qs(raw)
#         deserialized = {}
#         print("sosn", parsed)
#         for k, v in parsed.items():
#
#             if type(v) is list and len(v) > 1:
#                 update = v
#             else:
#                 update = ''.join(v)
#             deserialized[k] = update
#         print(deserialized)
#         return deserialized
#
#     def serialize(self, media):
#         """
#
#         :param media:
#         :return:
#         """
#         result = media.values()
#
#         result = str("".join(result))
#         if six.PY3 or not isinstance(result, bytes):
#             return result.encode('utf-8')
#         return result
