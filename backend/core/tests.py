from rest_framework.test import APITestCase
from rest_framework import status

from .models import SiteSettings


class SiteSettingsModelTests(APITestCase):
    def test_load_creates_default_row_if_none_exists(self):
        self.assertEqual(SiteSettings.objects.count(), 0)
        settings_obj = SiteSettings.load()
        self.assertEqual(SiteSettings.objects.count(), 1)
        self.assertEqual(settings_obj.pk, 1)

    def test_save_always_enforces_singleton_pk(self):
        SiteSettings.objects.create(shop_name="First")
        SiteSettings.objects.create(shop_name="Second")
        self.assertEqual(SiteSettings.objects.count(), 1)
        self.assertEqual(SiteSettings.objects.first().shop_name, "Second")


class SiteSettingsAPITests(APITestCase):
    def test_endpoint_returns_defaults_on_first_request(self):
        response = self.client.get("/api/site-settings/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["shop_name"], "Hiroshyma.Oyk")

    def test_opening_hours_split_into_lines(self):
        settings_obj = SiteSettings.load()
        settings_obj.opening_hours = "Mon - Fri: 9am - 6pm\nSat: 10am - 4pm"
        settings_obj.save()
        response = self.client.get("/api/site-settings/")
        self.assertEqual(
            response.data["opening_hours_lines"],
            ["Mon - Fri: 9am - 6pm", "Sat: 10am - 4pm"],
        )
