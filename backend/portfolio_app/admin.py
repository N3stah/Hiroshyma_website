from django.contrib import admin
from .models import PortfolioItem


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "client_name", "completed_date", "is_featured"]
    list_filter = ["category", "is_featured"]
    list_editable = ["is_featured"]
    search_fields = ["title", "description", "client_name"]
    date_hierarchy = "created_at"
