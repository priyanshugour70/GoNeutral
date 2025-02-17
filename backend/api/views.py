from django.db.models import Q
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Video, SearchQuery
from .serializers import VideoSerializer, SearchQuerySerializer
from .youtube_service import fetch_youtube_videos

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })

class VideoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    pagination_class = CustomPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['published_date', 'likes_count', 'view_count']
    
    @extend_schema(
        parameters=[
            OpenApiParameter(name='keyword', description='Search in title and description', type=str),
            OpenApiParameter(name='min_likes', description='Minimum likes count', type=int),
            OpenApiParameter(name='start_date', description='Filter by start date (format: YYYY-MM-DD)', type=str),
            OpenApiParameter(name='end_date', description='Filter by end date (format: YYYY-MM-DD)', type=str),
            OpenApiParameter(name='ordering', description='Order by field (likes, date, views)', 
                           enum=['-likes_count', '-published_date', '-view_count']),
        ]
    )
    @method_decorator(cache_page(60*5))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = Video.objects.all()
        
        keyword = self.request.query_params.get('keyword')
        min_likes = self.request.query_params.get('min_likes')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        ordering = self.request.query_params.get('ordering')
        
        if keyword:
            queryset = queryset.filter(
                Q(title__icontains=keyword) | Q(description__icontains=keyword)
            )
        
        if min_likes:
            try:
                min_likes = int(min_likes)
                queryset = queryset.filter(likes_count__gte=min_likes)
            except (ValueError, TypeError):
                pass
        
        if start_date:
            queryset = queryset.filter(published_date__gte=start_date)
        
        if end_date:
            queryset = queryset.filter(published_date__lte=end_date)
        
        if ordering:
            if ordering == 'likes':
                queryset = queryset.order_by('-likes_count')
            elif ordering == 'date':
                queryset = queryset.order_by('-published_date')
            elif ordering == 'views':
                queryset = queryset.order_by('-view_count')
            elif ordering.startswith('-'):
                valid_fields = ['likes_count', 'published_date', 'view_count']
                if ordering[1:] in valid_fields:
                    queryset = queryset.order_by(ordering)
        
        return queryset
    
    @extend_schema(
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'query': {'type': 'string'},
                    'max_results': {'type': 'integer', 'default': 10}
                },
                'required': ['query']
            }
        },
        responses={200: None}
    )
    @action(detail=False, methods=['post'])
    def search_youtube(self, request):
        query = request.data.get('query')
        max_results = request.data.get('max_results', 10)
        
        if not query:
            return Response(
                {'error': 'Query parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            max_results = int(max_results)
            if max_results < 1 or max_results > 50:
                max_results = 10
        except (ValueError, TypeError):
            max_results = 10
        
        result = fetch_youtube_videos(query, max_results)
        return Response(result, status=status.HTTP_200_OK)

class SearchQueryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SearchQuery.objects.all().order_by('-timestamp')
    serializer_class = SearchQuerySerializer
    pagination_class = CustomPagination