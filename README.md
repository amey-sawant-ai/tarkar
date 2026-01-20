Tarkari - Full-Stack Restaurant Ordering Platform
Tarkari is a comprehensive restaurant ordering and management system built with modern web technologies. It provides a complete end-to-end solution for restaurant customers to browse menus, place orders, track deliveries, and for restaurant staff to manage operations.

Key Features
Customer Features:

🍽️ Digital Menu - 161 dishes across 11 categories with images, pricing, and dietary indicators
🛒 Smart Shopping Cart - Real-time cart management with persistent storage
📦 Order Tracking - 7-stage order lifecycle tracking (placed → confirmed → preparing → ready → out-for-delivery → delivered/cancelled)
❤️ Favorites System - Save and quickly reorder favorite dishes
🗺️ Multiple Addresses - Manage multiple delivery addresses
🌐 Multi-Language - Support for English, Hindi, and Marathi
💰 Wallet System - Digital wallet for payments and balance tracking
⭐ Reviews & Ratings - Rate and review dishes
Admin & Staff Features:

📊 Dashboard Analytics - Real-time sales, orders, and revenue metrics
👥 User Management - View, manage, and assign user roles
🍴 Menu Management - Add, edit, delete dishes and categories
📋 Order Management - View all orders, update status, handle refunds
📈 Reports - Sales analytics, popular items, customer insights
⚙️ Settings - Restaurant configuration and operational parameters
Tech Stack
Frontend: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
Backend: Next.js API Routes, custom token-based authentication
Database: MongoDB with Mongoose ODM
UI Components: shadcn/ui
State Management: React Context (Auth, Cart, Language, Toast)
Payment: Custom wallet system (COD + saved methods)
Architecture Highlights
Custom token-based authentication (NOT NextAuth)
Price handling in integer paise (₹1 = 100 paise)
Role-based access control (user, admin, staff)
Real-time order timeline tracking
Responsive mobile-first design
