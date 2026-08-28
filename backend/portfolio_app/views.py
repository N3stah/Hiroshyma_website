from rest_framework import generics
from rest_framework.pagination import CursorPagination

from .models import PortfolioItem
from .serializers import PortfolioItemSerializer


class PortfolioCursorPagination(CursorPagination):
    page_size = 9
    # Cursor pagination requires a stable, indexed ordering field. Using
    # created_at (indexed in Meta) means "give me the 9 rows after this
    # timestamp" — an index seek, regardless of how deep the user has
    # scrolled. Offset pagination (LIMIT 9 OFFSET 900) would instead force
    # Postgres to walk and discard 900 rows first, getting slower with depth.
    ordering = "-created_at"


class PortfolioListView(generics.ListAPIView):
    """
    GET /api/portfolio/
    GET /api/portfolio/?category=branding
    GET /api/portfolio/?cursor=<opaque cursor from previous response's "next">
    """

    serializer_class = PortfolioItemSerializer
    pagination_class = PortfolioCursorPagination

    def get_queryset(self):
        qs = PortfolioItem.objects.all()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
