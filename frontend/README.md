# Skillora frontend

Vite + React frontend for the Skillora marketplace. Run `npm install`, then `npm run dev` from this directory. The API URL is configured with `VITE_API_URL` and defaults to `http://localhost:5000/api`; Socket.IO uses `VITE_SOCKET_URL`. The UI includes realistic fallback content so the product remains browsable while the backend is offline, and switches to live API data when available.
