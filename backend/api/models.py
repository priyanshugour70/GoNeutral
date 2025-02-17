from django.db import models

class Video(models.Model):
    video_id = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    url = models.URLField()
    published_date = models.DateTimeField()
    thumbnail_url = models.URLField()
    likes_count = models.IntegerField(default=0)
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_date']
        indexes = [
            models.Index(fields=['published_date']),
            models.Index(fields=['likes_count']),
            models.Index(fields=['view_count']),
        ]

    def __str__(self):
        return self.title
    
class SearchQuery(models.Model):
    query = models.CharField(max_length=255)
    results_count = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.query} ({self.results_count} results)"