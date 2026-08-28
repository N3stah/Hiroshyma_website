from django.urls import path
from .views import CustomInquiryCreateView

urlpatterns = [
    path("inquiries/", CustomInquiryCreateView.as_view(), name="inquiry-create"),
]
