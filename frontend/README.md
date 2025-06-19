# TaskMMS Frontend

## Setup

1. Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend URL (e.g., `http://localhost:5000/api`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Environment Variables
- `VITE_API_URL`: URL of the backend API

## Deployment (Render)
- Set `VITE_API_URL` in Render dashboard to your backend's deployed API URL.
- Use `npm run build` as the build command and `vite preview` as the start command. 