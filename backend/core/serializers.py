from rest_framework import serializers
from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    opening_hours_lines = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "shop_name", "address", "city", "phone", "whatsapp", "email",
            "opening_hours_lines", "instagram_handle", "twitter_handle",
            "latitude", "longitude",
        ]

    def get_opening_hours_lines(self, obj):
        return [line.strip() for line in obj.opening_hours.splitlines() if line.strip()]
