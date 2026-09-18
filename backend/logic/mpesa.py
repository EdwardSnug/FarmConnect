import os
import base64
from datetime import datetime

import requests


def get_access_token():
    """
    Request an OAuth access token from Safaricom Daraja.
    """

    consumer_key = os.getenv("MPESA_CONSUMER_KEY")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")

    if not consumer_key or not consumer_secret:
        raise ValueError("M-Pesa Consumer Key or Consumer Secret is missing.")

    auth_url = (
        "https://sandbox.safaricom.co.ke/"
        "oauth/v1/generate?grant_type=client_credentials"
    )

    response = requests.get(
        auth_url,
        auth=(consumer_key, consumer_secret),
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    return data["access_token"]


def generate_timestamp():
    """
    Generate the timestamp required by M-Pesa.
    Format: YYYYMMDDHHMMSS
    """

    return datetime.now().strftime("%Y%m%d%H%M%S")


def generate_password(timestamp):
    """
    Generate the Base64 encoded M-Pesa password.

    Password =
        Base64(BusinessShortCode + Passkey + Timestamp)
    """

    shortcode = os.getenv("MPESA_SHORTCODE")
    passkey = os.getenv("MPESA_PASSKEY")

    if not shortcode or not passkey:
        raise ValueError("M-Pesa shortcode or passkey is missing.")

    data_to_encode = f"{shortcode}{passkey}{timestamp}"

    encoded_password = base64.b64encode(
        data_to_encode.encode("utf-8")
    ).decode("utf-8")

    return encoded_password


def initiate_stk_push(phone_number, amount, account_reference, description):
    """
    Initiate an M-Pesa STK Push.
    """

    shortcode = os.getenv("MPESA_SHORTCODE")
    callback_url = os.getenv("MPESA_CALLBACK_URL")
    stk_push_url = os.getenv("MPESA_STK_PUSH_URL")

    if not shortcode:
        raise ValueError("MPESA_SHORTCODE is missing.")

    if not callback_url:
        raise ValueError(
            "MPESA_CALLBACK_URL is not configured yet."
        )

    if not stk_push_url:
        raise ValueError(
            "MPESA_STK_PUSH_URL is missing."
        )

    timestamp = generate_timestamp()
    password = generate_password(timestamp)
    access_token = get_access_token()

    payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(amount),
        "PartyA": phone_number,
        "PartyB": shortcode,
        "PhoneNumber": phone_number,
        "CallBackURL": callback_url,
        "AccountReference": account_reference,
        "TransactionDesc": description
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.post(
        stk_push_url,
        json=payload,
        headers=headers,
        timeout=30
    )

    response.raise_for_status()

    return response.json()