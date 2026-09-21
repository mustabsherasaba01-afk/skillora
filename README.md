# Skillora

Skillora is a modern MERN freelancing marketplace where clients can post projects and freelancers can discover work, submit proposals, collaborate in real time, and build professional reputation.

## Project structure

```text
skillora/
├── backend/     Express, MongoDB, REST API, Socket.IO
└── frontend/    React, Vite, responsive marketplace UI
```

## Run locally

### Backend

Requirements: Node.js 18+ and MongoDB.

```bash
cd backend
npm install
npm start
```

The API runs at `http://localhost:5000`. Check it with `http://localhost:5000/api/health`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Environment variables

Backend variables belong in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillora
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
UPLOAD_MAX_MB=10
```

Frontend variables belong in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Do not commit real production secrets. Set these values in the hosting provider's environment settings instead.

## Deploy the backend

Use Render, Railway, Fly.io, or another Node-compatible host.

1. Create a Web Service from this repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Add `MONGO_URI` using a hosted MongoDB connection string, such as MongoDB Atlas.
6. Set `JWT_SECRET` to a long random value.
7. Set `CLIENT_URL` to the deployed frontend URL, including `https://`.
8. Use the generated backend URL in the frontend variables.

The backend must be deployed as a persistent Node service because Socket.IO requires a long-lived connection. Verify deployment at `<backend-url>/api/health`.

## Deploy the frontend

Use Vercel, Netlify, or another static Vite host.

1. Create a project from this repository.
2. Set **Root Directory** to `frontend`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Add `VITE_API_URL=https://<backend-url>/api`.
6. Add `VITE_SOCKET_URL=https://<backend-url>`.
7. Redeploy after saving environment variables.

The included `frontend/vercel.json` keeps React Router routes working on refresh when deployed to Vercel. For Netlify, copy the included `frontend/public/_redirects` file as part of the build.

## Main features

- JWT authentication with client and freelancer roles
- Project search, filtering, creation, editing, completion, and recommendations
- Proposal submission and acceptance workflow
- Favorites, reviews, ratings, notifications, and dashboards
- Real-time messaging through Socket.IO
- File uploads for profiles, projects, proposals, and chat
- Responsive light Gen-Z-inspired interface with persistent theme support

## Useful commands

```bash
# Backend syntax check
cd backend && npm run check

# Frontend production build
cd frontend && npm run build
```
