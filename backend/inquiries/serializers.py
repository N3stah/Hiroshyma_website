from django.core.exceptions import ValidationError
from rest_framework import serializers
from .models import CustomInquiry

MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024  # 5MB
VALID_IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


def validate_reference_image(value):
    if value is None:
        return
    if value.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError("Image must be under 5MB.")
    content_type = getattr(value, "content_type", None)
    if content_type and content_type not in VALID_IMAGE_CONTENT_TYPES:
        raise ValidationError("Only JPEG, PNG, or WebP images are allowed.")


class CustomInquirySerializer(serializers.ModelSerializer):
    reference_image = serializers.ImageField(
        required=False, allow_null=True, validators=[validate_reference_image]
    )

    class Meta:
        model = CustomInquiry
        fields = [
            "name",
            "email",
            "phone",
            "inquiry_type",
            "description",
            "reference_image",
            "budget_range",
        ]

    def validate_description(self, value):
        cleaned = value.strip()
        if len(cleaned) < 15:
            raise serializers.ValidationError(
                "Please provide a bit more detail (15+ characters)."
            )
        return cleaned

    def validate_name(self, value):
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("Please enter your name.")
        return cleaned
