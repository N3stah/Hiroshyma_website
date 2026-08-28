from django.core.cache import cache
from rest_framework.test import APITestCase
from rest_framework import status

from .models import CustomInquiry


class CustomInquiryAPITests(APITestCase):
    def setUp(self):
        cache.clear()
        self.valid_payload = {
            "name": "Wanjiru Kamau",
            "email": "wanjiru@example.com",
            "phone": "0712345678",
            "inquiry_type": "custom_apparel",
            "description": "I'd like 20 custom hoodies with our sacco logo printed on the back.",
            "budget_range": "20000-30000",
        }

    def test_valid_submission_creates_inquiry(self):
        response = self.client.post("/api/inquiries/", self.valid_payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomInquiry.objects.count(), 1)
        inquiry = CustomInquiry.objects.first()
        self.assertEqual(inquiry.status, CustomInquiry.Status.NEW)

    def test_description_too_short_is_rejected(self):
        payload = {**self.valid_payload, "description": "too short"}
        response = self.client.post("/api/inquiries/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("description", response.data)
        self.assertEqual(CustomInquiry.objects.count(), 0)

    def test_invalid_email_is_rejected(self):
        payload = {**self.valid_payload, "email": "not-an-email"}
        response = self.client.post("/api/inquiries/", payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_sixth_submission_in_an_hour_is_rate_limited(self):
        for _ in range(5):
            response = self.client.post("/api/inquiries/", self.valid_payload)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        sixth_response = self.client.post("/api/inquiries/", self.valid_payload)
        self.assertEqual(sixth_response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
        self.assertEqual(CustomInquiry.objects.count(), 5)