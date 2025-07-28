# 📚 Book-Club Library Management System (Frontend)

Book-Club is a modern library located in Colombo, Sri Lanka. This web-based application helps staff manage books, readers, and lending operations efficiently.

This is the **frontend** part of the system, built with **React**, **TypeScript**, and **Tailwind CSS**.

---

## 🚀 Features

### 📖 Reader Management
- View, add, update, and delete readers.

### 📚 Book Management
- View book catalog.
- Add, edit, and remove books.

### 🔄 Lending Management
- Lend books to registered readers.
- Track lending history (by book and reader).
- Mark books as returned.

### ⏰ Overdue Management
- View overdue books and affected readers.
- Send email reminders to readers with overdue books.

### 🔐 Authentication & Authorization
- Secure login for library staff.
- JWT-based session management.

### 🛠️ Additional Features
- Responsive UI (mobile-friendly).
- Search and filter for books/readers.
- Automatic due date calculation.
- Audit logs (important actions tracking).

---

## 🧰 Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React, TypeScript, Tailwind CSS|
| Backend   | Node.js, Express, MongoDB      |
| Auth      | JWT (JSON Web Tokens)          |
| Email     | Nodemailer         |




---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/RasanduniLakmali/Library_Management_System_Frontend.git

npm install

VITE_API_BASE_URL=http://localhost:5000/api

npm run dev
App will run on: http://localhost:5173

