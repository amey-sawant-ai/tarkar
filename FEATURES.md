# Tarkari - Feature Documentation

## Project Overview

Tarkari is a comprehensive full-stack restaurant platform built with Next.js 16, React 19, MongoDB, and modern web technologies. It provides a complete solution for restaurant ordering, user management, and real-time features.

## 🏗️ Technical Stack

- **Framework**: Next.js 16.0.4 (App Router) with custom API routes
- **Frontend**: React 19.2.0 with TypeScript (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS v4 with custom OKLCH color system
- **UI Components**: shadcn/ui components (new-york style)
- **Authentication**: Custom token-based authentication system
- **State Management**: React Context (CartContext, LanguageContext, AuthContext, ToastContext)
- **Animations**: Framer Motion (`motion` package) + `tw-animate-css`
- **Icons**: Lucide React

## 🔐 Authentication System

### Custom Authentication

- [x] **Token-based Authentication**: JWT-style custom tokens
- [x] **Demo Mode**: Built-in demo user (`demo@tarkari.com/password`)
- [x] **Session Management**: Persistent login with localStorage
- [x] **Protected Routes**: Automatic redirects for unauthorized access
- [x] **User Registration**: Complete signup flow with validation
- [x] **Password Reset**: Forgot password with email verification flow

### Security Features

- [x] Password hashing and validation
- [x] Token expiration handling
- [x] Secure API endpoint protection
- [x] Demo mode for development testing
- [x] Password reset token system with expiration
- [x] Secure password reset flow

## 👤 User Management

### User Profiles

- [x] Complete user profile management
- [x] Personal information editing
- [x] Wallet balance tracking
- [x] User preferences (language, notifications)
- [x] Account creation date tracking

### User Dashboard

- [x] **Dynamic Statistics**: Real-time order and spending analytics
- [x] **Recent Orders**: Last 5 orders with status tracking
- [x] **Favorite Dishes**: Quick access to preferred items
- [x] **Wallet Integration**: Balance display and management
- [x] **Member Since**: Account tenure display

## 🍽️ Menu System

### Comprehensive Menu

- [x] **161 Dishes**: Fully seeded with real restaurant data
- [x] **11 Categories**: Organized by cuisine type
- [x] **Detailed Information**: Name, description, price, images
- [x] **Dietary Indicators**: Vegetarian/non-vegetarian markers
- [x] **Spice Level**: Spicy dish indicators
- [x] **Search Functionality**: Find dishes quickly with debounced search

### Menu Features

- [x] Dynamic pricing in paise (₹ conversion)
- [x] Image handling with fallbacks
- [x] Category-based organization
- [x] Dish availability tracking

## 🛒 Shopping Cart & Orders

### Shopping Cart

- [x] **Real-time Updates**: Instant cart modifications
- [x] **Quantity Management**: Add/remove items easily
- [x] **Price Calculation**: Dynamic total computation
- [x] **Persistent Cart**: Saves across sessions
- [x] **Visual Feedback**: Toast notifications

### Order Management

- [x] **Complete Order Flow**: From cart to delivery
- [x] **Order Status Tracking**: 7 status levels
  - [x] Order Placed
  - [x] Confirmed
  - [x] Preparing
  - [x] Ready
  - [x] Out for Delivery
  - [x] Delivered
  - [x] Cancelled
- [x] **Order History**: Paginated order listing with filters
- [x] **Order Details**: Comprehensive order information
- [x] **Billing System**: Tax calculation, delivery fees
- [x] **Timeline Tracking**: Status change history with timestamps

### Order Features

- [x] **Delivery Options**: Delivery vs Pickup selection
- [x] **Address Management**: Multiple delivery addresses with add/select
- [x] **Payment Method Selection**: COD + saved payment methods
- [x] **Order Notes**: Special instructions support
- [x] **Reorder Functionality**: Quick reordering from history

## ❤️ Favorites System

### Favorites Management

- [x] **Add/Remove Favorites**: Toggle favorite dishes
- [x] **Favorites Dashboard**: Dedicated favorites page
- [x] **Quick Actions**: Add to cart from favorites
- [x] **Visual Indicators**: Heart icons throughout the app
- [x] **Persistent Storage**: Saves user preferences

### Favorites Features

- [x] Last ordered date tracking
- [x] Order frequency statistics
- [x] Category organization
- [x] Quick reordering
- [x] Remove with confirmation

## 🌐 Multi-Language Support

### Language System

- [x] **3 Languages**: English, Hindi, Marathi
- [x] **Complete Translation**: All UI elements translated
- [x] **Dynamic Switching**: Language change without reload
- [x] **Persistent Preference**: Remembers user choice
- [x] **Context-Aware**: Professional translation keys

### Supported Languages

- [x] **English (en)**: Primary language
- [x] **Hindi (hi)**: Hindi translations
- [x] **Marathi (mr)**: Marathi translations

## 🎨 User Interface & Design

### Design System

- [x] **Custom Color Palette**: Restaurant-themed OKLCH colors
  - [x] Dark Green: Primary brand color
  - [x] Warm Beige: Background color
  - [x] Tomato Red: Accent color
  - [x] Saffron Yellow: Secondary accent
- [x] **Dark Mode Support**: Complete dark theme implementation
- [x] **Responsive Design**: Mobile-first approach
- [x] **Animations**: Smooth transitions and interactions

### UI Components

- [x] **shadcn/ui Integration**: Professional component library
- [x] **Custom Components**: Restaurant-specific elements
- [x] **Form Handling**: Comprehensive form validation
- [x] **Loading States**: Skeleton loaders and spinners
- [x] **Toast Notifications**: Custom toast system with animations

### User Experience

- [x] **Navigation**: Intuitive menu structure
- [x] **Search**: Fast dish and category search with filters
- [x] **Filters**: Order status and category filters
- [x] **Pagination**: Efficient data loading
- [x] **Error Handling**: User-friendly error messages

## 📊 Dashboard Features

### User Dashboard

- [x] **Statistics Overview**: Order count, spending, membership
- [x] **Recent Activity**: Latest orders and favorites
- [x] **Quick Actions**: Direct access to common features

### Navigation

- [x] **Sidebar Navigation**: Easy access to all features
- [x] **Dashboard Navbar**: Context-aware navigation
- [x] **Quick Links**: Shortcuts to popular actions

## 🔧 API Architecture

### REST API Endpoints

- [x] **Authentication APIs**: Login, register, profile
- [x] **Menu APIs**: Dishes, categories, search
- [x] **Order APIs**: Create, read, update, track
- [x] **User APIs**: Profile, favorites, dashboard stats
- [ ] **Payment APIs**: Wallet, payment methods

### API Features

- [x] **Standardized Responses**: Consistent API format
- [x] **Error Handling**: Comprehensive error codes
- [x] **Validation**: Request/response validation
- [x] **Authentication**: Token-based security
- [x] **Pagination**: Efficient data loading
- [x] **Search**: Full-text search capabilities

### Database Integration

- [x] **MongoDB Integration**: NoSQL database with Mongoose
- [x] **Data Models**: User, Order, Dish, Category, Favorite, etc.
- [x] **Relationships**: Proper document relationships
- [ ] **Indexing**: Optimized queries
- [x] **Validation**: Schema validation

## 🛠️ Development Features

### Development Tools

- [x] **Demo Mode**: Easy testing with demo user
- [x] **Seeding Scripts**: Database population scripts
- [x] **TypeScript**: Full type safety
- [x] **ESLint**: Code quality enforcement
- [x] **Environment Variables**: Configuration management

### Database Seeding

- [x] **Dish Seeding**: 161 real dishes across 11 categories
- [x] **User Seeding**: Demo user creation
- [x] **Order Seeding**: Sample order data
- [x] **Favorites Seeding**: Sample favorite dishes
- [x] **Category Seeding**: Restaurant categories

### Build & Deploy

- [x] **Next.js Build**: Optimized production builds
- [x] **Static Assets**: Proper asset handling
- [x] **Environment Support**: Development/production configs
- [x] **Performance**: Optimized for speed

## 📱 Pages & Routes

### Public Pages

- [x] **Home Page**: Restaurant introduction and highlights
- [x] **Menu Page**: Complete dish catalog
- [x] **About Page**: Restaurant information
- [x] **Contact Page**: Contact details and form
- [x] **Gallery Page**: Restaurant photos
- [x] **Reviews Page**: Customer testimonials

### Authentication Pages

- [x] **Login Page**: User authentication
- [x] **Signup Page**: User registration
- [x] **Password Reset**: Complete forgot password flow

### Dashboard Pages

- [x] **Main Dashboard**: Overview and statistics
- [x] **My Orders**: Order history and tracking
- [x] **Favorites**: Saved dishes
- [ ] **Profile**: User settings
- [ ] **Addresses**: Delivery addresses
- [ ] **Wallet**: Payment and balance
- [ ] **Settings**: App preferences

### Additional Features

- [ ] **Order Tracking**: Real-time order status
- [x] **Party Orders**: Group ordering with packages and catering
- [ ] **Reservations**: Table booking system (UI ready)
- [ ] **Payment Methods**: Multiple payment options
- [ ] **Reviews System**: Customer feedback

## 🔐 Admin Panel

### Authentication & Access Control

- [x] **Role-Based Access**: Admin, Staff, User roles
  - [x] Add `role` field to User model (`enum: ["user", "admin", "staff"]`)
  - [x] Create `requireAdmin()` helper in `lib/api-helpers.ts`
  - [x] Create `requireStaff()` helper for kitchen/delivery staff
  - [x] Update token to include role or fetch from DB on each request
- [x] **Admin Login**: Separate or shared login with role-based redirect
  - [x] Modify login API to return user role
  - [x] Update `AuthContext` to store and expose role
  - [ ] Add redirect logic: admin → `/admin`, user → `/dashboard`
- [x] **Protected Admin Routes**: Middleware-based protection
  - [x] Create `app/admin/` route group
  - [x] Add `middleware.ts` for `/admin/*` route protection
  - [x] Create `AdminContext` or extend `AuthContext` with admin state

### Admin Dashboard

- [x] **Overview Statistics**: Key business metrics at a glance
  - [x] Create `GET /api/admin/stats` endpoint
  - [x] Total orders (today/week/month)
  - [x] Revenue statistics with charts
  - [x] Active orders count
  - [x] New customers count
  - [ ] Popular dishes ranking
- [x] **Dashboard UI**: Admin home page
  - [x] Create `app/admin/page.tsx` with stat cards
  - [ ] Add charts using a chart library (recharts/chart.js)
  - [x] Recent activity feed
  - [ ] Quick action buttons

### Order Management

- [x] **View All Orders**: Complete order list with filters
  - [x] Create `GET /api/admin/orders` endpoint (all users' orders)
  - [x] Filter by status, date range, customer
  - [x] Search by order ID or customer name
  - [x] Pagination with 20 orders per page
- [x] **Update Order Status**: Change order status
  - [x] Create `PATCH /api/admin/orders/[id]/status` endpoint
  - [x] Status dropdown: confirmed → preparing → ready → out-for-delivery → delivered
  - [x] Add timeline entry on status change
  - [ ] Optional: Trigger notification to customer
- [x] **Cancel/Refund Orders**: Handle cancellations
  - [x] Create `POST /api/admin/orders/[id]/cancel` endpoint
  - [x] Add cancellation reason field
  - [x] Update wallet balance for refunds
  - [x] Create refund transaction record
- [x] **Order Details View**: Comprehensive order info
  - [x] Customer details, items, billing breakdown
  - [x] Delivery address with map link
  - [x] Order timeline history
  - [ ] Print invoice functionality

### Menu Management

- [x] **View All Dishes**: Menu item listing
  - [x] Create `GET /api/admin/dishes` with filters
  - [x] Filter by category, availability, price range
  - [x] Search by name or description
  - [x] Sort by name, price, popularity
- [x] **Add New Dish**: Create menu items
  - [x] Create `POST /api/admin/dishes` endpoint
  - [x] Form: name, description, pricePaise, category, image
  - [x] Dietary flags: isVeg, isSpicy, isVegan
  - [ ] Image upload to local storage or cloud (Cloudinary)
- [x] **Edit Dish**: Update existing items
  - [x] Create `PATCH /api/admin/dishes/[id]` endpoint
  - [x] Pre-populated edit form
  - [x] Image replacement option
- [x] **Delete Dish**: Remove menu items
  - [x] Create `DELETE /api/admin/dishes/[id]` endpoint
  - [x] Soft delete (set `isDeleted: true`) vs hard delete
  - [x] Confirmation modal before deletion
- [x] **Toggle Availability**: Quick availability switch
  - [x] Create `PATCH /api/admin/dishes/[id]/availability` endpoint
  - [x] Add `isAvailable` field to Dish model
  - [x] Toggle switch in dish list UI

### Category Management

- [x] **CRUD Categories**: Manage menu categories
  - [x] Create `GET/POST /api/admin/categories` endpoints
  - [x] Create `PATCH/DELETE /api/admin/categories/[id]` endpoints
  - [x] Category form: name, description, image, displayOrder
- [ ] **Reorder Categories**: Change display order
  - [ ] Add `displayOrder` field to Category model
  - [ ] Drag-and-drop reordering UI
  - [ ] Bulk update endpoint for order changes

### User Management

- [x] **View All Users**: Customer listing
  - [x] Create `GET /api/admin/users` endpoint
  - [x] Filter by role, registration date, order count
  - [x] Search by name, email, phone
  - [x] Pagination with user count
- [x] **User Details**: View customer profile
  - [x] Create `GET /api/admin/users/[id]` endpoint
  - [ ] Order history for specific user
  - [ ] Total spent, favorite dishes
  - [x] Account status and creation date
- [x] **Manage User Roles**: Promote/demote users
  - [x] Create `PATCH /api/admin/users/[id]/role` endpoint
  - [x] Role selector: user ↔ staff ↔ admin
  - [x] Confirmation for role changes
- [x] **Disable/Enable Accounts**: Account management
  - [x] Add `isActive` field to User model
  - [x] Create `PATCH /api/admin/users/[id]/status` endpoint
  - [ ] Disabled users cannot login

### Reports & Analytics

- [x] **Sales Reports**: Revenue analytics
  - [x] Create `GET /api/admin/reports` endpoint
  - [x] Daily/weekly/monthly revenue charts
  - [x] Compare periods (this week vs last week)
  - [ ] Export to CSV/PDF
- [x] **Popular Items Report**: Best-selling dishes
  - [x] Create `GET /api/admin/reports` endpoint (includes popular dishes)
  - [x] Ranking by order count and revenue
  - [x] Filter by date range
- [x] **Customer Reports**: User analytics
  - [x] New registrations over time
  - [x] Repeat customer rate
  - [x] Average order value

### Settings & Configuration

- [x] **Restaurant Settings**: Basic info management
  - [x] Create Settings model for key-value config
  - [x] Restaurant name, address, phone, email
  - [x] Operating hours (open/close time per day)
  - [x] Delivery radius and minimum order
- [x] **Pricing Configuration**: Fees and taxes
  - [ ] Tax percentage (GST)
  - [x] Delivery fee (flat or distance-based)
  - [x] Minimum order for free delivery
- [x] **Notification Settings**: Communication preferences
  - [x] Email templates for order confirmations
  - [x] SMS integration settings (future)

### Admin UI Components

- [x] **Admin Layout**: Consistent admin shell
  - [x] Create `app/admin/layout.tsx`
  - [x] Admin sidebar with navigation links
  - [x] Admin header with user info and logout
  - [ ] Breadcrumb navigation
- [x] **Data Tables**: Reusable table component
  - [x] Sortable columns
  - [x] Pagination controls
  - [ ] Row selection for bulk actions
  - [x] Search and filter integration
- [x] **Forms**: Admin form components
  - [x] Dish form with image upload (URL-based)
  - [x] Category form
  - [x] Settings forms
  - [x] Validation with error messages

---

### Implementation Order (Recommended)

**Phase 1: Foundation**

1. Add `role` field to User model
2. Create `requireAdmin()` helper
3. Set up `app/admin/` route group and layout
4. Basic admin dashboard with hardcoded stats

**Phase 2: Order Management**

1. Admin orders list API and page
2. Order status update functionality
3. Order details view
4. Cancel/refund flow

**Phase 3: Menu Management**

1. Dishes CRUD APIs
2. Dishes list page with filters
3. Add/Edit dish forms
4. Availability toggle

**Phase 4: Users & Reports**

1. Users list and details
2. Role management
3. Basic sales reports
4. Analytics dashboard

**Phase 5: Polish**

1. Settings management
2. Export functionality
3. UI refinements
4. Testing and bug fixes

---

## �🔮 Future Enhancements

### Planned Features

- [ ] **Real-time Notifications**: Order status updates
- [ ] **Advanced Search**: Filters and sorting
- [ ] **Loyalty Program**: Rewards system
- [ ] **Social Features**: Reviews and ratings
- [ ] **Analytics Dashboard**: Business insights
- [ ] **Mobile App**: React Native companion

### Technical Improvements

- [ ] **Performance Optimization**: Caching and CDN
- [ ] **SEO Enhancement**: Meta tags and structured data
- [ ] **PWA Features**: Offline support
- [ ] **Testing**: Comprehensive test suite
- [ ] **Monitoring**: Error tracking and analytics

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance
- pnpm package manager

### Installation

```bash
# Clone repository
git clone <repository-url>
cd tarkari

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# Seed database
pnpm run seed

# Start development server
pnpm dev
```

### Demo Access

- **Email**: demo@tarkari.com
- **Password**: password
- **Features**: Full access to all features with sample data

---

_Last Updated: January 2026_
_Version: 1.0.0_
