from django.contrib import admin
from adminsortable2.admin import SortableTabularInline
from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    """Plain inline without drag-to-reorder -- avoids SortableAdminBase
    requirement on ProductAdmin which crashes when Product has no integer
    ordering field. Reorder via display_order field directly."""
    model = ProductImage
    extra = 1
    fields = ["image", "alt_text", "display_order"]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "stock_quantity", "is_featured", "is_active"]
    list_filter = ["category", "is_active", "is_featured"]
    list_editable = ["price", "stock_quantity", "is_featured", "is_active"]
    search_fields = ["name", "description"]
    inlines = [ProductImageInline]
    actions = ["mark_sold_out", "mark_in_stock", "mark_featured", "mark_unfeatured", "mark_active", "mark_inactive"]
    readonly_fields = ["slug", "created_at", "updated_at"]

    fieldsets = (
        ("Product info", {"fields": ("name", "slug", "category", "description")}),
        ("Pricing & stock", {"fields": ("price", "available_sizes", "stock_quantity")}),
        ("Visibility", {"fields": ("is_active", "is_featured")}),
        ("Timestamps", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    @admin.action(description="Mark selected as Sold Out")
    def mark_sold_out(self, request, queryset):
        queryset.update(stock_quantity=0)
        self.message_user(request, f"{queryset.count()} product(s) marked as sold out.")

    @admin.action(description="Mark selected as In Stock (qty 1)")
    def mark_in_stock(self, request, queryset):
        queryset.filter(stock_quantity=0).update(stock_quantity=1)
        self.message_user(request, f"{queryset.count()} product(s) marked as in stock.")

    @admin.action(description="Mark selected as Featured")
    def mark_featured(self, request, queryset):
        queryset.update(is_featured=True)
        self.message_user(request, f"{queryset.count()} product(s) marked as featured.")

    @admin.action(description="Remove from Featured")
    def mark_unfeatured(self, request, queryset):
        queryset.update(is_featured=False)
        self.message_user(request, f"{queryset.count()} product(s) removed from featured.")

    @admin.action(description="Mark selected as Active")
    def mark_active(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} product(s) activated.")

    @admin.action(description="Mark selected as Inactive")
    def mark_inactive(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} product(s) deactivated.")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    readonly_fields = ["slug"]
