# TripVault 🗺️

> Full-stack MERN travel journal — create trips, upload photos, and share a public travel profile.
> Built for the CodGen Virtual Internship Program (Week 3 of 4: Photo Uploads & Public Profiles).

## Features

- User registration & login (JWT auth, bcrypt password hashing)
- Create, read, update, delete trips
- **Photo uploads** — attach a cover image and multiple photos to any trip via Cloudinary
- **Public profiles** — `/profile/:username` page anyone can view without logging in, showcasing a traveller's trips
- Edit your own bio/username from the dashboard
- Local MongoDB for data storage (no cloud DB required for development)

## Tech Stack

| Layer      | Tech                                             |
|------------|---------------------------------------------------|
| Frontend   | React 18 + Vite + React Router + Axios            |
| Backend    | Node.js + Express                                  |
| Database   | MongoDB (local) + Mongoose                         |
| Auth       | JWT + bcryptjs                                     |
| File Upload| Multer + Cloudinary + multer-storage-cloudinary    |

## Project Structure

```
tripvault/
├── server/               # Express API
│   ├── config/db.js      # MongoDB connection
│   ├── controllers/      # Route handlers (trips, users)
│   ├── middleware/       # JWT auth guard + Cloudinary upload middleware
│   ├── models/           # Mongoose schemas (User, Trip)
│   ├── routes/           # auth, trips, users
│   ├── index.js          # server entry point
│   └── .env               # local environment variables (not committed)
├── client/               # React (Vite) frontend
│   └── src/
│       ├── pages/         # Login, Register, Dashboard, TripDetail, PublicProfile, EditProfile
│       ├── api.js         # shared axios instance (auto-attaches JWT)
│       └── App.jsx        # routes
└── package.json           # root scripts (runs both workspaces together)
```

## Prerequisites

- Node.js 18+ and npm
- **MongoDB running locally** — install MongoDB Community Server and make sure it's running on `mongodb://127.0.0.1:27017` before starting the backend.
  - macOS (Homebrew): `brew install mongodb-community && brew services start mongodb-community`
  - Windows/Linux: install from https://www.mongodb.com/try/download/community and start the `mongod` service
  - Quick check it's running: `mongosh` should connect without errors
- A free [Cloudinary](https://cloudinary.com) account (only needed for photo uploads)

## Setup

1. **Install all dependencies** (root, server, client):
   ```bash
   npm run install:all
   ```

2. **Configure the backend** — `server/.env` already contains sane local defaults:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/tripvault
   JWT_SECRET=devsecret_change_this_in_production

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   Get your Cloudinary credentials from your [Cloudinary dashboard](https://cloudinary.com/console) and paste them in. Photo upload requests will fail until these are filled in — everything else (auth, trips, profiles) works without them.

3. **Start MongoDB locally** (see Prerequisites above) — the server will exit with a clear error if it can't connect.

4. **Run the app** (starts backend on :5000 and frontend on :5173 together):
   ```bash
   npm run dev
   ```

   The app is available at **http://localhost:5173**. The Vite dev server proxies `/api` requests to the backend automatically.

## Verified flow

1. Register a new account with name, username, email, and password.
2. You're redirected to the Dashboard.
3. Create a trip (title, destination, dates, description, rating) and optionally attach a photo.
4. Click a trip to open its detail page, upload more photos, and see them in a grid.
5. Click **My Profile** to view your public profile page at `/profile/:username`.
6. Open that same URL in an incognito window — it loads with no login required, and shows only safe fields (no email/password).
7. Click **Edit Profile** to update your bio or username.

## API Reference

| Method | Route                            | Auth | Description                                   |
|--------|-----------------------------------|------|------------------------------------------------|
| POST   | `/api/auth/register`              | No   | Register a new user                             |
| POST   | `/api/auth/login`                 | No   | Log in, returns JWT                             |
| GET    | `/api/auth/me`                    | Yes  | Get the logged-in user                          |
| GET    | `/api/trips`                      | Yes  | List your trips                                 |
| POST   | `/api/trips`                      | Yes  | Create a trip                                   |
| GET    | `/api/trips/:id`                  | Yes  | Get a single trip                               |
| PUT    | `/api/trips/:id`                  | Yes  | Update a trip                                   |
| DELETE | `/api/trips/:id`                  | Yes  | Delete a trip                                   |
| POST   | `/api/trips/:id/upload`           | Yes  | Upload a photo, attaches Cloudinary URL to trip |
| GET    | `/api/users/:username/profile`    | No   | Public profile — name, bio, trips (safe fields) |
| PUT    | `/api/users/profile`              | Yes  | Update your own bio/username                    |

## Security notes

- Passwords are hashed with bcrypt before storage — never stored in plaintext.
- The public profile route explicitly `.select()`s only `name`, `username`, `bio`, and `createdAt` — email and password are never returned.
- Cloudinary credentials live in `server/.env`, which is git-ignored and never committed.
- For production, replace `JWT_SECRET` with a long random string and use a hosted MongoDB (e.g. Atlas) with a fresh, rotated password.

## License

MIT
