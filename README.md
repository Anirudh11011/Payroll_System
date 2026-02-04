# React Payroll Project - Complete Setup Guide

## Project Overview
- **Backend**: Laravel (PHP)
- **Frontend**: React (JavaScript)
- **Database**: MySQL/PostgreSQL
- **Special Feature**: AI Chatbot for querying employee data

---

## Initial Setup (First Time Only)

### Prerequisites
- Node.js & npm installed
- PHP & Composer installed
- Laravel CLI installed

### Step 1: Install Backend Dependencies
```bash
cd backend
composer install
```

### Step 2: Setup Laravel Environment
```bash
# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Run database migrations
php artisan migrate
```

### Step 3: Install Frontend Dependencies
```bash
cd payroll_react
npm install
```

---

## Running the Application

### Terminal 1 - Start Laravel Backend
```bash
cd backend
php artisan serve
```
✅ Runs on: `http://localhost:8000`

### Terminal 2 - Start React Frontend
```bash
cd payroll_react
npm start
```
✅ Runs on: `http://localhost:3000`

**Note:** Keep both terminals open while working. Open your browser to `http://localhost:3000`

---

## Quick Commands Reference

| Action | Command | Location |
|--------|---------|----------|
| Start Backend | `php artisan serve` | `backend` |
| Start Frontend | `npm start` | `payroll_react` |
| Stop Server | `Ctrl + C` | Any terminal |
| Install PHP packages | `composer install` | `backend` |
| Install NPM packages | `npm install` | `payroll_react` |
| Run migrations | `php artisan migrate` | `backend` |

---

## Features Overview

### 1. Employee Management
- View all employees in a table
- Search by name, email, role, department
- Create new employees
- View/Edit employee details

### 2. Dashboard
- Total employees count
- Department statistics
- Leave approvals/rejections
- Payroll investment overview

### 3. AI Chatbot
- Located in bottom-right corner of Employees page
- Ask natural language questions about employees
- Examples:
  - "How many engineers do we have?"
  - "Show me all employees in HR department"
  - "List employees on leave"

### How Chatbot Works
```
User Question (React) 
    ↓
Backend API: /api/chatbot/query
    ↓
Laravel processes → Converts to SQL
    ↓
Database Query
    ↓
AI Response Generation
    ↓
Display to User
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/employees` | GET | Fetch all employees |
| `/api/employees/add` | POST | Create new employee |
| `/api/stats/employees/count` | GET | Get total employee count |
| `/api/chatbot/query` | POST | Send chatbot query |

---

## Troubleshooting

### React won't start
```bash
# Try clearing npm cache and reinstalling
cd payroll_react
npm cache clean --force
npm install
npm start
```

### Laravel showing errors
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear

# Migrate database
php artisan migrate
```

### Port already in use
```bash
# Run on different port
php artisan serve --port=8001
# or
npm start -- --port=3001
```

### API not connecting
- Check if both servers are running
- Verify URLs: Backend `http://127.0.0.1:8000`, Frontend `http://localhost:3000`
- Check browser console for errors (F12)

---

## Project Structure

```
React_Payroll/
├── backend/                    (Laravel)
│   ├── app/Http/Controllers/
│   ├── app/Models/
│   ├── routes/
│   └── database/migrations/
│
└── payroll_react/              (React)
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   └── Employees.jsx    (with Chatbot)
    │   ├── Components/
    │   └── App.jsx
    └── package.json
```

---

## Next Steps After Setup

1. ✅ Verify both servers are running
2. ✅ Open `http://localhost:3000` in browser
3. ✅ Navigate to Employees page
4. ✅ Try the chatbot (💬 button)
5. ✅ Create/view employees
6. ✅ Check Dashboard for statistics

---

## Key Technologies

- **Backend**: Laravel, PHP, MySQL
- **Frontend**: React, Bootstrap, CSS
- **API Communication**: REST API with Fetch
- **AI Integration**: Natural Language Processing for chatbot

---

## Support Commands

```bash
# View Laravel logs
tail -f storage/logs/laravel.log

# Check database connection
php artisan tinker

# List all routes
php artisan route:list

# Create new migration
php artisan make:migration create_table_name
```

---



