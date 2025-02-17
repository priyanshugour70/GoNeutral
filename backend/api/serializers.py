from rest_framework import serializers
from .models import Video, SearchQuery

class VideoSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = ['id', 'video_id', 'title', 'description', 'url', 
                 'published_date', 'thumbnail', 'thumbnail_url', 'likes_count', 
                 'view_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_thumbnail(self, obj):
        return {
            'url': obj.thumbnail_url,
            'alt_text': f"Thumbnail for {obj.title}"
        }

class SearchQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchQuery
        fields = ['id', 'query', 'results_count', 'timestamp']
        read_only_fields = ['id', 'timestamp']
