from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework import generics, status
from rest_framework.response import Response

from .models import CustomInquiry
from .serializers import CustomInquirySerializer


@method_decorator(
    ratelimit(key="ip", rate="5/h", method="POST", block=False), name="post"
)
class CustomInquiryCreateView(generics.CreateAPIView):
    """
    POST /api/inquiries/

    Rate-limited to 5 submissions/hour/IP — enough headroom for a genuine
    customer who fat-fingers the form twice, tight enough to blunt bot spam.
    block=False (rather than block=True) so we control the response body
    ourselves instead of django-ratelimit's bare 403.
    """

    queryset = CustomInquiry.objects.all()
    serializer_class = CustomInquirySerializer

    def create(self, request, *args, **kwargs):
        if getattr(request, "limited", False):
            return Response(
                {"detail": "Too many inquiries submitted. Please try again in an hour."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Async email/SMS notification to Kevin hooks in here once volume
        # justifies adding Celery/Django-Q — deliberately skipped for MVP.

        return Response(
            {"message": "Inquiry received. We'll reach out within 24 hours."},
            status=status.HTTP_201_CREATED,
        )
