# SmartPay Wallet

A full-stack digital wallet and payments application built on the MERN stack (MongoDB, Express, React, Node.js). Users can send money by phone number, pay bills, earn cashback, track spending with budgets and analytics, and more. An admin panel provides platform management, KYC verification, and offer creation.

## Live Demo

- **Live App:** https://smart-pay-nz.vercel.app
- **Backend API:** https://smart-pay-ten.vercel.app

Try it with the demo admin account: `admin@smartpay.com` / `admin123`

> Note: the backend is hosted on a free tier that sleeps when idle, so the first request after a period of inactivity may take 20–30 seconds to respond.

---

## Features

### User
- **JWT authentication** — register/login with hashed passwords (bcrypt) and token-based sessions.
- **Wallet & balance** — every user has a wallet balance updated in real time.
- **Send money** — transfer funds to another user by phone number, with balance checks.
- **QR code** — generate a QR code so others can pay you.
- **Bill payments** — pay utilities (electricity, mobile, internet, etc.) with 5% cashback (capped at 100) and reward points. Save frequent billers.
- **Budgets** — set spending limits by category.
- **Analytics** — visual breakdown of spending by category and income vs. expense (Recharts).
- **Offers** — view active cashback/promotional offers.
- **Profile & settings** — edit profile, change password, toggle dark mode.

### Admin
- **Dashboard** — platform-wide stats: total users, total transaction volume, and more.
- **User management** — view all users and approve KYC verification.
- **Transactions** — view all platform transactions.
- **Offers** — create promotional offers shown to users.

---


## Project Structure

```
smartpay-wallet/
├── server/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic (auth, transaction, bill, user, admin)
│   ├── middleware/      # Auth (protect, authorize) and error handling
│   ├── models/          # Mongoose schemas (User, Transaction, Bill, Offer)
│   ├── routes/          # API route definitions
│   ├── app.js           # Express app setup
│   ├── server.js        # Server entry point
│   ├── seed.js          # Sample data seeder
│   └── .env             # Environment variables (not committed)
└── client/
    └── src/
        ├── components/  # Reusable UI (Button, Card, Modal, Navbar, etc.)
        ├── pages/       # Route pages (Dashboard, Admin, Budget, Settings, etc.)
        ├── store/       # Redux store and slices (auth, transactions, etc.)
        ├── services/    # API layer (axios)
        ├── hooks/       # Custom hooks (useAuth, useNotification, etc.)
        └── utils/       # Constants and helpers
```

---

### 1. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret_string
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```


```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

### 2. Frontend setup

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---
