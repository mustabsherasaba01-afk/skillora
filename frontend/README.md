# Skillora frontend

Vite + React frontend for the Skillora marketplace.

## Local setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Configure the backend connection in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Production deployment

- **Root directory:** `frontend`
- **Build command:** `npm run build`
- **Output directory:** `dist`

Set `VITE_API_URL` to the deployed backend `/api` URL and `VITE_SOCKET_URL` to the deployed backend origin in the hosting provider's environment settings. The included `vercel.json` and `public/_redirects` make React Router routes work after a direct page refresh on Vercel and Netlify.

The UI includes realistic fallback content while the API is offline, then switches to live data when the backend is available.
