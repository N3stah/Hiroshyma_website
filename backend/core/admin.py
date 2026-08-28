from django.contrib import admin
from django.shortcuts import redirect
from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Shop identity", {"fields": ("shop_name",)}),
        ("Location", {"fields": ("address", "city", "latitude", "longitude")}),
        ("Contact", {"fields": ("phone", "whatsapp", "email")}),
        ("Hours", {"fields": ("opening_hours",)}),
        ("Social", {"fields": ("instagram_handle", "twitter_handle")}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = SiteSettings.load()
        return redirect("admin:core_sitesettings_change", obj.pk)
