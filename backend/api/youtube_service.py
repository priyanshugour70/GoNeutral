from datetime import datetime
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from django.conf import settings
from .models import Video, SearchQuery

def fetch_youtube_videos(query, max_results=10):
    """
    Fetch videos from YouTube API and store in DB.
    """
    api_key = settings.YOUTUBE_API_KEY
    if not api_key:
        return {"status": "error", "message": "YouTube API Key is missing"}
    
    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
        
        search_response = youtube.search().list(
            q=query,
            type='video',
            part='id,snippet',
            maxResults=max_results
        ).execute()
        
        if 'items' not in search_response or not search_response['items']:
            SearchQuery.objects.create(query=query, results_count=0)
            return {"status": "success", "message": f"No videos found for query: {query}"}
        
        video_ids = [item['id']['videoId'] for item in search_response['items']]
        
        videos_response = youtube.videos().list(
            id=','.join(video_ids),
            part='snippet,statistics,contentDetails'
        ).execute()
        
        processed_count = 0
        for item in videos_response['items']:
            video_id = item['id']
            snippet = item['snippet']
            statistics = item['statistics']
            
            try:
                published_date = datetime.strptime(snippet['publishedAt'], "%Y-%m-%dT%H:%M:%SZ")
            except ValueError:
                try:
                    published_date = datetime.strptime(snippet['publishedAt'], "%Y-%m-%dT%H:%M:%S.%fZ")
                except ValueError:
                    published_date = datetime.now()
            
            likes_count = int(statistics.get('likeCount', 0))
            view_count = int(statistics.get('viewCount', 0))
            
            thumbnails = snippet.get('thumbnails', {})
            if 'maxres' in thumbnails:
                thumbnail_url = thumbnails['maxres']['url']
            elif 'high' in thumbnails:
                thumbnail_url = thumbnails['high']['url']
            elif 'medium' in thumbnails:
                thumbnail_url = thumbnails['medium']['url']
            elif 'default' in thumbnails:
                thumbnail_url = thumbnails['default']['url']
            else:
                thumbnail_url = ''
            
            video, created = Video.objects.update_or_create(
                video_id=video_id,
                defaults={
                    'title': snippet.get('title', ''),
                    'description': snippet.get('description', ''),
                    'url': f'https://www.youtube.com/watch?v={video_id}',
                    'published_date': published_date,
                    'thumbnail_url': thumbnail_url,
                    'likes_count': likes_count,
                    'view_count': view_count,
                }
            )
            processed_count += 1
        
        SearchQuery.objects.create(query=query, results_count=processed_count)
        
        return {
            "status": "success", 
            "message": f"Processed {processed_count} videos for query: {query}",
            "videos_count": processed_count
        }
    
    except HttpError as e:
        return {"status": "error", "message": f"YouTube API error: {str(e)}"}
    except Exception as e:
        return {"status": "error", "message": f"Error fetching YouTube videos: {str(e)}"}