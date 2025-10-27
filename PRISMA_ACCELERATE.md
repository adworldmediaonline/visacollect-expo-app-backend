# Prisma Accelerate Setup Guide

## 🚀 What is Prisma Accelerate?

Prisma Accelerate is a global database cache that provides:

- **Connection pooling** - Efficient database connections
- **Global caching** - Edge-deployed query caching
- **Low latency** - Faster database queries worldwide

## 📋 Prerequisites

1. A Prisma account at [console.prisma.io](https://console.prisma.io/)
2. A PostgreSQL database (hosted anywhere)
3. Your project using Prisma Client

## 🔧 Initial Setup

### 1. Enable Prisma Accelerate

1. Go to [Prisma Console](https://console.prisma.io/)
2. Create a new project or select existing one
3. Click **Enable Accelerate**
4. Connect your PostgreSQL database
5. Copy your Accelerate connection string

### 2. Update Your Environment

The Accelerate connection URL format:

```
prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
```

**Local Development (.env):**

```bash
# Option 1: Use Prisma Accelerate (uses your quota)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbG..."

# Option 2: Direct connection for local dev (recommended)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

**Staging (.env.staging or GitHub Secrets):**

```bash
STAGING_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=STAGING_KEY"
```

**Production (GitHub Secrets):**

```bash
PRODUCTION_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=PRODUCTION_KEY"
```

### 3. Install Required Packages

Your project already has these installed:

```bash
npm install @prisma/client @prisma/extension-accelerate
```

### 4. Update Prisma Client

The configuration in `src/config/prisma.js` is already set up:

```javascript
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export default prisma;
```

## 🔐 API Key Management

### Creating API Keys

1. Go to your project in [Prisma Console](https://console.prisma.io/)
2. Navigate to **Accelerate → API Keys**
3. Click **Create API Key**
4. Name it (e.g., "Production", "Staging", "Development")
5. Copy the key immediately (you won't see it again!)

### Best Practices

✅ **DO:**

- Create separate API keys for each environment
- Rotate keys regularly (every 90 days recommended)
- Store keys in GitHub Secrets, never in code
- Use descriptive names for keys

❌ **DON'T:**

- Commit API keys to version control
- Share API keys between environments
- Use production keys for development
- Expose keys in client-side code

### Rotating API Keys

1. Create a new API key in Prisma Console
2. Update the GitHub Secret with new key
3. Deploy the application
4. Verify the new key works
5. Delete the old key from Prisma Console

## 📊 GitHub Actions Integration

### Environment-Based Usage

```yaml
# CI Tests - Use local PostgreSQL (not Accelerate)
DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db

# Staging Deployment - Use Accelerate
DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}

# Production Deployment - Use Accelerate
DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
```

### Why Local PostgreSQL for Tests?

- **Cost**: Avoid using Accelerate quota for tests
- **Speed**: Local database is faster for CI
- **Rate Limits**: Prevents hitting Accelerate limits
- **Isolation**: Each test run gets fresh database

## 🔄 Database Migrations

### Running Migrations

**Development (Local):**

```bash
npx prisma migrate dev --name migration_name
```

**Production (Automated via GitHub Actions):**

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=PROD_KEY" \
  npx prisma migrate deploy
```

### Migration Workflow

1. **Develop locally** with direct PostgreSQL or Accelerate
2. **Create migration**: `npx prisma migrate dev`
3. **Test migration** in staging environment
4. **Deploy to production** via GitHub Actions (automatic)

### Troubleshooting Migrations

**Error: "Migration failed to apply"**

- Check API key has migration permissions
- Verify database connection is stable
- Ensure no conflicting schema changes

**Error: "Rate limit exceeded"**

- You've hit Accelerate query limits
- Wait for rate limit reset or upgrade plan
- Consider direct connection for migrations

## 💰 Pricing & Limits

### Free Tier

- 10,000 requests per month
- Good for development and testing

### Paid Plans

- Higher request limits
- Dedicated support
- Advanced caching features

Check current pricing: [prisma.io/pricing](https://www.prisma.io/pricing)

## 📈 Monitoring Usage

### Prisma Console Dashboard

View in real-time:

- Request count
- Cache hit rate
- Response times
- Error rates
- Geographic distribution

### Setting Up Alerts

1. Go to **Accelerate → Settings**
2. Enable **Usage Alerts**
3. Set threshold (e.g., 80% of quota)
4. Add email notifications

## 🎯 Performance Optimization

### Enable Query Caching

```javascript
// Cache this query for 60 seconds
const users = await prisma.user.findMany({
  cacheStrategy: { ttl: 60 },
});

// Cache with tags for invalidation
const posts = await prisma.post.findMany({
  cacheStrategy: {
    ttl: 300,
    tags: ['posts'],
  },
});
```

### Cache Invalidation

```javascript
// Invalidate specific cache tags
await prisma.$accelerate.invalidate({
  tags: ['posts'],
});
```

### Connection Pooling

Accelerate automatically handles connection pooling. No configuration needed!

## 🔍 Debugging

### Enable Query Logging

```javascript
// In development
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
}).$extends(withAccelerate());
```

### Check Connection

```bash
# Test if Accelerate connection works
npx prisma db pull
```

### Verify Schema

```bash
# Generate Prisma Client
npx prisma generate

# Validate schema
npx prisma validate
```

## 🚨 Common Issues

### "Invalid API key"

- Key might be expired or deleted
- Check key in Prisma Console
- Verify key is correctly set in environment

### "Connection timeout"

- Prisma Accelerate might be experiencing issues
- Check [status.prisma.io](https://status.prisma.io/)
- Fallback to direct connection if needed

### "Rate limit exceeded"

- You've exceeded your plan's quota
- Check usage in Prisma Console
- Upgrade plan or optimize queries

### "Migration failed"

- Ensure API key has schema modification permissions
- Check database has no conflicting changes
- Verify network connectivity

## 📚 Resources

- [Prisma Accelerate Docs](https://www.prisma.io/docs/accelerate)
- [Prisma Console](https://console.prisma.io/)
- [Prisma Status Page](https://status.prisma.io/)
- [Prisma Community](https://www.prisma.io/community)
- [Prisma Discord](https://pris.ly/discord)

## ✅ Checklist

Before going to production:

- [ ] Created separate API keys for staging & production
- [ ] Added keys to GitHub Secrets
- [ ] Tested migrations in staging
- [ ] Set up usage alerts in Prisma Console
- [ ] Documented key rotation process
- [ ] Verified cache strategy for critical queries
- [ ] Set up monitoring and alerts
- [ ] Have fallback plan if Accelerate is down
- [ ] Team knows how to rotate keys
- [ ] Production deploy tested in staging

---

**You're now ready to use Prisma Accelerate in production! 🎉**
