# Skillora Backend

Express, MongoDB, Mongoose, JWT, and Socket.IO backend for the Skillora freelancing marketplace.

## Local setup

1. Install Node.js 18+ and MongoDB, then start MongoDB.
2. From this directory run `npm install`.
3. Create `.env` with `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `UPLOAD_MAX_MB`.
4. Run `npm run dev` during development or `npm start` in production.

The API listens at `http://localhost:5000`. Health check: `GET /api/health`.

## Frontend flow

Use Axios with `withCredentials: true`. Register or login, then:

1. Client: `POST /api/projects` using JSON or multipart form data.
2. Freelancer: `GET /api/projects`, then `POST /api/proposals` with `project`, `coverLetter`, `proposedBudget`, and `deliveryTime`.
3. Client: `GET /api/proposals/project/:projectId`, then `PUT /api/proposals/:id/accept`.
4. Both users: `POST /api/messages/conversation`, then connect Socket.IO with `{ auth: { token } }` and join the conversation.
5. A participant: `PUT /api/projects/:id/complete`.
6. Each participant: `POST /api/reviews` with `project`, `reviewee`, `rating`, and optional scoring fields.

Example browser request:

```js
const response = await fetch('http://localhost:5000/api/projects?search=web&sort=newest', { credentials: 'include' });
const result = await response.json();
```

All responses use `{ success, message, data }`. Send the JWT either as the `token` cookie or an `Authorization: Bearer <token>` header. Upload fields are `profileImage`, `attachments`, and `attachment`; accepted files are images, PDF, DOC/DOCX, and ZIP up to `UPLOAD_MAX_MB`.

## Main endpoint groups

- `/api/auth`, `/api/users`, `/api/projects`, `/api/proposals`
- `/api/messages`, `/api/reviews`, `/api/notifications`, `/api/favorites`
- `/api/dashboard/client`, `/api/dashboard/freelancer`

Socket events: `userOnline`, `userOffline`, `joinConversation`, `sendMessage`, `receiveMessage`, `typing`, `stopTyping`, and `messageRead`.

## Production deployment

Deploy this directory as a persistent Node.js web service on Render, Railway, Fly.io, or a similar host. Socket.IO should not be deployed as a serverless function.

- **Root directory:** `backend`
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Health check:** `/api/health`

Production environment example:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/skillora
JWT_SECRET=<long-random-secret>
CLIENT_URL=https://<frontend-domain>
UPLOAD_MAX_MB=10
```

Set these values in the host dashboard rather than committing a production `.env` file. After deployment, set the frontend `VITE_API_URL` to `https://<backend-domain>/api` and `VITE_SOCKET_URL` to `https://<backend-domain>`.
