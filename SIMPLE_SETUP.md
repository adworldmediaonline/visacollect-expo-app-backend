# SIMPLE GitHub Actions Setup

## ✅ What You Have Now

**Super basic CI/CD - just the essentials!**

### How It Works:

1. **Push to main** → **Automatic deployment**
2. **Create PR** → **Runs tests and linting**
3. **Weekly** → **Checks for outdated dependencies**

### Your GitHub Secret:

```
DATABASE_URL
→ prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_KEY
```

### Deploy:

```bash
# Just push to main
git push origin main
```

## 📁 Your Workflows:

1. **`ci.yml`** - Tests, linting, build check
2. **`deploy.yml`** - Deploy on push to main
3. **`cron-jobs.yml`** - Weekly dependency check
4. **`pr-labeler.yml`** - Auto-label PRs

**Simple, clean, no complexity!** 🎉
