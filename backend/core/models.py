from django.core.exceptions import ValidationError
from django.db import models


class SiteSettings(models.Model):
    """
    Singleton model -- there is only ever one row. Kevin edits shop contact
    and location details from /admin/ instead of them being hardcoded into
    the frontend, so hours/address/socials can change without a redeploy.
    """

    shop_name = models.CharField(max_length=100, default="Hiroshyma.Oyk")
    address = models.CharField(max_length=255, default="Nairobi CBD, Kenya")
    city = models.CharField(max_length=100, default="Nairobi")
    phone = models.CharField(max_length=20, blank=True)
    whatsapp = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)

    opening_hours = models.TextField(
        blank=True,
        default="Mon - Sat: 9:00 AM - 7:00 PM\nSunday: Closed",
        help_text="One schedule line per row, e.g. 'Mon - Fri: 9am - 6pm'",
    )

    instagram_handle = models.CharField(max_length=100, blank=True)
    twitter_handle = models.CharField(max_length=100, blank=True)

    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Site settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        # .objects.create() passes force_insert=True, which would try to
        # INSERT row 1 again on every subsequent save and collide with the
        # UNIQUE constraint on the primary key. Strip it so Django falls
        # back to its normal "UPDATE if exists, else INSERT" behavior.
        kwargs.pop("force_insert", None)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValidationError("Site settings cannot be deleted, only edited.")

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return self.shop_name
