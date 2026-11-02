# Database Setup (MongoDB)

## Prerequisites

- MongoDB 6.0 or higher (local or MongoDB Atlas)
- MongoDB Shell (mongosh) or MongoDB Compass

## Initialization

### 1. Start MongoDB

**Local MongoDB:**
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
net start MongoDB
```

**MongoDB Atlas (Cloud):**
1. Create a free cluster at https://cloud.mongodb.com
2. Get your connection string
3. Update `MONGODB_URI` in backend/.env

### 2. Run Seed Data

```bash
# From project root
cd backend
npm install
node ../database/seed.mongodb.js
```

This will:
- Create all collections
- Insert 9 furniture categories
- Insert 11 sample products with placeholder media
- Insert 5 sample inquiries
- Create default business settings

The seed script does not create an admin by default. Set `ADMIN_EMAIL` and
`ADMIN_PASSWORD` before seeding, or run `npm run create-admin` afterwards.

### 3. Create Additional Admins (Optional)

```bash
cd backend
npm run create-admin -- --email admin@example.com --password "secure_password" --name "Admin Name"
```

## Schema Overview

### Collections

| Collection | Description |
|------------|-------------|
| `admins` | Admin users for dashboard access |
| `categories` | Product categories |
| `products` | Furniture products (with embedded media) |
| `inquiries` | Customer purchase inquiries |
| `businesssettings` | Public business information (single document) |

### Key Design Decisions

1. **Embedded Media** - Product media (images/videos) stored as subdocuments in products
2. **References** - Products reference categories; Inquiries reference products
3. **Single Business Settings** - Enforced by `_id: 1` primary key
4. **Indexes** - Added on frequently queried fields (slugs, status, text search)
5. **Virtuals** - Computed fields like `displayPrice`, `hasDiscount`, `formattedPrice`

## MongoDB Connection

Update `backend/.env` with your MongoDB URI:

```env
# Local
MONGODB_URI=mongodb://localhost:27017/carpenter_store

# MongoDB Atlas (with username/password)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carpenter_store?retryWrites=true&w=majority

# With authentication database
MONGODB_URI=mongodb://username:password@localhost:27017/carpenter_store?authSource=admin
```

## Backup & Restore

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/carpenter_store" --out=./backup

# Restore
mongorestore --uri="mongodb://localhost:27017/carpenter_store" ./backup/carpenter_store
```

## Migration Strategy

For schema changes:

1. Use Mongoose's built-in validation and defaults
2. For breaking changes, write migration scripts in `database/migrations/`
3. Run migrations during deployment

Example migration:
```javascript
// database/migrations/001_add_product_sku.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI)
  await mongoose.connection.db.collection('products').updateMany(
    { sku: { $exists: false } },
    { $set: { sku: '' } }
  )
  await mongoose.connection.close()
}
migrate()
```

## Admin Setup

The seed script creates an admin only when `ADMIN_EMAIL` and `ADMIN_PASSWORD`
are set. Otherwise, create one with `npm run create-admin` (from `backend`).
Never keep the setup password in the environment after creating the account.

## Production Notes

1. **Use MongoDB Atlas** for managed hosting
2. **Enable authentication** and use strong passwords
3. **Configure IP whitelist** (Atlas) or firewall rules
4. **Enable backups** and point-in-time recovery
5. **Monitor** with Atlas metrics or MongoDB Ops Manager
6. **Use connection pooling** (default maxPoolSize: 10)
7. **Set appropriate timeouts** (serverSelectionTimeoutMS, socketTimeoutMS)