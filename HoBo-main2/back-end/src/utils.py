from http.client import BAD_REQUEST
from dotenv import load_dotenv
import os
from functools import wraps
from flask import request, jsonify
from http import HTTPStatus
# import schema

load_dotenv()

def load_env_var(key: str):
    return os.getenv(key=key)

def return_response(code=HTTPStatus.OK, msg="Success", data=None):
    return jsonify({
        "code": code,
        "message": msg,
        "data": data
    }), code

def row_to_dict(row):
    return dict(zip([t[0] for t in row.cursor_description], row))

def validate_request(f, *args):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            arg = request.get_json
        except BAD_REQUEST as e:
            msg = "Payload must be a valid JSON."
            return return_response(code=404)
        # try:
        #     result = .load
        return f(*args, **kwargs)
    return wrapper

