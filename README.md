This repository contains the code for admin dashboard with the backend connection
🚀 Features

Authentication

Admin login with JWT authentication

Role-based access

Dashboard Overview

Stats cards (total products, customers, orders)

Order status breakdown (Delivered, Shipped, Processing)

Quick navigation cards to management pages

Product Management

Add, update, delete, and view products

Category-based listing with stock status

Customer Management

View all registered customers

Edit and delete customer details

Admin impersonation to act as a customer

Order Management

Full CRUD (create, update, delete, view orders)

Update order status (Processing → Shipped → Delivered)

Track orders

Branding & Settings

Upload store logo

Choose theme colors and fonts

Add custom branding HTML

Glassmorphism-styled settings page

📂 Project Structure
frontend/
  └── src/
      └── admin/
          ├── components/
          │   ├── AdminLayout.js
          │   ├── AdminSidebar.js
          │   └── adminnavbar.js
          ├── pages/
          │   ├── AdminDashboardPage.js
          │   ├── AdminLoginPage.js
          │   ├── ProductManagementPage.js
          │   ├── AddProductPage.js
          │   ├── CustomerManagementPage.js
          │   ├── OrderManagementPage.js
          │   ├── BrandingSettingsPage.js
          │   └── ProductListPage.js
          └── AdminRoutes.js

⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/trendy-cart.git
cd trendy-cart/frontend

2. Install dependencies
npm install

3. Start the development server
npm start

4. Backend Setup

🔑 Admin Login Credentials (Seeded)
Email: admin@trendycart.com
Password: admin123

🛠 Tech Stack

Frontend: React.js (with external CSS, no Tailwind)

Backend: Node.js, Express.js, MongoDB

Authentication: JWT (JSON Web Token)

UI Components: React Icons

📊 Dashboard Preview

Stats Cards: Show total products, customers, and orders

Charts (Optional): Order status visualization

Quick Links: Navigate to product, customer, and order management

✨ Future Improvements

Export reports (CSV, Excel, PDF)

Notification system for new orders

Analytics and sales trends graph


