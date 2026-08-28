from django.db import models


class PortfolioItem(models.Model):
    class PortfolioCategory(models.TextChoices):
        APPAREL = "apparel", "Apparel"
        BRANDING = "branding", "Branding & Logo"
        PRINTING = "printing", "Printing"

    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="portfolio/")
    category = models.CharField(
        max_length=20, choices=PortfolioCategory.choices, db_index=True
    )
    client_name = models.CharField(max_length=120, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["category", "-created_at"]),
        ]

    def __str__(self):
        return self.title
