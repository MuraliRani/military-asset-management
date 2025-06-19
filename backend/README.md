# TaskMMS Backend

## Setup

1. Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (dev mode):
   ```bash
   npm run dev
   ```

## Environment Variables
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing
- `PORT`: Port to run the server (default 5000)

## Deployment (Render)
- Set environment variables in Render dashboard.
- Use `npm start` as the start command. 