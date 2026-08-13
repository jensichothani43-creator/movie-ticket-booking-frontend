# 🎬 Movie Ticket Booking - Frontend

Frontend application built with **React, Vite, Axios, and React Router**.

## Requirements

* Node.js
* npm
* Running FastAPI backend
* Running MySQL server

## Install & Run

cd frontend

npm install



Frontend:


http://localhost:5173


## Backend Requirement

Make sure the FastAPI backend is running:

cd backend

python init_db.py

uvicorn main:app --reload


Backend:


http://127.0.0.1:8000


Swagger:


http://127.0.0.1:8000/docs


## Application Flow


Login
 ↓
Select Movie
 ↓
Select Cinema
 ↓
Select Show
 ↓
Select Seats
 ↓
Apply Offer
 ↓
Payment
 ↓
Booking Confirmation
```

## Testing


npx playwright test

