## Why CivicLens?  
CivicLens bridges communities and authorities, enabling faster, smarter, and more transparent action on civic issues.  
It raises awareness, empowers citizens to report problems, and helps authorities respond efficiently, fostering safer and better-managed neighborhoods.  

## Key Features  
- **Secure Reporting** – Protects user data while ensuring accountability.  
- **Interactive Map** – Visualizes reports in real time for quick understanding.  
- **Advanced Filters** – Sort reports by type, priority, or location.  
- **Admin Dashboard** – Monitor, manage, and act on reports seamlessly.  
- **Community Empowerment** – Engages citizens, raises awareness, and contributes to a safer, organized environment.  


## CivicLens Backend

Express + MongoDB API for authentication, crisis reporting, and admin status updates.

### Setup

1. Create `.env` with MongoDB URI, JWT secret, Cloudinary, and Google OAuth values.
2. Install dependencies:
```bash
npm install
```
3. Run in dev:
```bash
npm run dev
```

### Endpoints

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google` (expects `{ idToken }`)
- `GET /api/auth/me` (Bearer token)
- `GET /api/reports` (optional `category`, `urgency`, `status`)
- `GET /api/reports/mine` (auth)
- `POST /api/reports` (auth, multipart with `image`) fields: `title, description, category, urgency, lat, lng`
- `PATCH /api/reports/:id/status` (auth + admin)

### Notes

- Set `UPLOAD_PROVIDER=cloudinary` for Cloudinary uploads. Otherwise files are served from `/uploads`.
- CORS is restricted to `CLIENT_ORIGIN`.

### Admin seeding

Set optional env for admin creation:

```
ADMIN_EMAIL=admin@civiclens.local
ADMIN_PASSWORD=ChangeMe123!
ADMIN_NAME=CivicLens Admin
```

Run:

```
npm run seed:admin
```


## CivicLens Frontend

React + Vite app with Tailwind, React Router, Axios, and Leaflet.

### Setup

1. Create a file `.env` and set `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID`.
2. Install dependencies:
```bash
npm install
```
3. Run dev server:
```bash
npm run dev
```




