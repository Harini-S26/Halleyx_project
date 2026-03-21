# Halleyx Dashboard Platform

A full-stack SaaS dashboard platform built using **React, Node.js, and MongoDB**, designed for dynamic data visualization and customizable user dashboards.

---

## Project Overview

Halleyx enables users to create fully customizable dashboards powered by real data. The platform follows a **data-first approach**, meaning no charts or widgets are rendered without user-provided data.

---

## Project Structure

```
Halleyx_project/
├── backend/     # Express.js API + MongoDB Database
└── frontend/    # React + Vite + Tailwind CSS UI
```

---

## Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Context API / Hooks

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

---

## Quick Start

### Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/halleyx
JWT_SECRET=your_secret_here
NODE_ENV=development
```

Run the backend server:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## Features

* User Authentication (JWT-based login & register)
* Dynamic Dashboard (No default/dummy charts)
* Custom Widget Configuration
* Data-driven Chart Rendering
* User Profile Management
* Scalable SaaS Architecture

---

## Core Concept

> **No Default Data Policy**

* No charts are displayed by default
* Charts appear only when user provides data
* Widget updates reflect instantly
* Empty dashboard remains empty until configured

---

## API Overview

* Auth Routes (Login / Register)
* User Management
* Dashboard Data Handling
* Widget Configuration APIs

---

## Future Enhancements

* Real-time data updates (WebSockets)
* Advanced analytics & AI insights
* Export dashboards (PDF/CSV)

---

##  Known Issue: npm install Error (Vite Peer Dependency)

If you see this error after running `npm install`:
```
npm error peer vite@"^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0" from @vitejs/plugin-react
npm error ERESOLVE unable to resolve dependency tree
```

### Fix:

1. Open `frontend/package.json`
2. Change these lines in `devDependencies`:
```json
"@vitejs/plugin-react": "^4.7.0",
"vite": "^6.0.0"
```

3. Then run:
```powershell
npm install
```

That's it! ✅

video link:https://drive.google.com/file/d/1JGOIJMEeCv-5wNQKJLPJ9vXueSwLWekn/view?usp=drivesdk
