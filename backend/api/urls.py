from django.urls import path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

from . import views

urlpatterns = [
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    #
    # Reviews
    path("reviews/", views.ReviewListCreate.as_view()),
    path("reviews/<str:pk>", views.ReviewDetails.as_view()),
    path("reviews/fetch/", views.fetchDatasetFromDOI),
    path("reviews/<str:id>/stats/", views.getFieldCount),
    path("reviews/<str:id>/files/", views.getFilesByReviewId),
    path("reviews/<str:id>/open/", views.getOpenFieldsByReviewId),
    path("reviews/doi/<str:doi>", views.getReviewsByDatasetDOI),
    path("reviews/reviewer/<str:id>", views.getReviewByReviewer),
    #
    # Reviewers
    path("reviewers/", views.ReviewerListCreate.as_view()),
    path("reviewers/<str:pk>", views.ReviewerDetails.as_view()),
    #
    # Files
    path("files/<str:pk>", views.FileDetails.as_view()),
    #
    # Fields
    path("fields/<str:pk>", views.FieldDetails.as_view()),
    #
    # Messages
    path("messages/", views.MessageCreate.as_view()),
    path("messages/<str:pk>", views.MessageDetails.as_view()),
]
