# Futuristic Thinkers LMS 🚀
> **Tagline:** *"Inspiring Tomorrow's Innovators"*  
> **Flagship Course:** **AI Explorers Academy** (Ages 7–10, 10 story-driven lessons)  
> **Explorers:** Zara (9), Zahran (8), Luna (9)  
> **Target Audience:** Parents/Guardians in USA, Canada, UK, and Australia; children experience the lessons.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite) + React Router + Tailwind CSS + Axios + React Hook Form + Zod + Lucide React
- **Backend:** Node.js + Express (REST API `/api/v1`)
- **Database:** MongoDB with Mongoose (Strict schemas, indexed queries, zero child PII)
- **Authentication:** JWT (Short-lived access token + rotating refresh token in `httpOnly` secure cookies), bcrypt hashing (12 rounds)
- **Role-Based Access Control (RBAC):** Visitor, Parent, Student (child profile under parent), Admin
- **Security:** Helmet CSP headers, CORS whitelist, Express rate-limiters (strict auth limiter), Express Mongo Sanitize, HPP pollution protection
- **Child Privacy & Safety:** Strict COPPA, GDPR, UK GDPR & Australian Privacy Act design. No child email or PII is ever collected. Child profiles require only a nickname and avatar. Parental consent confirmation is mandatory.

---

## 📁 Repository Structure

```
ree/
├── package.json               # Root monorepo workspace scripts
├── .gitignore                 # Monorepo ignore rules
├── server/                    # Node.js + Express + Mongoose Backend
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── app.js             # Express application configuration
│       ├── server.js          # HTTP server bootstrap & shutdown
│       ├── config/
│       │   ├── db.js          # MongoDB connection handler
│       │   └── env.js         # Environment configuration
│       ├── models/            # 15 Complete Mongoose Models
│       │   ├── User.js        # Parents and Admins
│       │   ├── ChildProfile.js# Child profiles (nickname, avatar, age 7-10)
│       │   ├── Category.js    # AI, Coding, Robotics, Science, Creativity
│       │   ├── Course.js      # Course catalog & metadata
│       │   ├── Lesson.js      # 10 story-driven lessons & materials
│       │   ├── Enrollment.js  # Parent/child course enrollments
│       │   ├── Progress.js    # Lesson completion, stamps, badges, certificates
│       │   ├── Order.js       # Stripe orders and receipts
│       │   ├── Coupon.js      # Promotional discount codes
│       │   ├── Article.js     # Free Learning Hub articles
│       │   ├── FAQ.js         # FAQ items
│       │   ├── PageContent.js # Privacy, Terms, Refund, About, etc.
│       │   ├── ContactMessage.js
│       │   ├── Setting.js     # Global platform settings
│       │   ├── ActivityLog.js # Admin audit trail
│       │   └── index.js
│       ├── middleware/
│       │   ├── auth.js        # JWT protect & optionalAuth
│       │   ├── rbac.js        # Role-based authorization
│       │   ├── validate.js    # Zod payload validator
│       │   ├── security.js    # Helmet, CORS, Rate Limiters, Mongo Sanitize
│       │   └── errorHandler.js# Centralized error handler
│       ├── validators/
│       │   └── authValidator.js
│       ├── utils/
│       │   ├── token.js       # JWT issue, verify & httpOnly cookies
│       │   ├── password.js    # Bcrypt hash & compare
│       │   ├── errors.js      # Operational error classes
│       │   ├── logger.js      # Formatted logger
│       │   └── email.js       # Nodemailer with templates & dev fallback
│       └── scripts/
│           ├── seed.js        # Database seed script
│           └── testAuth.js    # End-to-end auth verification test
└── client/                    # Vite + React Frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    ├── .env
    └── src/
        ├── index.css          # Tailwind CSS with custom WCAG AA focus & colors
        ├── main.jsx           # App root with AuthProvider
        ├── App.jsx            # Main view & Phase 1 auth testing console
        ├── context/
        │   └── AuthContext.jsx# React auth context (JWT / cookies / user state)
        └── services/
            └── api.js         # Axios instance with auto token-refresh interceptor
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js:** v18+ (tested on v22)
- **MongoDB:** MongoDB Server running locally on `mongodb://127.0.0.1:27017`

### 2. Environment Setup

#### Server `.env` (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/futuristic_thinkers

JWT_ACCESS_SECRET=dev_jwt_access_secret_super_secure_key_12345!@#$
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=dev_jwt_refresh_secret_super_secure_key_67890!@#$
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECURE=false

CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="Futuristic Thinkers" <support@futuristicthinkers.com>

STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder

ADMIN_INITIAL_EMAIL=admin@example.com
ADMIN_INITIAL_PASSWORD=
```

#### Client `.env` (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SITE_NAME="Futuristic Thinkers"
VITE_TAGLINE="Inspiring Tomorrow's Innovators"
VITE_STRIPE_PUBLIC_KEY=pk_test_placeholder
```

---

## 🚀 Running the Project

### Install Dependencies:
```bash
# Root
npm install

# Server
cd server
npm install

# Client
cd ../client
npm install
```

### Seed the Database:
```bash
cd server
npm run seed
```

### Verify Phase 1 Auth & RBAC Suite:
```bash
cd server
node src/scripts/testAuth.js
```

### Start Development Servers:
```bash
# From root (starts both concurrently):
npm run dev

# Or start individually:
npm run dev:server   # Starts backend on http://localhost:5000
npm run dev:client   # Starts frontend on http://localhost:5173
```

---

## 📋 Placeholders Configured (for client/admin review)
1. `[PRICE]` — Course price ($49 USD default).
2. `[ACCESS PERIOD]` — Single-family course access period ("1 Year Full Access").
3. `[REFUND DAYS]` — Money-back guarantee window ("14-Day 100% Money-Back Guarantee").
4. `[SUPPORT EMAIL]` — Parent support inbox (`support@futuristicthinkers.com`).
5. `[LESSON 1 TITLE]` through `[LESSON 10 TITLE]` — Story-driven lesson titles for AI Explorers Academy.

