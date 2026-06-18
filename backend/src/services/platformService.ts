import axios from 'axios';

const mockUsers = [
  '@alex_dev', '@sarah_codes', '@mike_js', '@emma_ts', '@yogesh_veu', '@yogesh_gandu',
  '@yogesh_babu', '@john_react', '@dogesh_babu', '@lisa_node', '@chris_db', '@anna_css',
  '@pramod10', '@nina_html', '@tom_vue', '@lucy_angular', '@sam_python', '@kate_java', '@ryan_ruby'
];

const fallbackComments = (platform: string): string[] => {
  console.warn(`No API credentials configured for ${platform}. Falling back to mock comments.`);
  return mockUsers;
};

// Extract video ID from YouTube URL
const extractYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Extract Instagram post ID from URL
const extractInstagramPostId = (url: string): string | null => {
  const pattern = /instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
};

// Extract Facebook post ID from URL
const extractFacebookPostId = (url: string): string | null => {
  const pattern = /facebook\.com\/.*\/posts\/(\d+)|facebook\.com\/photo\.php\?fbid=(\d+)|facebook\.com\/permalink\.php\?story_fbid=(\d+)/;
  const match = url.match(pattern);
  return match ? (match[1] || match[2] || match[3]) : null;
};

// Fetch YouTube comments
export const fetchYouTubeComments = async (url: string): Promise<string[]> => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL. Expected format: youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID');
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return fallbackComments('YouTube');
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
      params: {
        part: 'snippet',
        videoId: videoId,
        maxResults: 100,
        textFormat: 'plainText',
        key: apiKey,
      },
      timeout: 10000,
    });

    const comments = response.data.items?.map((item: any) => {
      const author = item.snippet.topLevelComment.snippet.authorDisplayName;
      return `@${author.replace(/\s+/g, '_').toLowerCase()}`;
    }) || [];

    if (comments.length === 0) {
      throw new Error('No comments found for this video. Video may have comments disabled.');
    }

    return comments;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error('YouTube API key is invalid or expired.');
    }
    if (error.response?.status === 404) {
      throw new Error('Video not found or has been deleted.');
    }
    if (error.response?.data?.error?.message) {
      throw new Error(`YouTube API: ${error.response.data.error.message}`);
    }
    throw error;
  }
};

// Fetch Instagram comments
export const fetchInstagramComments = async (url: string): Promise<string[]> => {
  const postId = extractInstagramPostId(url);
  if (!postId) {
    throw new Error('Invalid Instagram URL. Expected format: instagram.com/p/POST_ID/ or instagram.com/reel/REEL_ID/');
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    return fallbackComments('Instagram');
  }

  try {
    const response = await axios.get(`https://graph.instagram.com/v18.0/${postId}`, {
      params: {
        fields: 'comments.limit(100){username,text}',
        access_token: accessToken,
      },
      timeout: 10000,
    });

    const comments = response.data.comments?.data?.map((item: any) => `@${item.username}`) || [];

    if (comments.length === 0) {
      throw new Error('No comments found for this post. Post may have comments disabled.');
    }

    return comments;
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      throw new Error('Invalid Instagram post ID or access token expired.');
    }
    if (error.response?.status === 404) {
      throw new Error('Instagram post not found or is private.');
    }
    if (error.response?.data?.error?.message) {
      throw new Error(`Instagram API: ${error.response.data.error.message}`);
    }
    throw error;
  }
};

// Fetch Facebook comments
export const fetchFacebookComments = async (url: string): Promise<string[]> => {
  const postId = extractFacebookPostId(url);
  if (!postId) {
    throw new Error('Invalid Facebook URL. Expected format: facebook.com/*/posts/POST_ID');
  }

  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!accessToken) {
    return fallbackComments('Facebook');
  }

  try {
    const response = await axios.get(`https://graph.facebook.com/v18.0/${postId}/comments`, {
      params: {
        fields: 'from.fields(name)',
        limit: 100,
        access_token: accessToken,
      },
      timeout: 10000,
    });

    const comments = response.data.data?.map((item: any) => 
      `@${item.from.name.replace(/\s+/g, '_').toLowerCase()}`
    ) || [];

    if (comments.length === 0) {
      throw new Error('No comments found for this post. Post may have comments disabled.');
    }

    return comments;
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 403) {
      throw new Error('Invalid Facebook post ID or access token expired.');
    }
    if (error.response?.status === 404) {
      throw new Error('Facebook post not found or is private.');
    }
    if (error.response?.data?.error?.message) {
      throw new Error(`Facebook API: ${error.response.data.error.message}`);
    }
    throw error;
  }
};

// Main function to fetch comments based on platform
export const fetchCommentsFromPlatform = async (platform: string, url: string): Promise<string[]> => {
  const normalizedPlatform = platform.toLowerCase().trim();

  switch (normalizedPlatform) {
    case 'youtube':
      return await fetchYouTubeComments(url);
    case 'instagram':
      return await fetchInstagramComments(url);
    case 'facebook':
      return await fetchFacebookComments(url);
    default:
      throw new Error(`Unsupported platform: ${platform}. Supported platforms: YouTube, Instagram, Facebook`);
  }
};
