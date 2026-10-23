import os

import firebase_admin
from firebase_admin import credentials


def initialize_firebase_admin():
    """
    Initialize Firebase Admin SDK once for the Flask backend.
    """

    if firebase_admin._apps:
        return firebase_admin.get_app()

    service_account_path = os.getenv(
        "FIREBASE_SERVICE_ACCOUNT_PATH"
    )

    if not service_account_path:
        raise RuntimeError(
            "FIREBASE_SERVICE_ACCOUNT_PATH is not configured."
        )

    if not os.path.isabs(service_account_path):
        service_account_path = os.path.abspath(
            service_account_path
        )

    if not os.path.isfile(service_account_path):
        raise FileNotFoundError(
            "Firebase service account JSON file was not found."
        )

    credential = credentials.Certificate(
        service_account_path
    )

    return firebase_admin.initialize_app(credential)