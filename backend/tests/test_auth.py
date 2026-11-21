import hashlib
import hmac
import json
import time
import unittest
from urllib.parse import urlencode
from unittest.mock import patch

from fastapi import HTTPException

from app.main import validate_telegram_init_data

BOT_TOKEN = "123456:TEST_TOKEN"


def signed_init_data(user=None, auth_date=None):
    fields = {
        "auth_date": str(auth_date if auth_date is not None else int(time.time())),
        "user": json.dumps(user or {"id": 42, "first_name": "Giftora Tester"}, separators=(",", ":")),
        "query_id": "AAE-test-query",
    }
    check = "\n".join(f"{key}={value}" for key, value in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
    fields["hash"] = hmac.new(secret, check.encode(), hashlib.sha256).hexdigest()
    return urlencode(fields)


class TelegramInitDataTests(unittest.TestCase):
    def test_accepts_valid_signed_user(self):
        result = validate_telegram_init_data(signed_init_data(), BOT_TOKEN)
        self.assertEqual(result["id"], 42)
        self.assertEqual(result["first_name"], "Giftora Tester")

    def test_rejects_tampered_payload(self):
        payload = signed_init_data().replace("Giftora+Tester", "Attacker")
        with self.assertRaises(HTTPException) as error:
            validate_telegram_init_data(payload, BOT_TOKEN)
        self.assertEqual(error.exception.status_code, 401)

    def test_rejects_expired_payload(self):
        payload = signed_init_data(auth_date=int(time.time()) - 90000)
        with self.assertRaises(HTTPException) as error:
            validate_telegram_init_data(payload, BOT_TOKEN)
        self.assertEqual(error.exception.status_code, 401)

    def test_rejects_duplicate_fields(self):
        payload = signed_init_data() + "&auth_date=1"
        with self.assertRaises(HTTPException) as error:
            validate_telegram_init_data(payload, BOT_TOKEN)
        self.assertEqual(error.exception.status_code, 401)

    def test_requires_bot_token(self):
        with self.assertRaises(HTTPException) as error:
            validate_telegram_init_data(signed_init_data(), "")
        self.assertEqual(error.exception.status_code, 503)


if __name__ == "__main__":
    unittest.main()
