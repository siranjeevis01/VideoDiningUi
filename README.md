# 🍽️ VideoDiningApp

A full-stack web application that combines **online food ordering** with **virtual dining**, enabling users to place food orders, invite friends, and enjoy a meal together via live video calls — from the comfort of their homes.

---

## 🔗 Live Demo

> 🚧 **Coming Soon**

---

## 📚 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Getting Started](#getting-started)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contact](#contact)

---

## 📌 About the Project

**VideoDiningApp** brings a new dimension to food delivery platforms by adding a **social experience**. It supports:

- Ordering food online
- Inviting friends
- Dining together via video calls
- Secure OTP-based payments
- Admin controls for managing platform content and users

This app is ideal for virtual hangouts, remote celebrations, or online dining dates.

---

## ✨ Features

### 👤 Authentication
- Secure login/register
- JWT-based session handling
- Email/OTP verification (optional)

### 🛍️ Food Ordering
- Browse food menu
- Add/remove items to cart
- Place and track orders
- View order history and status

### 💳 Payment System
- OTP-based payment verification
- Secure confirmation via email/SMS
- Track successful transactions

### 👥 Friends Module
- Add/accept/reject/remove friends
- View friend list
- View pending requests and friendship status

### 🎥 Virtual Dining (Video Call)
- Start/end video calls with friends
- Track participants
- View call history
> _(WebRTC integration planned)_

### 🧑‍💼 Admin Panel
- Dashboard metrics (users, orders, revenue)
- Manage users, food items, orders, and payments

---

## 🛠️ Tech Stack

| Layer       | Tech Used                          |
|-------------|------------------------------------|
| Frontend    | React.js, Tailwind CSS, Axios      |
| Backend     | ASP.NET Core Web API               |
| Database    | SQL Server                         |
| Auth        | JWT, ASP.NET Identity (optional)   |
| Video Calls | WebRTC / SignalR (planned)         |
| Tools       | Swagger, Postman, Git, VS Code     |

---

## 📁 Project Structure

```text
VideoDiningApp/
├── VideoDining/         # ASP.NET Core backend
│   ├── Controllers/
│   ├── DTOs/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   ├── appsettings.json
│   └── VideoDiningApp.csproj
│
├── VideoDiningUi/       # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
```

---

## 📡 API Overview

> **Swagger:** `http://localhost:5289/swagger/index.html`

### Admin
- `GET /api/admin/dashboard`
- `POST /api/admin/login`
- `GET /api/admin/users`
- `DELETE /api/admin/users/{id}`
- `GET/POST/PUT/DELETE /api/admin/foods`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{orderId}`
- `GET /api/admin/payments`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify`

### Cart
- `GET /api/cart/{userId}`
- `POST /api/cart/add`
- `DELETE /api/cart/remove/{cartItemId}`

### Food
- `GET /api/foods`

### Friends
- `POST /api/friends/add|accept|reject`
- `DELETE /api/friends/remove`
- `GET /api/friends/list/{userId}`
- `GET /api/friends/check/{userId}/{friendId}`
- `GET /api/friends/requests/{userId}`

### Orders
- `POST /api/orders/create/{userId}`
- `GET /api/orders`
- `GET /api/orders/history/{userId}`
- `GET /api/orders/status/{orderId}`
- `POST /api/orders/update-status/{orderId}`
- `POST /api/orders/mark-delivered/{orderId}/{userId}`
- `POST /api/orders/remind/{orderId}`
- `DELETE /api/orders/cancel/{orderId}/{userId}`

### Payments
- `POST /api/payment/send-links`
- `POST /api/payment/verifyOtp`
- `POST /api/payment/generateOtp`
- `POST /api/payment/confirm-payment`
- `POST /api/payment/pay/{orderId}`
- `POST /api/payment/success`

### Video Call
- `POST /api/video-call/start`
- `POST /api/video-call/end`
- `GET /api/video-call/{orderId}/participants`
- `GET /api/video-call/{orderId}`
- `GET /api/video-call/history/{userId}`

---

## 🚀 Getting Started

### Prerequisites
- Node.js + npm
- .NET 6 SDK
- SQL Server
- Visual Studio or VS Code

### 🔧 Setup

#### 1. Clone the repository
```bash
git clone https://github.com/siranjeevis01/VideoDiningApp.git
cd VideoDiningApp
```

#### 2. Run the Frontend
```bash
cd VideoDiningUi
npm install
npm start
```

#### 3. Run the Backend
```bash
cd ../VideoDining
dotnet restore
dotnet ef database update
dotnet run
```

#### 4. Access App
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5289/swagger`

---

## 🖼️ Screenshots
(Add screenshots here of login, dashboard, video call, etc.)

---

## 🔮 Future Enhancements
- [x] Real-time chat during calls
- [x] Google & Facebook OAuth login
- [x] Push notifications
- [x] Dish reviews & ratings
- [x] Order tracking on map
- [x] Mobile responsive design

---

## 🤝 Contact

**👤 Created by:** Siranjeevi  
**📧 Email:** siranjeeviwd@gmail.com  
**💼 LinkedIn:** [linkedin.com/in/siranjeevis01](https://linkedin.com/in/siranjeevis01)  
**💻 GitHub:** [github.com/siranjeevis01](https://github.com/siranjeevis01)


