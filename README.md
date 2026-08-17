# ServiceConnect - Local Service Booking Platform

[![Deploy to Render](https://img.shields.io/badge/Render-Live_App-brightgreen?logo=render)](https://local-service-booking-platform-q3w7.onrender.com/)
[![Swagger API Explorer](https://img.shields.io/badge/Swagger-API_Docs-blue?logo=swagger)](https://local-service-booking-platform-q3w7.onrender.com/swagger)
[![Health Status](https://img.shields.io/badge/Health-Healthy-success)](https://local-service-booking-platform-q3w7.onrender.com/healthz)

### 🌐 Live Production Links
- 🚀 **Live Production Application**: [https://local-service-booking-platform-q3w7.onrender.com/](https://local-service-booking-platform-q3w7.onrender.com/)
- 📜 **Interactive Swagger API Explorer**: [https://local-service-booking-platform-q3w7.onrender.com/swagger](https://local-service-booking-platform-q3w7.onrender.com/swagger)
- 🏥 **Health Check Endpoint**: [https://local-service-booking-platform-q3w7.onrender.com/healthz](https://local-service-booking-platform-q3w7.onrender.com/healthz)

---

ServiceConnect is a modern, full-stack local service booking web application built using **ASP.NET Core Web API** and **React + Vite**. It enables customers to find, chat, live-track, and book local service providers (electricians, plumbers, cleaners, etc.), while allowing providers to manage listings, verification (KYC), availability, and track their dynamic **Trust Score**.

---

## 🌟 Key Features

1. **Dual Role Dashboards**: Custom interfaces for **Customers** (booking flow, service list, active status tracking) and **Providers** (KYC validation, availability calendars, service configuration, wallet/earnings).
2. **Dynamic Provider Trust Score**: An automated rating (0-100) calculated from average rating (40%), booking completion rates (30%), cancellation rates (15%), and industry experience (15%). Includes tier badges (Excellent, Trusted, Good, New).
3. **Audit Trail & Timeline**: Interactive visual timeline detailing step-by-step history logs of booking statuses (Pending -> Accepted -> In Progress -> Completed), noting change dates and optional operator remarks.
4. **Live Chat & Real-Time Tracking**: Integrated chat window and live geographical status tracking (with simulation coordinates) for ongoing tasks.
5. **Installable PWA**: Installable as a progressive web application on mobile or desktop, featuring an offline fallback page, manifest caching, and custom app icons.
6. **Dark/Light Mode**: Full visual adaptation to dark theme preferences via class-based Tailwind triggers.
7. **Role-based Authentication**: Secure login pathways built with JWT validation and path authorization (Customer, Provider, Admin).

---

## 💻 Tech Stack

- **Backend**: ASP.NET Core Web API, Entity Framework Core, JWT Authentication, Swagger API Docs.
- **Database**: PostgreSQL / EF Core InMemory fallback.
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios.
- **PWA Capabilities**: Service Worker caching, Web App Manifest.

---

## 🏗 System Architecture

```mermaid
graph TD
    Client[React Frontend / PWA] -->|HTTPS Requests / JWT| Gateway[ASP.NET Core Web API]
    Gateway -->|JWT Authorization Filter| Controllers[Controllers Layer]
    Controllers -->|Entity Framework Core| DB[(Database / EF Core)]
    Gateway -->|Services Layer| Trust[TrustScore & Recommendations Service]
```

### Database Schema Structure
- **Users**: Core user table hosting profile info, email credentials (hashed), roles, and experience.
- **Services**: Provider service offerings (title, category, pricing, duration).
- **Bookings**: Transaction records linking customers, providers, date/time scheduling, and total pricing.
- **BookingStatusHistories**: Historical log tracking all status changes, timestamps, and custom comments.
- **Reviews**: Customer reviews, scores, and text feedback.
- **Complaints**: Customer complaint registrations moderated by administrator dashboards.

---

## 🚀 Local Setup Instructions

### 1. Run the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend/LocalServiceBooking.API
   ```
2. Build and start the service:
   ```bash
   dotnet run
   ```
3. The server will launch and listen on `http://localhost:5000`. You can inspect the interactive Swagger API docs at `http://localhost:5000/swagger`.

### 2. Run the Frontend React App
1. Navigate to the frontend directory:
   ```bash
   cd frontend/local-service-booking
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Run the development web server:
   ```bash
   npm run dev
   ```
4. The frontend will start on `http://localhost:5173`.
