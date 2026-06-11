

# 🎁 Universal Giveaway Comment Picker

### 📝 Project Description

The Universal Giveaway Comment Picker is a full-stack web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and powered entirely by TypeScript. It is designed to simplify the process of hosting social media giveaways by allowing users to seamlessly and fairly select random winners from their post comments.

Hosting giveaways is a proven strategy for boosting online engagement, but manually scrolling through thousands of comments to pick a winner is tedious and prone to bias. This application solves that problem by providing a clean, login-free interface where users can simply paste a link to their social media post (Instagram, YouTube, or Facebook), specify the number of winners they want, and let the algorithm do the rest.

The backend ensures that the random selection is fair, while MongoDB keeps a persistent, real-time history of past giveaways for transparency and record-keeping. The frontend is fully responsive, ensuring a smooth experience across desktop and mobile devices.

#### 🛠️ Technical Stack

Frontend:

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


#### ✨ Key Features

- Zero Friction (No Login Required): Users don't need to remember passwords or authorize third-party apps to pick a winner.
- Multi-Winner Selection: Pick 1, 3, or 10 winners at the exact same time without having to re-run the tool.
- Multi-Platform Support: Ready to integrate with YouTube, Instagram, and Facebook posts.
- Transparent History: Automatically logs every giveaway (Date, URL, Platform, and Winners) so users never lose track of who won past contests.
- Fair Randomization: Uses a secure backend shuffling algorithm to ensure every commenter has an equal chance of winning.

### Frontend Guide or to RUN CODE LOCALLY

1. Requirements: (Make sure installed node, vscode, mongodb)
    - node version : 17+ or latest
    - npm version : 10+ or latest

2. Clone the given repo
    - git clone https://github.com/promod10/giveaway.git

3. Project Setup
    - cd giveaway
    - Open the 'giveaway/backend' folder in VS Code.
    - create one file named .env in the root of the 'backend' folder.
    - Open .env and verify it contains the following:
        PORT=5000
        MONGODB_URI=mongodb://127.0.0.1:27017/giveaway or atalas link

4. nstall Backend Dependencies
    - cd giveaway/backend
    - npm install

5. Run the Development Server
    - npm run dev

6. Test the API (Optional but Recommended)
    Before connecting the frontend, it is good practice to ensure your backend API is responding correctly.

    Since you are using VS Code, you can install the Thunder Client extension (a lightweight Postman alternative built into VS Code) to test your endpoints.

    i) Test the GET route:
        - Method: GET
        - URL: http://localhost:5000/api/giveaway/history
        - Expected Result: A 200 OK status with an empty array []   (since you haven't picked any winners yet).

    ii) Test the POST route:
        - Method: POST
        - URL: http://localhost:5000/api/giveaway/pick
        - Headers: Content-Type: application/json
        -Body (JSON):
            {
                "platform":"instagram",
                "postUrl": "https://instagram.com/p/xyz",
                "winnersCount": 3
            }


