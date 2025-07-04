# LifeLine.AI

LifeLine.AI is a supportive AI companion application built with React, Vite, and Firebase. It integrates with the OpenRouter API to provide AI-powered chat responses.

## Features

- User authentication (Email/Password and Anonymous) via Firebase.
- AI-powered chat using the OpenRouter API.
- Responsive and modern UI.

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

If you haven't already, clone your project from GitHub:

```bash
git clone https://github.com/kamaleshsk123/Lifeline-Ai.git
cd Lifeline-Ai.git
```

### 2. Install Dependencies

Navigate to the project root and install the necessary Node.js dependencies:

```bash
npm install
```

### 3. Environment Variables Setup

This project uses environment variables to manage sensitive API keys and Firebase configuration.

Create a file named `.env.local` in the root of your project. This file will **not** be committed to Git due to `.gitignore` rules.

Add the following variables to your `.env.local` file, replacing the placeholder values with your actual keys and configuration details:

```
VITE_OPENROUTER_API_KEY="YOUR_OPENROUTER_API_KEY"
VITE_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
VITE_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"
```

- **`VITE_OPENROUTER_API_KEY`**: Your API key obtained from [OpenRouter Keys](https://openrouter.ai/keys).
- **`VITE_FIREBASE_API_KEY`**, **`VITE_FIREBASE_AUTH_DOMAIN`**, etc.: Your Firebase project configuration details. You can find these in your Firebase console under Project settings -> General -> Your apps.

### 4. Run the Development Server

Once dependencies are installed and your `.env.local` file is configured, you can start the development server:

```bash
npm run dev
```

This will typically open the application in your browser at `http://localhost:5173` (or another available port).

---
