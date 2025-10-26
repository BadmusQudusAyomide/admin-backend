# Admin Backend (Node/Express)

A secure server for Superadmin operations. Moves all privileged Firestore access from the frontend to server-side using Firebase Admin SDK.

## Features
- Verify Firebase ID token and enforce `admin/superadmin` role
- Users listing endpoint
- Orders listing + mark-delivered + release via existing escrow backend
- CORS restricted to your superadmin app origin

## Setup
1. Create a Firebase service account key (Project Settings → Service Accounts → Generate new private key). Save as `service-account.json` at the project root or elsewhere.
2. Copy `.env.example` to `.env` and update:
```
PORT=8081
ADMIN_FRONTEND_ORIGIN=http://localhost:5173
GOOGLE_APPLICATION_CREDENTIALS=../service-account.json
ESCROW_BACKEND_URL=http://localhost:8080
```
3. Install deps and run:
```
cd admin-backend
npm install
npm run dev
```

## Endpoints
- `GET /health`
- `GET /auth/me`
- `GET /users`
- `GET /orders?status=&stage=&sellerId=&buyerId=&page=&limit=`
- `POST /orders/:orderId/mark-delivered`
- `POST /orders/:orderId/release`

All endpoints require an `Authorization: Bearer <idToken>` header (Firebase ID token from the superadmin UI).

## Integrating Superadmin UI
- Replace Firestore SDK calls with fetch/axios to this backend.
- Attach `await auth.currentUser.getIdToken()` to the Authorization header.

## Notes
- This backend uses Firebase Admin SDK and is not limited by client Firestore rules.
- You can extend with analytics, logs, and notifications routes.
