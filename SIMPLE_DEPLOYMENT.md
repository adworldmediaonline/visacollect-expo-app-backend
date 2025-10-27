# 🚀 Simple GitHub Actions Setup

## ✅ What You Have Now

**Super simple deployment - just push to main!**

### How It Works:

1. **Push to main branch** → **Automatic production deployment**
2. **No manual tagging needed**
3. **No complex workflows**

### Your GitHub Secrets:

```
PRODUCTION_DATABASE_URL
→ prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_KEY
```

### Deploy to Production:

```bash
# That's it! Just push to main
git push origin main
```

**What happens automatically:**

- ✅ Runs tests
- ✅ Deploys to production
- ✅ Runs database migrations
- ✅ Health check
- ✅ Slack notification (if configured)

## 📁 Your Workflows:

1. **`ci.yml`** - Runs tests on every push/PR
2. **`deploy.yml`** - Deploys to production on push to main
3. **`cron-jobs.yml`** - Weekly dependency checks
4. **`pr-labeler.yml`** - Auto-labels PRs

**No complex brackets, no manual steps, just push and deploy!** 🎉
