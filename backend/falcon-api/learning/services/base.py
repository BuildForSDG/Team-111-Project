from datetime import datetime

from bson import ObjectId
from learning.custom.errors import *


def clean_kwargs(ignored_keys, data):
    """
    Removes the ignored_keys from the data sent

    ignored_keys: keys to remove from the data (list or tuple)
    data: data to be cleaned (dict)

    returns: cleaned data
    """

    for key in ignored_keys:
        data.pop(key, None)

    return data


def populate_obj(obj, data):
    """
    Populates an object with the data passed to it

    param obj: Object to be populated
    param data: The data to populate it with (dict)

    returns: obj populated with data


    """
    for name, value in data.items():
        if hasattr(obj, name):
            setattr(obj, name, value)

    return obj


class ServiceFactory(object):
    """
    Service factory generator. This class will produce other service classes required by any application that uses it.
    """

    @classmethod
    def create_service(cls, klass):
        """ create and generate a service class using the parameters above """

        class BaseService:
            model_class = klass
            objects = klass.objects

            @classmethod
            def _prepare_id(cls, obj_id):
                """ Determine whether obj_id is of type ObjectId or not"""
                if not isinstance(obj_id, ObjectId) and ObjectId.is_valid(str(obj_id)):
                    obj_id = ObjectId(str(obj_id))

                return obj_id

            @classmethod
            def get(cls, obj_id):
                """ Get a single object from the database collection """

                _obj_id = obj_id
                obj_id = cls._prepare_id(obj_id)

                try:
                    obj = cls.model_class.objects.get({"_id": obj_id})
                    return obj
                except klass.DoesNotExist:
                    print("object doesn't exist")
                    raise ObjectNotFoundException(cls.model_class, _obj_id)
                except Exception as e:
                    print( e)
                    raise

            @classmethod
            def find_one(cls, params):
                """ Find a single object that matches the criteria within the parameters """

                try:
                    obj = cls.model_class.objects.get(params)
                    return obj
                except klass.DoesNotExist:
                    print( "Could not find any object that matches this criteria")
                    return
                except Exception as e:
                    print( e)
                    raise

            @classmethod
            def create(cls, ignored_args=None, **kwargs):
                """ base create method."""

                if not ignored_args:
                    ignored_args = ["_id", "date_created", "last_updated"]

                obj = cls.model_class()
                data = clean_kwargs(ignored_args, kwargs)
                obj = populate_obj(obj, data)

                try:
                    obj.save()
                    return obj
                except Exception as e:
                    print( e)
                    raise

            @classmethod
            def bulk_create(cls, ignored_args=None, entries=[], full_clean=False, retrieve=False, **kwargs):
                """ Create multiple objects using data in the entries list """

                if not ignored_args:
                    ignored_args = ["_id", "date_created", "last_updated"]

                cleaned_entries = [populate_obj(cls.model_class(), clean_kwargs(ignored_args, entry)) for
                                   entry in entries]
                try:
                    results = cls.objects.bulk_create(cleaned_entries, full_clean=full_clean, retrieve=retrieve)
                    return results
                except Exception as e:
                    print( e)
                    raise

            @classmethod
            def update(cls, obj_id, ignored_args=None, **kwargs):
                """ Update an existing record. if obj_id isn't an instance of ObjectId it will first be converted """

                if not ignored_args:
                    ignored_args = ["_id", "date_created", "last_updated"]

                obj = cls.get(obj_id)
                data = clean_kwargs(ignored_args, kwargs)
                obj = populate_obj(obj, data)
                if "last_updated" in ignored_args:
                    obj.last_updated = datetime.utcnow()
                try:
                    obj.save()
                    return obj
                except Exception as e:
                    print( e)
                    raise

            @classmethod
            def bulk_update(cls, raw_query, ignored_args=None, **kwargs):
                """ Find and update records based on the raw query and data"""

                if not ignored_args:
                    ignored_args = ["_id", "date_created", "last_updated"]

                data = clean_kwargs(ignored_args, kwargs)
                data["last_updated"] = datetime.utcnow()

                try:
                    affected = cls.objects.raw(raw_query).update({"$set": data}, upsert=False)
                    return dict(status="OK", data=data, total=affected)

                except Exception as e:
                    print((e))

            @classmethod
            def update_by_ids(cls, ids=[], ignored_args=None, **kwargs):
                """ Helper function to execute bulk update """
                # Clean object Ids first
                obj_ids = [cls._prepare_id(id) for id in ids]
                raw_query = {"_id": {"$in": obj_ids}}

                return cls.bulk_update(raw_query, ignored_args=ignored_args, **kwargs)

            @classmethod
            def delete(cls, obj_id):
                """ Delete object by id """

                obj = cls.get(obj_id)

                try:
                    obj.delete()
                    return obj
                except Exception as e:
                    print( e)
                    raise

            @classmethod
            def bulk_delete(cls, raw_query, ignored_args=None, **kwargs):
                """ Delete all objects that match the query criteria """

                try:
                    affected = cls.objects.raw(raw_query).delete()
                    return dict(status="OK", total=affected)

                except Exception as e:
                    print(e)

            @classmethod
            def delete_by_ids(cls, ids=[], **kwargs):
                """ Helper function to manipulate bulk delete or update by ids """

                # Clean object Ids first
                obj_ids = [cls._prepare_id(id) for id in ids]
                raw_query = {"_id": {"$in": obj_ids}}
                return cls.bulk_delete(raw_query)

        return BaseService
