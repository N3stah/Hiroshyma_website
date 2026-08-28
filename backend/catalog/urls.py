from django.urls import path
from .views import (
    CategoryListView,
    ProductListView,
    ProductDetailView,
    FeaturedProductsView,
    health_check,
)

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/featured/", FeaturedProductsView.as_view(), name="product-featured"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),
]
