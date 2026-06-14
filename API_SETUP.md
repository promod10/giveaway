# Social Media API Setup Guide

This guide explains how to set up API credentials for YouTube, Instagram, and Facebook so the giveaway picker can fetch real comments.

## YouTube Data API v3

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown and select "New Project"
3. Enter `Giveaway Picker` as the project name
4. Click "Create" and wait for it to complete

### Step 2: Enable YouTube Data API v3
1. In the Cloud Console, search for "YouTube Data API v3" in the search bar
2. Click on "YouTube Data API v3" from results
3. Click the "Enable" button

### Step 3: Create an API Key
1. Click on "Create Credentials" (top right)
2. Select "API Key"
3. Copy the generated API key
4. Add it to your `.env` file:
```
YOUTUBE_API_KEY=your_api_key_here
```

### Step 4: Set API Restrictions (Recommended)
1. Click on the API key you just created
2. Under "API restrictions", select "YouTube Data API v3"
3. Click "Save"

---

## Instagram Graph API

### Step 1: Create a Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Select "Business" as the app type
4. Fill in the required information and click "Create App"

### Step 2: Add Instagram Basic Display Product
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Setup"
3. Follow the setup wizard steps

### Step 3: Configure Instagram Permissions
1. Go to "Settings" → "Basic"
2. Copy your "App ID" (you may need this later)
3. Go to "Instagram Basic Display" → "Basic Display"
4. Add test users or configure for production

### Step 4: Get Your Access Token
1. Go to "Instagram Basic Display" → "Tools"
2. Generate a test user access token
3. Copy the access token
4. Add to `.env`:
```
INSTAGRAM_ACCESS_TOKEN=your_access_token_here
```

**Note:** For production, you'll need to go through Instagram's app review process.

---

## Facebook Graph API

### Step 1: Use Your Existing Facebook App
You can use the same app created for Instagram, or create a new one if needed.

### Step 2: Get Your Page Access Token
1. Go to "Tools" → "Graph API Explorer"
2. Select your app from the "Application" dropdown
3. Click "Generate Access Token"
4. Select "pages_read_engagement" and "pages_read_user_profile" permissions
5. Click "Generate"
6. Copy the generated token
7. Add to `.env`:
```
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_here
```

### Step 3: Get Your Page ID
1. In the Graph API Explorer, click on the access token
2. In the request field, enter your page URL or page ID
3. Make the request and find the `id` field in the response
4. Add to `.env`:
```
FACEBOOK_PAGE_ID=your_page_id_here
```

---

## Environment Variables (.env Configuration)

Update your `backend/.env` file with the following structure:

```env
# Server
PORT=3001
MONGO_URI=mongodb://localhost:27017/giveaway

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token

# Facebook Graph API
FACEBOOK_PAGE_ACCESS_TOKEN=your_facebook_access_token
FACEBOOK_PAGE_ID=your_facebook_page_id
```

---

## Testing Your Setup

Once you've added your credentials to `.env`, restart the backend:

```bash
cd backend
npm run dev
```

Then test by submitting a giveaway with real post URLs:
- **YouTube**: `https://www.youtube.com/watch?v=VIDEO_ID`
- **Instagram**: `https://www.instagram.com/p/POST_ID/`
- **Facebook**: Your Facebook post URL

---

## API Rate Limits

- **YouTube**: 10,000 units/day free tier
- **Instagram**: 200 calls/hour (for basic display)
- **Facebook**: 200 calls/hour standard rate limit

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "YouTube API key not configured" | Add `YOUTUBE_API_KEY` to `.env` and restart |
| "Invalid YouTube URL" | Use format: `youtube.com/watch?v=VIDEO_ID` |
| "Instagram access token expired" | Generate a new token from Facebook Developers |
| "Post not found or is private" | Ensure the post is public and the URL is correct |
| "No comments found" | Post may have comments disabled |

---

## Important Security Notes

⚠️ **Never commit `.env` file to version control!**
- `.env` is already in `.gitignore`
- Keep API keys private and rotate them periodically
- For production, consider using environment secret management services
