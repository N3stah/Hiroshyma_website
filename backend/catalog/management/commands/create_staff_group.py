"""
Creates a "Store Staff" permission group scoped to exactly what Kevin needs
day-to-day: manage products/inquiries/portfolio, but not touch Django's
auth/user tables or site-wide settings.

Run once after migrations:
    python manage.py create_staff_group

Then in /admin/auth/user/, create Kevin's account with:
    is_staff = True, is_superuser = False, group = "Store Staff"
"""

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.management.base import BaseCommand

from catalog.models import Category, Product, ProductImage
from inquiries.models import CustomInquiry
from portfolio_app.models import PortfolioItem

MANAGED_MODELS = [Category, Product, ProductImage, CustomInquiry, PortfolioItem]


class Command(BaseCommand):
    help = "Create the scoped 'Store Staff' admin group"

    def handle(self, *args, **options):
        group, created = Group.objects.get_or_create(name="Store Staff")

        permissions = []
        for model in MANAGED_MODELS:
            content_type = ContentType.objects.get_for_model(model)
            permissions.extend(Permission.objects.filter(content_type=content_type))

        group.permissions.set(permissions)
        group.save()

        verb = "Created" if created else "Updated"
        self.stdout.write(
            self.style.SUCCESS(
                f"{verb} 'Store Staff' group with {len(permissions)} permissions "
                f"across {len(MANAGED_MODELS)} models."
            )
        )
