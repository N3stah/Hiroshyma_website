from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status

from .models import PortfolioItem

# Smallest possible valid GIF (1x1 pixel) used as dummy upload data --
# real image bytes are needed since PortfolioItem.image has no blank=True.
TINY_GIF = (
    b"GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,"
    b"\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
)


def make_dummy_image(name="test.gif"):
    return SimpleUploadedFile(name, TINY_GIF, content_type="image/gif")


class PortfolioAPITests(APITestCase):
    def setUp(self):
        for i in range(11):
            PortfolioItem.objects.create(
                title=f"Custom Logo Project {i}",
                category="branding" if i % 2 == 0 else "apparel",
                description="Sample portfolio piece",
                image=make_dummy_image(f"test{i}.gif"),
            )

    def test_first_page_returns_nine_items_with_next_cursor(self):
        response = self.client.get("/api/portfolio/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 9)
        self.assertIsNotNone(response.data["next"])

    def test_second_page_via_next_cursor_returns_remaining_items(self):
        first = self.client.get("/api/portfolio/")
        second = self.client.get(first.data["next"])
        self.assertEqual(second.status_code, status.HTTP_200_OK)
        self.assertEqual(len(second.data["results"]), 2)

    def test_category_filter(self):
        response = self.client.get("/api/portfolio/?category=branding")
        for item in response.data["results"]:
            self.assertEqual(item["category"], "branding")

    def test_no_duplicate_items_across_pages(self):
        seen_ids = set()
        url = "/api/portfolio/"
        while url:
            response = self.client.get(url)
            for item in response.data["results"]:
                self.assertNotIn(item["id"], seen_ids)
                seen_ids.add(item["id"])
            url = response.data["next"]
        self.assertEqual(len(seen_ids), 11)
