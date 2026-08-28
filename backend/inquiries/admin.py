from django.contrib import admin
from .models import CustomInquiry


@admin.register(CustomInquiry)
class CustomInquiryAdmin(admin.ModelAdmin):
    list_display = ["name", "inquiry_type", "status", "budget_range", "created_at"]
    list_filter = ["status", "inquiry_type", "created_at"]
    list_editable = ["status"]  # update status straight from the list view, no detail-page trip
    readonly_fields = ["created_at"]
    search_fields = ["name", "email", "phone", "description"]
    date_hierarchy = "created_at"

    fieldsets = (
        ("Contact", {"fields": ("name", "email", "phone")}),
        ("Request details", {"fields": ("inquiry_type", "description", "reference_image", "budget_range")}),
        ("Pipeline", {"fields": ("status", "created_at")}),
    )

    def get_readonly_fields(self, request, obj=None):
        # Staff can change status, but shouldn't be able to rewrite what the
        # customer originally submitted — keeps the record trustworthy.
        if obj:
            return self.readonly_fields + ["name", "email", "phone", "description", "reference_image"]
        return self.readonly_fields
