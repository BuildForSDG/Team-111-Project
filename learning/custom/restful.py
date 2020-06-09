# coding=utf-8
def available_courses_limiter(query, **kwargs):
    """
    Available courses limiter
    """
    return query.raw({"status": "active", "user_data.account_type.code": "teacher"})
