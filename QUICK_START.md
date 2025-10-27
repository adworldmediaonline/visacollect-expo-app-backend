# ⚡ Quick Start Guide - Prisma Accelerate + GitHub Actions

## 🎯 TL;DR

Your setup uses **Prisma Accelerate** (no PostgreSQL credentials needed). Here's what you need to know:

## 📝 Database URLs by Environment

| Environment     | Database Type     | Example URL                                                         |
| --------------- | ----------------- | ------------------------------------------------------------------- |
| **CI Tests**    | Local PostgreSQL  | `postgresql://test_user:test_password@localhost:5432/test_db`       |
| **Development** | Prisma Accelerate | `prisma+postgres://accelerate.prisma-data.net/?api_key=dev_xxx`     |
| **Staging**     | Prisma Accelerate | `prisma+postgres://accelerate.prisma-data.net/?api_key=staging_xxx` |
| **Production**  | Prisma Accelerate | `prisma+postgres://accelerate.prisma-data.net/?api_key=prod_xxx`    |

## 🚀 Setup in 3 Steps

### Step 1: Get Your Prisma Accelerate API Keys

```bash
1. Go to https://console.prisma.io/
2. Select your project → Accelerate
3. Create 3 API keys:
   - "Development"
   - "Staging"
   - "Production"
4. Copy the full URLs (include api_key parameter)
```

### Step 2: Configure GitHub Secrets

```bash
# Go to: GitHub Repo → Settings → Secrets → Actions → New repository secret

Name: STAGING_DATABASE_URL
Value: prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_STAGING_KEY

Name: PRODUCTION_DATABASE_URL
Value: prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRODUCTION_KEY
```

### Step 3: Update Local `.env`

```bash
# Copy the example
cp .env.example .env

# Edit .env and add your development key
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_DEV_KEY"
```

## ✅ That's It!

Your GitHub Actions will now:

- ✅ Use **local PostgreSQL** for tests (free, fast, no quota usage)
- ✅ Use **Prisma Accelerate** for staging deployments
- ✅ Use **Prisma Accelerate** for production deployments

## 🔍 How It Works

### CI Pipeline (Tests)

```yaml
# Spins up temporary PostgreSQL container
DATABASE_URL: postgresql://test_user:test_password@localhost:5432/test_db
```

**Why?** Saves your Accelerate quota and runs faster!

### Deployment (Staging/Production)

```yaml
# Uses your Prisma Accelerate API key from GitHub Secrets
DATABASE_URL: ${{ secrets.STAGING_DATABASE_URL }}
DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
```

**Why?** Global caching, connection pooling, optimized performance!

## 📊 Key Differences from Traditional PostgreSQL

| Feature                | Traditional                           | Prisma Accelerate                                           |
| ---------------------- | ------------------------------------- | ----------------------------------------------------------- |
| **Connection String**  | `postgresql://user:pass@host:5432/db` | `prisma+postgres://accelerate.prisma-data.net/?api_key=xxx` |
| **Credentials**        | Username + Password                   | API Key only                                                |
| **Connection Pooling** | Manual setup                          | Built-in                                                    |
| **Caching**            | Manual setup                          | Built-in                                                    |
| **Global Edge**        | Single region                         | Multi-region                                                |

## 🎬 Next Steps

1. **Test locally**: `npm run dev`
2. **Run tests**: `npm test`
3. **Push to GitHub**: Let CI/CD handle the rest!
4. **Deploy to production**: Create a git tag `v1.0.0`

## 📚 Full Documentation

- **Prisma Accelerate**: [PRISMA_ACCELERATE.md](./PRISMA_ACCELERATE.md)
- **GitHub Actions**: [GITHUB_ACTIONS_GUIDE.md](./GITHUB_ACTIONS_GUIDE.md)
- **Main README**: [README.md](./README.md)

## 🆘 Troubleshooting

**"Invalid API key"**
→ Check the key at https://console.prisma.io/

**"Rate limit exceeded"**
→ You've hit your Accelerate quota, check usage in console

**"CI tests failing"**
→ CI uses local PostgreSQL (not Accelerate), check test configuration

---

**You're all set! 🎉** Your backend now has production-grade CI/CD with Prisma Accelerate!
