import falcon


class ObjectNotFoundException(Exception):

    def __init__(self, klass, obj_id):
        message = "%s: Object not found with id: %s" % (klass.__name__, obj_id)
        self.data = {"name": "ObjectNotFoundException", "message": message}
        super(ObjectNotFoundException, self).__init__(message)


class MissingArgumentException(Exception):
    """A base class for missing arguments in a method call"""

    def __init__(self, method, argument):
        message = "To run '%s': argument: %s is required" % (method.__name__, argument)
        find_in = "'%s': line %s " % (method.__code__.co_filename, method.__code__.co_firstlineno)
        self.data = {"name": "MissingArgumentException", "message": message, "find_at": find_in}
        super(MissingArgumentException, self).__init__(message)


class TypeErrorException(TypeError):
    """"""


class ActionFailedException(Exception):
    """A base class for missing arguments in a method call"""

    def __init__(self, method, reason):
        message = "'%s': could not complete because %s " % (method.__name__, reason)
        find_in = "'%s': line %s " % (method.__code__.co_filename, method.__code__.co_firstlineno)
        self.data = {"name": "ActionFailedException", "message": message, "find_at": find_in}
        super(ActionFailedException, self).__init__(message)


class BlogHTTPError(falcon.HTTPError):
    """
       The generic http error that can be thrown from within a falcon app
       """

    def __init__(self, status, data=None, code=None):
        """
        the initialization
        :param data:
        """
        self.data = data
        self.status = status
        self.code = code
        print("hooenenoeneoneewwwwwwwwwwwwww")
        super(BlogHTTPError, self).__init__(self.status)

    def to_dict(self, obj_type=dict):
        return self.data


class ValidationFailed(BlogHTTPError):
    """
    The generic http error that can be thrown from within a falcon app
    """

    def __init__(self, data=None, code=None):
        """
        the initialization
        :param data:
        """
        self.data = data
        self.status = "409 "
        self.code = code
        print("hooenenoeneonee")
        super(ValidationFailed, self).__init__(self.status, data=data)


class NotFoundError(BlogHTTPError):

    def __init__(self, data=None, code=None):
        """
        the initialization
        :param data:
        """
        self.data = data
        self.status = "404 Not Found"
        self.code = code
        super(NotFoundError, self).__init__(self.status, data=data)


class ObjectNotFoundError(ObjectNotFoundException):

    @staticmethod
    def handler(ex, req, resp, params):
        print("did it get here")
        raise NotFoundError(dict(message=ex, name=ObjectNotFoundError.__name__))


class BaseError(BlogHTTPError):

    def __init__(self, status, data=None, code=None):
        """
        the initialization
        :param data:
        """
        self.data = data
        self.status = status
        self.code = code
        super(BaseError, self).__init__(self.status, data=data)


class MissingArgumentError(MissingArgumentException):

    @staticmethod
    def handler(ex, req, resp, params):
        raise BaseError(falcon.HTTP_400, dict(message=ex, name=MissingArgumentError.__name__))


class ActionFailedError(ActionFailedException):

    @staticmethod
    def handler(ex, req, resp, params):
        raise BaseError(falcon.HTTP_500, dict(message=ex, name=ActionFailedException.__name__))


class UnauthorizedError(BlogHTTPError):
    """
    The generic http error that can be thrown from within a falcon app
    """

    def __init__(self, data=None, code=None):
        """
        the initialization
        :param data:
        """
        self.data = data
        self.status = "401 "
        self.code = code
        super(UnauthorizedError, self).__init__(self.status, data=data)
