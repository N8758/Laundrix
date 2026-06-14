# 🧺 Laundry Management System

> A full-stack web application for managing laundry businesses — built for laundry owners, their staff, and customers.


---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Modules](#-modules)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## 🌟 Overview

The **Laundry Management System** is a production-ready SaaS platform designed for laundry businesses of all sizes. It provides a complete operational workflow — from customer booking and staff pickup to billing, invoice generation, and business analytics.

**Key highlights:**
- 🏪 Multi-owner SaaS platform with subscription management
- 📦 End-to-end order lifecycle (booking → pickup → processing → delivery)
- 💬 WhatsApp notification integration *(planned)*
- 💳 Payment gateway integration *(planned)*
- 📊 Business analytics dashboard
- 🔐 Role-based access: Admin, Owner, Staff, Customer

---

## ✨ Features

### 👤 Customer
- OTP-based login (10-digit mobile number)
- Book laundry services (Self Drop or Door-to-Door Pickup)
- Real-time order status tracking
- Reschedule or cancel before pickup
- GPS location capture for door delivery
- View digital invoices and order history
- Submit service feedback and ratings

### 🏪 Owner
- Owner registration with business profile
- Add/edit/delete laundry services (Per KG or Per Item pricing)
- Manage staff (add, assign, remove)
- Full booking lifecycle management
- Assign pickup & delivery staff
- Holiday management (Full Day / Custom Time)
- Generate PDF invoices with GST support
- Business analytics dashboard with CSV export
- Door pickup charge configuration
- QR code for customer onboarding

### 👷 Staff
- Secure login with Staff ID + Mobile + Laundry ID
- View assigned pickup and delivery orders
- Google Maps navigation to customer location
- Apply for leave (with mandatory reason)
- View salary and incentive details
- Real-time notifications (leave approval, cancellation, reschedule)

### 🛡️ Admin
- Approve/reject new laundry owner registrations
- Monitor active and inactive owners
- Send reminders to inactive accounts
- Permanently delete inactive accounts
- Platform-level oversight

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React.js                            |
| Backend     | Node.js + Express.js                |
| Database    | PostgreSQL                          |
| Auth        | JWT + OTP-based login               |
| PDF         | PDF generation library              |
| Maps        | Google Maps API                     |
| Payments    | Razorpay *(planned)*                |
| WhatsApp    | WhatsApp Business API *(planned)*   |
| Deployment  | AWS EC2 / Hostinger VPS / Docker    |
| Process Mgr | PM2                                 |
| Web Server  | Nginx                               |

---

## 🏗️ Architecture

```
React Client (Frontend)
        ↓
Express Routes (API Layer)
        ↓
Controllers (Request Handler)
        ↓
Service Layer (Business Logic)
        ↓
PostgreSQL Database
```

**Pattern:** Modular MVC + Service Layer Architecture

Every API request passes through:

```
Client
  ↓
Protected Route
  ↓
Authentication Middleware
  ↓
Subscription Check Middleware
  ↓
Controller → Service → Database
```

---

## 📁 Folder Structure

```
laundry-management-system/
│
├── client/                        # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       │   ├── admin/
│       │   ├── owner/
│       │   ├── staff/
│       │   └── customer/
│       ├── context/
│       ├── hooks/
│       └── App.jsx
│
└── server/                        # Node.js Backend
    ├── controllers/
    │   ├── bookingController.js
    │   ├── billingController.js
    │   ├── customerController.js
    │   ├── ownerController.js
    │   ├── staffController.js
    │   ├── leaveController.js
    │   ├── salaryController.js
    │   ├── subscriptionController.js
    │   ├── feedbackController.js
    │   ├── holidayController.js
    │   └── adminController.js
    ├── services/
    ├── routes/
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── ownerMiddleware.js
    │   ├── subscriptionMiddleware.js
    │   └── errorMiddleware.js
    ├── models/
    └── server.js
```

---

## 📦 Modules

|## 📦 Modules

| Module | Description | Access |
|--------|-------------|--------|
| 🌐 Landing Page | Public marketing page with features, FAQ, testimonials | All visitors |
| 🔐 Authentication | Owner registration/login, Customer OTP login, Staff login | Role-based |
| 🛡️ Admin Panel | Owner approval, active/inactive monitoring, permanent deletion | Super Admin |
| 🧺 Service Management | Add/edit/delete laundry services with GST and pricing | Owner |
| 📋 Booking Module | Full order lifecycle — self drop and door-to-door | Customer + Owner |
| 👥 Staff Management | Add staff, assign pickup/delivery, leave and salary management | Owner + Staff |
| 🧾 Billing & Invoice | Auto bill generation, PDF invoice, discount, extra charges | Owner |
| 📊 Owner Dashboard | Analytics, revenue tracking, weekly graphs, CSV export | Owner |
| 🖥️ Staff Dashboard | Assigned orders, leave requests, salary view, notifications | Staff |
| 👤 Customer Profile | Name, address, GPS location capture for door pickup | Customer |
| 🏪 Owner Profile | Business info, GSTIN, shop location, QR code | Owner |
| ⚙️ Settings | Door pickup enable/disable, pickup charge configuration | Owner |
| 📅 Holiday Module | Full-day or custom-time holiday management | Owner |
| ⭐ Feedback Module | Customer ratings and suggestions, owner review | Customer + Owner |
| 💳 Subscription Module | 3-month free trial, Monthly/Quarterly/Yearly plans | Owner |
---

## 🚀 Installation

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/laundry-management-system.git
cd laundry-management-system
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Set up the database

```bash
# Create PostgreSQL database
createdb laundry_db

# Run migrations (from server directory)
npm run migrate
```

### 5. Configure environment variables

```bash
cp server/.env.example server/.env
# Edit .env with your configuration
```

### 6. Run the application

```bash
# Terminal 1 — Backend
cd server
npm start

# Terminal 2 — Frontend
cd client
npm start
```

The app will be available at `http://localhost:3000`

---

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=laundry_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# OTP (for customer login)
OTP_SECRET=your_otp_secret

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Payment Gateway (Razorpay) — Planned
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# WhatsApp Business API — Planned
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Admin
ADMIN_EMAIL=admin@yourlaundry.com
ADMIN_PASSWORD=your_admin_password
```

---

## 📡 API Overview

All APIs are prefixed with `/api/`

| Route Group       | Base Path              | Description                       |
|-------------------|------------------------|-----------------------------------|
| Auth              | `/api/auth`            | Login, registration, OTP          |
| Admin             | `/api/admin`           | Owner approval, platform mgmt     |
| Owner             | `/api/owner`           | Profile, settings, dashboard      |
| Services          | `/api/service`         | Add/edit/delete services          |
| Booking           | `/api/booking`         | Create, manage, track orders      |
| Staff             | `/api/staff`           | Staff management, assignment      |
| Leave             | `/api/leave`           | Staff leave requests & approval   |
| Salary            | `/api/salary`          | Salary and incentive management   |
| Billing           | `/api/billing`         | Invoice generation, PDF download  |
| Customer          | `/api/customer`        | Profile, booking, feedback        |
| Feedback          | `/api/feedback`        | Ratings and suggestions           |
| Holiday           | `/api/holiday`         | Holiday creation and management   |
| Subscription      | `/api/subscription`    | Plan selection, expiry tracking   |

---

## ☁️ Deployment

### AWS EC2 / Hostinger VPS

```bash
# Install dependencies
npm install --production

# Start with PM2
pm2 start server.js --name laundry-backend
pm2 startup
pm2 save
```

Serve the React build via **Nginx**:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/laundry/client/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "server.js"]
```

```bash
docker build -t laundry-management .
docker run -p 5000:5000 laundry-management
```

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Modular MVC + Service Layer Architecture
- [x] Owner Registration, Login, Profile & QR Code
- [x] Customer OTP Login & Profile with GPS
- [x] Staff Login with Staff ID + Mobile + Laundry ID
- [x] Service Management (Per KG / Per Item / GST)
- [x] Full Booking Lifecycle (Self Drop + Door-to-Door)
- [x] Pickup & Delivery Staff Assignment
- [x] Booking Status Flow (10 stages)
- [x] Reschedule (30-min cutoff rule)
- [x] Cancellation Rules (before pickup only)
- [x] Incentive-Based Salary Module
- [x] Leave Module with Mandatory Reason & Owner Approval
- [x] Staff Dashboard (Orders / Salary / Leave — separated modules)
- [x] Staff Availability Validation (Leave conflict check)
- [x] Staff Notification System (Leave, Cancellation, Reschedule)
- [x] Holiday Module (Full Day + Custom Time)
- [x] Holiday Booking Restriction
- [x] Billing Module (Early generation — Active/Pre-Processing stage)
- [x] PDF Invoice with Zero-Field Hiding
- [x] Invoice Lock System (no edits after generation)
- [x] GSTIN Validation (15-character format)
- [x] Date Validation (past dates blocked everywhere)
- [x] Mobile Number Validation (10-digit for Customer/Staff)
- [x] QR Code Fix (scanner compatibility)
- [x] Owner Dashboard with Analytics & CSV Export
- [x] Admin Panel (Approve / Remind / Permanently Delete)
- [x] 3-Month Free Trial + Subscription Plans
- [x] Google Maps Navigation for Staff

### 🔄 In Progress
- [ ] GPS Accuracy Verification

### 📋 Planned
- [ ] Payment Gateway (Razorpay / UPI / PhonePe)
- [ ] WhatsApp Business API Integration
- [ ] WhatsApp Holiday Notifications
- [ ] WhatsApp Order Status Notifications
- [ ] Online Payment Auto-Subscription Renewal
- [ ] Live Booking Tracking (real-time)
- [ ] Customer Booking History & Invoice Download
- [ ] Multi-Branch Support
- [ ] Attendance Module
- [ ] Inventory Management
- [ ] Business Expense Tracking
- [ ] Advanced Analytics (Monthly Revenue, Staff Performance)
- [ ] Mobile App (React Native)
- [ ] Social Login (Google / Facebook)

---

## 👥 User Roles

| Role     | Login Method                         | Access Level                              |
|----------|--------------------------------------|-------------------------------------------|
| Admin    | Email + Password                     | Full platform management                  |
| Owner    | Laundry ID / Email + Password        | Own laundry business management           |
| Staff    | Staff ID + Mobile + Laundry ID       | Assigned orders, leave, salary            |
| Customer | Mobile Number (10-digit) + OTP       | Booking, profile, feedback                |

---

## 📊 Subscription Plans

| Plan      | Price  | Duration  |
|-----------|--------|-----------|
| Free Trial| ₹0     | 3 Months  |
| Monthly   | ₹199   | 1 Month   |
| Quarterly | ₹549   | 3 Months  |
| Half-Yearly| ₹1049 | 6 Months  |
| Yearly    | ₹1999  | 12 Months |

---

## 🔒 Security

- JWT-based authentication for Owners and Admin
- OTP-based authentication for Customers
- Triple-credential authentication for Staff (Staff ID + Mobile + Laundry ID)
- Subscription middleware blocks expired accounts
- Route-level protection for all sensitive APIs
- Invoice lock system prevents billing tampering
- GSTIN format validation
- Past-date blocking across all scheduling operations

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
Built by 

Nilesh Pulate
