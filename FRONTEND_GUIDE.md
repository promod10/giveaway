# LuckyPick Frontend Development & Integration Guide

Welcome to the **Universal Giveaway Comment Picker** frontend guide! This document outlines the user interface structure, custom styling, API integrations, and the roadmap for connecting real social media APIs to replace the mocked backend commenters.

We have scaffolded and verified a fully working, premium-designed React + Vite + TypeScript + Tailwind CSS application at `E:\personal projects\pramod\giveaway\frontend`. It compiles cleanly and is configured to connect to your Express backend.

---

## 📁 Frontend Directory Architecture

The frontend boilerplate is organized as follows:

```
frontend/
├── index.html                  # Main entry page (contains SEO titles and meta tags)
├── vite.config.ts              # Vite config integrated with @tailwindcss/vite (Tailwind v4)
├── package.json                # Project dependencies (React 19, Axios, Lucide Icons, Confetti)
└── src/
    ├── main.tsx                # App entry mounting point
    ├── App.tsx                 # Core page state manager (orchestrates forms, animations, and history)
    ├── App.css                 # Unused (cleared to avoid conflict)
    ├── index.css               # Google fonts, Tailwind imports, and custom glow/glassmorphism utilities
    ├── api.ts                  # Axios API client client with TypeScript interfaces
    └── components/
        ├── Header.tsx          # Responsive navigation bar with links
        ├── SocialIcons.tsx     # Custom SVG brand icons (YouTube, Instagram, Facebook, GitHub)
        ├── GiveawayForm.tsx    # Form with platform selector, URL validation, and winner amount constraints
        ├── WinnerCelebration.tsx# Confetti celebration and rapid comment-shuffling animation
        └── HistoryLedger.tsx   # Elegant ledger rendering history fetched from MongoDB
```

---

## 🎨 UI/UX Design System & Custom Classes

The application implements a premium, dark-mode design system utilizing **Tailwind CSS v4**'s `@import "tailwindcss";` syntax. Configured variables and helper classes are defined inside [index.css](file:///E:/personal%20projects/pramod/giveaway/frontend/src/index.css):

*   **Colors**: Sleek deep indigo-dark background (`#060913`) overlaid with glowing radial gradients (violet, blue, pink highlights).
*   **Typography**: Google Fonts integration (`Outfit` for headlines, `Inter` for regular body text).
*   **Glassmorphism (`.glass-panel`)**: Transparent card panels with `backdrop-filter: blur(16px)` and subtle white borders.
*   **Glow Inputs (`.glass-input`)**: Deep dark inputs with smooth transit animations that glow violet when focused.
*   **Action Button (`.glow-btn`)**: Gradient-purple button moving slightly on hover and click with a dynamic drop shadow.
*   **Spinner Roll Animation**: Slot-machine-style spinner rolling through mock usernames at 70ms intervals to build suspense before declaring the winner.

---

## 🔗 Express/TypeScript Backend Endpoints

The frontend client in [api.ts](file:///E:/personal%20projects/pramod/giveaway/frontend/src/api.ts) links to the following endpoints on port `5000`:

### 1. Retrieve Past Giveaway Logs
*   **Endpoint**: `GET /api/giveaway/history`
*   **Response**: Array of previous giveaways (limit 10), sorted by newest first.
*   **Data Structure**:
    ```typescript
    interface GiveawayHistoryItem {
      _id: string;
      platform: string;
      postUrl: string;
      winnersCount: number;
      winners: string[];
      createdAt: string;
    }
    ```

### 2. Run the Picker Algorithm
*   **Endpoint**: `POST /api/giveaway/pick-winner` 
    *(Note: Your original backend README had a minor typo listing the route as `/pick`, whereas the router defines it as `/pick-winner`)*
*   **Request Body**:
    ```json
    {
      "platform": "youtube",
      "postUrl": "https://www.youtube.com/watch?v=xyz",
      "winnersCount": 3
    }
    ```
*   **Response**:
    ```json
    {
      "message": "Winners picked successfully!",
      "winners": ["@emma_ts", "@nina_html", "@tom_vue"],
      "giveawayId": "603d21bfa98d2b38f87023c1"
    }
    ```

---

## 🚀 Replacing Mocked Comments with Real Platform APIs

Currently, the backend controller ([giveawayController.ts](file:///E:/personal%20projects/pramod/giveaway/backend/src/controllers/giveawayController.ts#L5-L11)) returns a static list of usernames. Below is the roadmap to connect real platform APIs:

### 1. YouTube Comments Integration (YouTube Data API v3)
To fetch comments from any YouTube video:
1.  **Get API Credentials**: Go to the Google Cloud Console, enable the **YouTube Data API v3**, and generate an API Key.
2.  **Extract Video ID**: Parse the video ID from the `postUrl` (e.g. `v=videoId` or `youtu.be/videoId`).
3.  **Fetch Comments Endpoints**:
    Make an HTTP GET request to:
    `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId={VIDEO_ID}&key={YOUR_API_KEY}&maxResults=100`
4.  **Extract Usernames**:
    Map the API response items:
    ```javascript
    const comments = response.data.items.map(
      item => item.snippet.topLevelComment.snippet.authorDisplayName
    );
    ```

### 2. Instagram & Facebook Comments Integration (Meta Graph API)
Because of Facebook's privacy policies, users must authenticate or obtain a page/user access token.
1.  **Create App**: Register a Developer App on the Meta for Developers portal.
2.  **Acquire Permissions**: Request `instagram_basic` and `instagram_manage_comments` permissions.
3.  **Media ID Resolution**: Search for the media node using the post URL or shortcode.
4.  **Fetch Comments Endpoints**:
    Make a GET request to:
    `https://graph.facebook.com/v19.0/{instagram-media-id}/comments?access_token={PAGE_ACCESS_TOKEN}`
5.  **Extract Usernames**:
    ```javascript
    const commenters = response.data.data.map(comment => `@${comment.username}`);
    ```

### 3. Alternative Fallback Strategy: Manual Comment List or File Upload
Since social media APIs require complex developer approvals, a highly popular fallback is to **let the user paste or upload comments directly**.
*   **UI Input**: Add an "Upload CSV/TXT" drag-and-drop area or a large textarea where the host can paste comments.
*   **API Payload**: Update the POST request to send `comments: string[]` instead of scraping them on the backend:
    ```json
    {
      "platform": "manual",
      "postUrl": "https://custom-giveaway.com",
      "winnersCount": 2,
      "customComments": ["@john", "@sarah", "@david", "@jane"]
    }
    ```
*   **Backend Controller Handler**: Update `pickWinner` in `giveawayController.ts` to check:
    ```typescript
    const comments = req.body.customComments || fetchComments(platform, postUrl);
    ```

---

## 🛠️ How to Run the Full Stack Locally

Follow these steps to run both the frontend and backend simultaneously:

### Step 1: Launch MongoDB
Ensure MongoDB is running on your system. If using a local server, it should be reachable at `mongodb://127.0.0.1:27017/giveaway`.

### Step 2: Start the Backend Server
Open your terminal in the backend folder and run:
```bash
cd backend
npm install
npm run dev
```
The console will output:
`Server is running on port http://localhost:5000`

### Step 3: Start the Frontend Vite Server
Open a separate terminal in the frontend folder and run:
```bash
cd frontend
npm run dev
```
Vite will host the web application on:
`http://localhost:5173`

Open `http://localhost:5173` in your browser. You will see a beautiful login-free comment picker, ready to communicate with your backend, pick winners, and save them in your MongoDB database!
