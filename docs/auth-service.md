<!-- @format -->

# 🔐 Auth Service – DevWrite

## Overview

The Auth Service handles user registration, login, secure session management,
and route protection. It is built from scratch to deeply understand
authentication flows without using third-party services like Firebase.

---

## Tech Stack

-   **Backend**: Node.js + Express
-   **Database**: PostgreSQL (via Prisma)
-   **Session**: JWT stored in HttpOnly secure cookies
-   **Security**: bcrypt for password hashing, middleware for route protection

---

## Features

-   ✅ Email/password registration and login
-   ✅ Hashed password storage with bcrypt
-   ✅ JWT-based session management
-   ✅ HttpOnly cookie for persistent login
-   ✅ Middleware to protect authenticated routes
-   🔜 Google & GitHub OAuth integration (later)

---

## Folder Structure

```test
server/
├── src/
│   ├── routes/
│   │   └── auth.ts                  # API routes for signup, login, logout
│   ├── controllers/
│   │   └── auth.controller.ts       # Logic for handling auth requests
│   ├── middleware/
│   │   └── auth.middleware.ts       # JWT-based route protection
│   ├── utils/
│   │   └── jwt.ts                   # Functions to sign/verify JWT tokens
│   └── server.ts                    # Entry point of backend app
├── prisma/
│   └── schema.prisma                # User model defined here
├── .env                             # DB URL, JWT secret, etc.
├── tsconfig.json
└── package.json
```

---

## Auth Flow (Signup + Login)

### Signup

1. User sends email + password to `/api/auth/signup`
2. Backend:
    - Validates input
    - Hashes password
    - Stores user in DB
3. Returns success or error

### Login

1. User sends email + password to `/api/auth/login`
2. Backend:
    - Looks up user
    - Compares password hash
    - If valid, generates JWT
    - Sets JWT in `HttpOnly` cookie
3. Returns user data

---

## JWT Strategy

-   Encodes `userId`
-   Stored in **HttpOnly cookie**
-   Valid for `7 days`
-   Refreshed on login
-   Verified via middleware on protected routes

---

## To Do

-   [x] Setup Prisma + Postgres
-   [ ] Create `User` model
-   [ ] Implement `/signup` route
-   [ ] Implement `/login` route
-   [ ] Add route protection middleware
-   [ ] Add `/me` endpoint for user session check
-   [ ] Add logout route (clears cookie)

---

## Security Notes

-   Passwords are never stored in plain text
-   JWT tokens are short-lived (7d max)
-   Cookies are HttpOnly, Secure, and SameSite=strict (in prod)
-   Optional: rate-limit login attempts

---

## Future Upgrades

-   [ ] Add Google/GitHub OAuth
-   [ ] Add email verification
-   [ ] Password reset via token/email
-   [ ] Multi-session support (e.g., device list)
