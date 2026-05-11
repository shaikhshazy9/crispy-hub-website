# Crispy Hub Cafe & Restaurant — Website

> Fresh, Crispy & Full of Flavour — Al Ain, Abu Dhabi

A professional, modern, fully responsive restaurant website built with React + Vite, Tailwind CSS, and Framer Motion.

---

## Project Structure

```
crispyhub-website/
  frontend/          # React + Vite frontend (deploy to Vercel)
  backend/           # Node.js + Express API (ready for MongoDB)
  README.md
```

---

## Frontend Setup

### Requirements
- Node.js 18+
- npm or yarn

### Install & Run

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output goes to `frontend/dist/`

### Deploy to Vercel

1. Push the project to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects Vite — click Deploy

---

## Backend Setup (Future Integration)

### When Ready

1. Copy `.env.example` to `.env`
2. Add your MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/crispyhub
PORT=5000
CLIENT_ORIGIN=https://your-vercel-domain.vercel.app
```

3. Install and run:

```bash
cd backend
npm install
npm run dev
```

### What the Backend Will Handle

| Feature | Endpoint |
|---|---|
| Menu items (CRUD) | `GET/POST/PUT/DELETE /api/menu` |
| Customer feedback | `GET/POST /api/feedback` |
| Contact form messages | `POST /api/contact` |
| Admin panel (future) | `/admin` |
| Online ordering (future) | `/api/orders` |

### MongoDB Atlas Steps

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist your IP (or use `0.0.0.0/0` for Vercel)
4. Copy the connection string into `.env`
5. In `backend/src/server.js`, uncomment the `connectDB()` call and route imports

---

## Tech Stack

**Frontend**
- React 18 + Vite 5
- Tailwind CSS 3
- Framer Motion 11
- React Router v6
- React Icons

**Backend (prepared)**
- Node.js + Express
- MongoDB + Mongoose
- dotenv, cors

---

## Business Info

| Detail | Value |
|---|---|
| Restaurant | Crispy Hub Cafe & Restaurant |
| Location | Urwah Bin Zubayr St, 3, Zakhir - Al Ain, Ramlat Zakher |
| Phone | 03 7342122 |
| City | Al Ain, Abu Dhabi, UAE |
