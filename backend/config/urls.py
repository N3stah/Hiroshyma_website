from django.contrib.sitemaps.views import sitemap
from catalog.sitemaps import ProductSitemap, StaticSitemap

sitemaps = {
    "products": ProductSitemap,
    "static": StaticSitemap,
}
from django.contrib import admin
from config.admin_site import HiroshymaAdminSite
admin.site.__class__ = HiroshymaAdminSite
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from . import admin_branding  # noqa: F401 -- applies site_header/site_title on import

urlpatterns = [
    path("sitemap.xml", sitemap, {"sitemaps": sitemaps}, name="django.contrib.sitemaps.views.sitemap"),
    path("admin/", admin.site.urls),
    path("api/", include("catalog.urls")),
    path("api/", include("inquiries.urls")),
    path("api/", include("portfolio_app.urls")),
    path("api/", include("core.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
