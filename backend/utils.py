import json

def safe_json_load(value):
    if isinstance(value, str):
        return json.loads(value)
    return value