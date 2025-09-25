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


