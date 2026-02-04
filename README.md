# Personal Website

A simple personal website for Rajdeep Singh built with static HTML and CSS.

## Features

- Clean, minimal design with dark mode support
- Responsive layout
- Shared CSS stylesheet for maintainability
- Multiple pages: Home, Books, Blog (coming soon)
- Deployed on Firebase Hosting

## Structure

```
website/
├── public/                    # Firebase hosting directory
│   ├── index.html            # Main homepage
│   ├── books.html            # Books collection page
│   ├── blog.html             # Blog page (placeholder)
│   └── style.css             # Shared stylesheet
├── firebase.json             # Firebase hosting configuration
├── .firebaserc               # Firebase project configuration
└── README.md                 # This file
```

## Local Development

1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Serve the site locally:
   ```bash
   firebase serve
   ```

3. Open your browser to `http://localhost:5000`

## Deployment

Deploy to Firebase Hosting:
```bash
firebase deploy
```

## Tech Stack

- **Frontend**: HTML, CSS (vanilla)
- **Hosting**: Firebase Hosting
- **Design**: System fonts, dark mode support via CSS media queries