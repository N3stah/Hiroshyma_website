from django.contrib import admin
from django.contrib.admin import AdminSite


class HiroshymaAdminSite(AdminSite):
    site_header = "Hiroshyma.Oyk Admin"
    site_title = "Hiroshyma.Oyk"
    index_title = "Store Management"

    def index(self, request, extra_context=None):
        from inquiries.models import CustomInquiry
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        week_ago = now - timedelta(days=7)

        stats = [
            ("New", CustomInquiry.objects.filter(status="new").count(), "#00F0FF"),
            ("In Review", CustomInquiry.objects.filter(status="in_review").count(), "#C9A227"),
            ("Quoted", CustomInquiry.objects.filter(status="quoted").count(), "#8A8A8A"),
            ("Completed", CustomInquiry.objects.filter(status="completed").count(), "#4ade80"),
            ("This Week", CustomInquiry.objects.filter(created_at__gte=week_ago).count(), "#F5F3EE"),
        ]

        extra_context = extra_context or {}
        extra_context["inquiry_stats"] = stats
        return super().index(request, extra_context=extra_context)
