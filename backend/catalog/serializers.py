from rest_framework import serializers
from .models import Product, ProductImage, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image", "alt_text", "display_order"]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for grid/listing views — avoids sending the
    full description or every image on a page that just needs a thumbnail."""

    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "price",
            "category_name",
            "category_slug",
            "thumbnail",
            "is_featured",
            "in_stock",
        ]

    def get_thumbnail(self, obj):
        # obj.images.all() hits the prefetch cache set up in the view's queryset —
        # this does NOT trigger a new query per product as long as the view
        # used prefetch_related("images").
        images = list(obj.images.all())
        if not images:
            return None
        request = self.context.get("request")
        url = images[0].image.url
        return request.build_absolute_uri(url) if request else url


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "available_sizes",
            "stock_quantity",
            "in_stock",
            "category",
            "images",
        ]
