from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Product


class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Product.objects.filter(is_active=True)

    def location(self, obj):
        # Points to the Next.js frontend product URL, not the Django API
        return f"/shop/{obj.slug}"

    def lastmod(self, obj):
        return obj.updated_at


class StaticSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.5

    def items(self):
        return ["home", "shop", "portfolio", "custom_order", "about"]

    def location(self, item):
        mapping = {
            "home": "/",
            "shop": "/shop",
            "portfolio": "/portfolio",
            "custom_order": "/custom-order",
            "about": "/about",
        }
        return mapping[item]
