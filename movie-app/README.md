# Movie App

A React single-page application for browsing movie data with Firebase-based
authentication and Firestore storage, powered by the TMDB API. It uses
React Router for navigation and toast notifications for user feedback.

## What this project does
- Authenticates users with Firebase (Google provider)
- Reads/writes user data with Firestore
- Fetches movie data from TMDB
- Provides client-side routing for page navigation
- Shows non-blocking UI feedback via toast notifications

## Tech Stack
- React (Create React App)
- Firebase Auth + Firestore
- TMDB API
- React Router
- Axios
- React Toastify

## Project Structure
```
movie-app/
  src/
    auth/        # Firebase config and auth helpers
    context/     # App-level context providers
    router/      # Route definitions
```

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
There is a sample file at `src/.env.example`. Copy it to the project root
as `.env` and fill in your keys:
```bash
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_TMDB_API_KEY=your_tmdb_key
```

### 3) Run the app
```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Scripts
- `npm start` Run the development server
- `npm build` Create a production build
- `npm test` Run tests

## Firebase Setup Notes
- Enable Google sign-in in Firebase Authentication.
- Create a Firestore database and set rules for your app.

## TMDB Setup Notes
- Create an API key at `https://www.themoviedb.org/settings/api`.
- Keep API keys in `.env` and never commit them to git.

## Notes
- Restart the dev server after editing `.env`.
- Make sure your Firebase project allows the configured auth provider.

## License
MIT
