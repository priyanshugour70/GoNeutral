from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoViewSet, SearchQueryViewSet

router = DefaultRouter()
router.register(r'videos', VideoViewSet)
router.register(r'searches', SearchQueryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]