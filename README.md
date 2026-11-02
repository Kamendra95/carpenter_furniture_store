# Carpenter Furniture Store

A complete, professional carpenter furniture e-commerce and online showroom website with separate frontend, backend, and database layers.

## 🌟 Features

### Customer Website
- **Home Page** - Hero section, featured products, categories, why choose us, custom furniture CTA
- **Product Listing** - Responsive grid, search, filter by category/price, sort, pagination
- **Product Details** - Multiple images, videos, price, description, specs, contact options
- **Contact Flow** - Inquiry form with WhatsApp, phone, email integration
- **Additional Pages** - About Us, Contact, Categories, Custom Furniture, Privacy Policy

### Admin Dashboard (`/admin`)
- **Authentication** - Secure JWT-based login, protected routes
- **Dashboard** - Stats overview (products, inquiries), recent activity
- **Product Management** - Full CRUD, media upload (images/videos), status toggle, featured flag
- **Category Management** - CRUD with product counts, safe deletion
- **Inquiry Management** - Table view, status updates, quick contact actions
- **Business Settings** - Logo, contact info, social links, about text

### Technical Features
- **REST API** - Consistent responses, proper HTTP codes, validation
- **Database** - MongoDB with Mongoose ODM, embedded media, references, indexes
- **Media** - Cloudinary integration for images/videos
- **Security** - bcrypt passwords, JWT auth, rate limiting, Helmet, CORS, input validation
- **Responsive** - Mobile-first design, Tailwind CSS

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, React Router DOM, Tailwind CSS, Axios, Lucide React |
| **Backend** | Node.js, Express.js, Mongoose, bcryptjs, jsonwebtoken, multer, cloudinary |
| **Database** | MongoDB 6.0+ |
| **Media** | Cloudinary |

## 📁 Project Structure

```
carpenter-furniture-store/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context providers
│   │   ├── hooks/            # Custom hooks
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/
│   │   │   ├── customer/     # Customer-facing pages
│   │   │   └── admin/        # Admin dashboard pages
│   │   ├── routes/           # Route configuration
│   │   ├── services/         # API service
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── validators/       # Request validators
│   │   ├── utils/            # Utility functions
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Entry point
│   ├── scripts/
│   │   └── create-admin.js   # Admin creation script
│   ├── .env.example
│   └── package.json
├── database/
│   ├── seed.mongodb.js       # MongoDB seed script
│   └── README.md             # Database docs
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6.0+ (local or MongoDB Atlas)
- npm or yarn
- Cloudinary account (for media uploads)

### 1. Clone and Install

```bash
# Navigate to project directory
cd carpenter-furniture-store

# Install all dependencies
npm run install:all
```

### 2. Database Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free cluster at https://cloud.mongodb.com
2. Get your connection string
3. Update `MONGODB_URI` in backend/.env

**Run Seed Data:**
```bash
# From the project root
npm run db:seed
```

This creates:
- 9 furniture categories
- 11 sample products with placeholder media
- 5 sample inquiries
- Default business settings

The seed script does not create an admin by default. Set `ADMIN_EMAIL` and
`ADMIN_PASSWORD` in `backend/.env` before seeding, or run `npm run create-admin`
afterwards.

### 3. Configure Environment

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your values
```

Required variables:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/carpenter_store
JWT_SECRET=your_very_long_random_secret_at_least_32_chars
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_PHONE=+919876543210
ADMIN_WHATSAPP=919876543210
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
```

`ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are only used by the seed
script to create the first admin. Do not keep `ADMIN_PASSWORD` in the
environment after setup.

**Frontend** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
# Edit if needed (defaults work for local dev)
```

### 4. Create Additional Admins (Optional)

```bash
cd backend
npm run create-admin -- --email admin@example.com --password "secure_password" --name "Admin Name"
```

### 5. Run Development Servers

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Or both from root:
npm run dev
```

Access:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Admin**: http://localhost:5173/admin

## 📚 API Documentation

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products (with filters) |
| GET | `/api/products/:idOrSlug` | Get product details |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/categories` | List all categories |
| GET | `/api/categories/:slug/products` | Products by category |
| GET | `/api/settings/public` | Public business settings |
| POST | `/api/inquiries` | Submit inquiry |

### Admin Authentication
Admin sessions use the HTTP-only `admin_token` cookie. Non-browser clients may also send `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/login` | Admin login |
| POST | `/api/admin/auth/logout` | Admin logout |
| GET | `/api/admin/auth/me` | Get current admin |

### Admin Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/products` | List products (paginated) |
| GET | `/api/admin/products/:id` | Get product |
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| PATCH | `/api/admin/products/:id/status` | Toggle active status |
| POST | `/api/admin/products/:id/media` | Upload media |
| DELETE | `/api/admin/products/:id/media/:mediaId` | Delete media |

### Admin Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/categories` | List categories |
| GET | `/api/admin/categories/:id` | Get category |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |

### Admin Inquiries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/inquiries` | List inquiries |
| GET | `/api/admin/inquiries/stats` | Get stats |
| GET | `/api/admin/inquiries/:id` | Get inquiry |
| PATCH | `/api/admin/inquiries/:id/status` | Update status |

### Admin Dashboard & Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard/stats` | Dashboard stats |
| GET | `/api/admin/settings` | Get settings |
| PUT | `/api/admin/settings` | Update settings |
| GET | `/api/admin/settings/public` | Public settings |

## 🔐 Security Features

- **Password Hashing** - bcrypt with cost factor 12
- **JWT Authentication** - Secure tokens with expiration
- **Rate Limiting** - Global, auth, inquiry, upload limits
- **Input Validation** - express-validator on all endpoints
- **NoSQL Injection Prevention** - Mongoose schema validation
- **XSS Protection** - Helmet, input sanitization
- **CORS** - Configured for frontend origin only
- **File Upload Security** - MIME type validation, size limits, Cloudinary
- **Environment Variables** - No secrets in code

## 🎨 Customization

### Colors (Tailwind)
Edit `frontend/tailwind.config.js`:
```js
colors: {
  wood: { 50: '#fdf8f3', ..., 950: '#3a1f19' },
  cream: { 50: '#fffefc', ..., 900: '#8a6b32' },
  charcoal: { 50: '#f0f0f0', ..., 950: '#1f1f1f' }
}
```

### Business Settings
Update via Admin Dashboard → Settings or directly in database.

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend lint
cd frontend && npm run lint
```

## 📦 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET` (64+ chars)
3. Use MongoDB Atlas for managed hosting
4. Set up reverse proxy (nginx)
5. Use PM2 or similar process manager

### Frontend
```bash
cd frontend && npm run build
# Deploy dist/ folder to static hosting (Vercel, Netlify, etc.)
```

### Database
- Use MongoDB Atlas for managed hosting
- Enable authentication and IP whitelist
- Enable automated backups and point-in-time recovery
- Monitor with Atlas metrics

### Media
- Cloudinary handles CDN and optimization
- Configure upload presets if needed

## 🐛 Troubleshooting

### Database Connection Failed
- Check MongoDB is running locally or Atlas cluster is accessible
- Verify `MONGODB_URI` in `.env`
- Check network connectivity and firewall rules
- For Atlas: verify IP whitelist includes your server IP

### Cloudinary Upload Fails
- Verify credentials in `.env`
- Check Cloudinary dashboard for usage limits
- Ensure file types are allowed

### JWT Errors
- Ensure `JWT_SECRET` is set and consistent
- Check token expiration
- Clear browser localStorage/cookies

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env`
- Check frontend API base URL

## 📝 License

MIT License - Feel free to use for your carpentry business!

## 🤝 Support

For issues or customization requests, please open a GitHub issue.

---

Built with ❤️ for carpenters and furniture makers worldwide.