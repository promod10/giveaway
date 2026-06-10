

# 🎁 Universal Giveaway Comment Picker

### 📝 Project Description

The Universal Giveaway Comment Picker is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and powered entirely by TypeScript. It is designed to simplify the process of hosting social media giveaways by allowing users to seamlessly and fairly select random winners from their post comments.

Hosting giveaways is a proven strategy for boosting online engagement, but manually scrolling through thousands of comments to pick a winner is tedious and prone to bias. This application solves that problem by providing a clean, login-free interface where users can simply paste a link to their social media post (Instagram, YouTube, or Facebook), specify the number of winners they want, and let the algorithm do the rest.

The backend ensures that the random selection is fair, while MongoDB keeps a persistent, real-time history of past giveaways for transparency and record-keeping. The frontend is fully responsive, ensuring a smooth experience across desktop and mobile devices.

##### 🛠️ Technical Stack

Frontend: React.js, Vite, TypeScript, Tailwind CSS / Lucide Icons (for UI).

Backend: Node.js, Express.js, TypeScript.

Database: MongoDB (via Mongoose).

Architecture: RESTful API, Login-free stateless execution.

#### 🎯 Uses for Users (Who is this for?)

This tool is incredibly versatile and can be used by various digital professionals and everyday users. Here are the primary use cases:

1. Influencers and Content Creators

Subscriber Milestones: Easily pick a winner for a "100k Subscriber Giveaway" on YouTube by pasting the video link.

Engagement Boosts: Encourage followers to "Tag 3 friends in the comments" on Instagram, and use the app to randomly select the winner during a live stream.

2. Brands and E-commerce Businesses

Product Launches: When launching a new product, brands often give away a free sample to a lucky commenter. This tool allows the social media team to pick a winner quickly and fairly.

Cross-Platform Campaigns: Because the tool supports Facebook, Instagram, and YouTube, brands can run synchronized campaigns across multiple platforms and use a single tool to manage the winner selection.

3. Social Media Managers & Agencies

Time-Saving Automation: Agencies managing dozens of client accounts can eliminate the manual labor of picking winners, saving hours of administrative work.

Client Transparency: The built-in "Giveaway History" feature (saved in MongoDB) acts as a digital ledger. Managers can screenshot or show this history to clients to prove that the winner was selected fairly and transparently on a specific date.

4. Event Organizers & Streamers

Ticket Giveaways: Organizers can post an event flyer on Facebook and use the app to draw a random commenter to win VIP tickets.

Live Draws: The clean, interactive UI makes it perfect for sharing on-screen during a Twitch or YouTube Live stream, building hype as the audience watches the "Fetching & Picking" loading state before the winner is revealed.

#### ✨ Key Features

Zero Friction (No Login Required): Users don't need to remember passwords or authorize third-party apps to pick a winner.

Multi-Winner Selection: Pick 1, 3, or 10 winners at the exact same time without having to re-run the tool.

Multi-Platform Support: Ready to integrate with YouTube, Instagram, and Facebook posts.

Transparent History: Automatically logs every giveaway (Date, URL, Platform, and Winners) so users never lose track of who won past contests.

Fair Randomization: Uses a secure backend shuffling algorithm to ensure every commenter has an equal chance of winning.
