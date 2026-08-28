from django.core.cache import cache
from django.db.models import Q, Case, When, Value, IntegerField
from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics

from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductListView(generics.ListAPIView):
    """
    GET /api/products/
    GET /api/products/?category__slug=t-shirts
    GET /api/products/?q=black&ordering=price
    """

    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["category__slug", "is_featured"]
    ordering_fields = ["price", "created_at"]

    def get_queryset(self):
        # select_related: pulls Category in the SAME query (avoids an N+1
        # when the serializer reads product.category.name for every row).
        # prefetch_related: pulls all ProductImages in ONE extra batched
        # query instead of one query per product.
        qs = (
            Product.objects.filter(is_active=True)
            .select_related("category")
            .prefetch_related("images")
        )

        search = self.request.query_params.get("q")
        if search:
            # Simple weighted relevance: a name match outranks a
            # description-only match, rather than relying on DB insertion
            # order or an unweighted OR filter.
            qs = qs.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            ).annotate(
                relevance=Case(
                    When(name__icontains=search, then=Value(2)),
                    default=Value(1),
                    output_field=IntegerField(),
                )
            ).order_by("-relevance", "-created_at")

        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class FeaturedProductsView(generics.ListAPIView):
    """GET /api/products/featured/ — cached read-through, 5 min TTL."""

    serializer_class = ProductListSerializer

    def get_queryset(self):
        cached = cache.get("featured_products")
        if cached is not None:
            return cached

        qs = list(
            Product.objects.filter(is_active=True, is_featured=True)
            .select_related("category")
            .prefetch_related("images")[:8]
        )
        cache.set("featured_products", qs, timeout=300)
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"
    queryset = (
        Product.objects.filter(is_active=True)
        .select_related("category")
        .prefetch_related("images")
    )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


def health_check(request):
    """GET /api/health/ — used by an uptime pinger to keep Render's free
    tier from cold-sleeping between visits."""
    return JsonResponse({"status": "ok"})
