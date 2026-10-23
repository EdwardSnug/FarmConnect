from functools import wraps

from flask import request, jsonify, g
from firebase_admin import auth


def firebase_required(view_function):
    """
    Require a valid Firebase ID token for a protected route.
    """

    @wraps(view_function)
    def wrapped(*args, **kwargs):
        authorization = request.headers.get("Authorization", "")

        if not authorization.startswith("Bearer "):
            return jsonify({
                "error": "Authentication required."
            }), 401

        id_token = authorization.split(" ", 1)[1].strip()

        if not id_token:
            return jsonify({
                "error": "Firebase ID token is missing."
            }), 401

        try:
            decoded_token = auth.verify_id_token(id_token)

            # Obtain the UID from the verified token.
            g.firebase_uid = decoded_token["uid"]

        except Exception:
            return jsonify({
                "error": "Invalid or expired authentication token."
            }), 401

        return view_function(*args, **kwargs)

    return wrapped