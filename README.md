# wonderlust

A Node.js + Express + MongoDB travel listing app.

## Quick start

1. Install dependencies:
   npm install
2. Copy the sample environment file:
   copy .env.example .env
3. Update the values in .env with your MongoDB and Cloudinary settings.
4. Start the app:
   npm start
5. Open http://localhost:8080

## Default local database

If you do not provide a MONGODB_URI value in .env, the app will fall back to:
mongodb://127.0.0.1:27017/wanderlust

Make sure MongoDB is running locally before starting the app.

## Required env vars

- MONGODB_URI
- SECRET
- PORT (optional, defaults to 8080)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

If Cloudinary values are not configured, the app still starts, but image uploads will not work until those values are added.
