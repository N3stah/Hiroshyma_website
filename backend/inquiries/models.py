from django.db import models


class CustomInquiry(models.Model):
    class InquiryType(models.TextChoices):
        CUSTOM_APPAREL = "custom_apparel", "Custom Apparel"
        GRAPHIC_DESIGN = "graphic_design", "Graphic Design"
        LOGO_DESIGN = "logo_design", "Logo Design"
        CARD_DESIGN = "card_design", "Card / Letter Design"
        PRINTING = "printing", "Printing Service"

    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_REVIEW = "in_review", "In Review"
        QUOTED = "quoted", "Quoted"
        COMPLETED = "completed", "Completed"

    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    inquiry_type = models.CharField(
        max_length=20, choices=InquiryType.choices, db_index=True
    )
    description = models.TextField()
    reference_image = models.ImageField(upload_to="inquiries/", blank=True, null=True)
    budget_range = models.CharField(max_length=50, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEW, db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Custom inquiries"

    def __str__(self):
        return f"{self.name} — {self.get_inquiry_type_display()}"
