# TaskFlow: Full-Stack Task Manager

TaskFlow is a premium, full-stack CRUD Task Manager application built with React, Node.js, Express, and MongoDB. It features user authentication, protected routing, task categories, search queries, priority tags, and checklist subtasks.

To ensure immediate usability out of the box, the backend implements a Database Adapter Pattern that automatically falls back to a local file-based JSON database if MongoDB is not configured or available.

---

## Features

- User Authentication: Secure register and login flows powered by JSON Web Tokens (JWT) and bcryptjs password hashing.
- Comprehensive CRUD: Create, read, update, and delete tasks instantly.
- Premium UI/UX: Styled with a glassmorphism dark-themed aesthetic, custom-designed checkboxes, glowing hover effects, and responsive grid layouts.
- Dashboard Analytics: Real-time visual metrics showing total tasks, pending list counts, completed task percentages via an SVG ring, and priority distribution bars.
- Dynamic Subtask Checklist: Interactive checklists inside each task card, complete with live progress bars updating completed ratios.
- Task Filters & Search: Live filter selectors for status, priority, and categories, combined with a text search bar.
- Database Fallback: Automatically swaps between MongoDB and a local file database (storing records in backend/data/) based on environment presence.

---

## Tech Stack

### Frontend
- React (Vite)
- React Context API (Auth state management)
- Lucide React (Icons)
- Custom Vanilla CSS (Design variables, glassmorphism, keyframe animations)

### Backend
- Node.js & Express
- Mongoose & MongoDB (with local JSON fallback repositories)
- JSON Web Token (JWT) for secure authentication
- bcryptjs for password encryption
- cors & dotenv configuration helpers

---

## Project Structure

```text
task-manager/
├── package.json              # Monorepo configuration and script execution
├── README.md                 # Project documentation
├── .gitignore                # Git exclusions
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/           # Database configurations
│   │   ├── controllers/      # Route controllers (auth, tasks)
│   │   ├── middleware/       # JWT Authentication middleware
│   │   ├── models/           # Mongoose schemas/models
│   │   ├── repositories/     # Data Access Layer (JSON vs MongoDB adapters)
│   │   ├── routes/           # REST API routes
│   │   └── server.js         # Entry point
│   ├── .env.example          # Environment variables template
│   ├── nodemon.json          # nodemon ignore rules
│   └── package.json          # Backend package dependencies
└── frontend/                 # Vite React application
    ├── src/
    │   ├── components/       # Interface components (Sidebar, Dashboard, Lists, Modals)
    │   ├── context/          # React Auth Context
    │   ├── services/         # Client API service
    │   ├── styles/           # Styling files (variables, resets, views)
    │   ├── App.jsx           # App wrapper and views routing coordinator
    │   └── main.jsx          # Entry renderer
    ├── index.html
    └── package.json          # Frontend package dependencies
```

---

## Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (version 9 or higher recommended)

### Installation
Clone the repository and install all dependencies for root, backend, and frontend at once using the monorepo utility:

```bash
npm run install-all
```

---

## Running the Application

Start both the backend server and frontend development server concurrently:

```bash
npm run dev
```

- Frontend: http://localhost:5174 (or http://localhost:5173 depending on port availability)
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

By default, the server will launch using the local JSON file database. You can register, login, and perform task CRUD operations immediately.

---

## Database Configuration

### Using Local JSON Storage (Default)
No setup required. Data is stored under backend/data/users.json and backend/data/tasks.json. This directory is excluded from Git to prevent tracking local changes.

### Switching to MongoDB (Local or Atlas)
To switch to a MongoDB database:

1. Create a configuration file named `.env` in the `backend/` directory (you can copy backend/.env.example).
2. Set your connection string and database type:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_custom_secure_secret_key
   DB_TYPE=mongodb
   ```
3. Restart the servers. The backend switcher will detect the MongoDB URI and log the successful connection.

---

## Deployment & Production Build

To build the React frontend for production:

```bash
cd frontend
npm run build
```

This compiles optimized assets in the frontend/dist/ folder.
