# GitHub Actions CI/CD Guide

## 📋 Overview

Your backend now has a complete, production-grade GitHub Actions CI/CD setup with the following workflows:

### 1. **CI Workflow** (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**

- **Lint & Format Check** - Ensures code quality
  - ESLint validation
  - Prettier formatting check
- **Test** - Runs on Node 18, 20, and 22
  - PostgreSQL test database
  - Prisma migrations
  - Test execution with coverage
- **Security Audit** - Security scanning
  - npm audit for vulnerabilities
  - Trivy security scanner
  - Results uploaded to GitHub Security tab
- **Dependency Review** - PR-only check for new dependency risks
- **Build Check** - Verifies the application starts correctly
- **PR Validation** - PR-specific checks
  - Conventional Commits format validation
  - Merge conflict detection

### 2. **Deploy Workflow** (`.github/workflows/deploy.yml`)

Handles automated deployments to staging and production.

**Triggers:**

- **Staging**: Push to `main` branch
- **Production**: Git tags matching `v*.*.*` (e.g., v1.0.0)
- **Manual**: Workflow dispatch with environment selection

**Features:**

- Database migrations
- Health checks
- Slack notifications (requires setup)
- Automatic rollback on failure
- GitHub Release creation for production

### 3. **Scheduled Jobs** (`.github/workflows/cron-jobs.yml`)

Automated maintenance tasks.

**Schedules:**

- **Weekly** (Monday 9 AM UTC): Dependency updates check
- **Daily** (2 AM UTC): Security audit
- **Manual**: Workflow dispatch

Creates GitHub issues automatically for:

- Outdated dependencies
- Security vulnerabilities

### 4. **PR Labeler** (`.github/workflows/pr-labeler.yml`)

Automatically labels PRs based on:

- Files changed (database, routes, middleware, etc.)
- PR size (xs, s, m, l, xl)

## 🚀 Setup Instructions

### 1. Repository Settings

#### Enable GitHub Actions

1. Go to **Settings → Actions → General**
2. Set **Workflow permissions** to "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

#### Branch Protection Rules

Set up branch protection for `main`:

```
Settings → Branches → Add branch protection rule
Branch name pattern: main

✅ Require a pull request before merging
✅ Require status checks to pass before merging
  Required checks:
    - Lint & Format Check
    - Test (Node 20)
    - Security Audit
    - Build Check
✅ Require branches to be up to date before merging
✅ Require conversation resolution before merging
✅ Do not allow bypassing the above settings
```

### 2. Repository Secrets

Add these secrets in **Settings → Secrets and variables → Actions**:

#### Required for Deployment (Prisma Accelerate)

```
STAGING_DATABASE_URL       # Prisma Accelerate URL for staging
                          # Format: prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_STAGING_API_KEY

PRODUCTION_DATABASE_URL    # Prisma Accelerate URL for production
                          # Format: prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRODUCTION_API_KEY
```

**How to get Prisma Accelerate API Keys:**

1. Go to [Prisma Console](https://console.prisma.io/)
2. Select your project
3. Navigate to **Accelerate** section
4. Create separate API keys for staging and production
5. Copy the full connection URL including the API key

#### Optional (for notifications)

```
SLACK_WEBHOOK             # Slack webhook URL for deployment notifications
CODECOV_TOKEN             # Codecov.io token for coverage reports
```

### 3. Environment Setup

Create GitHub Environments for deployment:

1. **Staging Environment**

   ```
   Settings → Environments → New environment
   Name: staging
   URL: https://staging-api.yourdomain.com
   ```

2. **Production Environment**

   ```
   Settings → Environments → New environment
   Name: production
   URL: https://api.yourdomain.com

   ✅ Required reviewers (add team members)
   ✅ Wait timer: 5 minutes (optional)
   ```

### 4. Dependabot Configuration

Dependabot is already configured (`.github/dependabot.yml`). Update:

```yaml
reviewers:
  - 'your-team-name' # Change to your team
assignees:
  - 'your-username' # Change to your username
```

### 5. Customize Deployment

Edit `.github/workflows/deploy.yml` and update the deployment commands:

```yaml
# Example for Railway
- name: Deploy to staging
  run: railway up

# Example for Render
- name: Deploy to staging
  run: render deploy

# Example for Fly.io
- name: Deploy to staging
  run: flyctl deploy
```

## 🔧 Configuration Files

| File                               | Purpose                         |
| ---------------------------------- | ------------------------------- |
| `.github/workflows/ci.yml`         | Continuous Integration pipeline |
| `.github/workflows/deploy.yml`     | Deployment automation           |
| `.github/workflows/cron-jobs.yml`  | Scheduled maintenance tasks     |
| `.github/workflows/pr-labeler.yml` | Automatic PR labeling           |
| `.github/dependabot.yml`           | Automated dependency updates    |
| `.github/labeler.yml`              | PR labeling rules               |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR template                     |
| `jest.config.js`                   | Testing configuration           |
| `.editorconfig`                    | Code editor configuration       |
| `.nvmrc`                           | Node.js version specification   |
| `.npmrc`                           | npm configuration               |

## 📝 Usage

### Running Tests Locally

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Code Quality Checks

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Format code
npm run format
```

### Creating a Release

For production deployment:

```bash
# Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

This triggers:

1. Production deployment workflow
2. Database migrations
3. Health checks
4. GitHub Release creation
5. Slack notifications (if configured)

### Manual Deployment

Trigger manual deployments via GitHub UI:

1. Go to **Actions → Deploy**
2. Click **Run workflow**
3. Select environment (staging/production)
4. Click **Run workflow**

## 🔒 Security Features

### Automated Security Scanning

- **npm audit**: Checks for known vulnerabilities
- **Trivy**: Scans for security issues in dependencies
- **Dependency Review**: Prevents risky dependencies in PRs
- **Daily audits**: Automated security checks

### Security Best Practices

- Secrets stored in GitHub Secrets (never in code)
- Branch protection prevents unauthorized changes
- Required status checks before merging
- Environment protection for production

## 📊 Monitoring

### GitHub Actions Dashboard

View workflow runs: **Actions** tab in your repository

### Code Coverage

- Coverage reports generated in CI
- Upload to Codecov.io (requires token)
- View in PR checks

### Security Alerts

- GitHub Security tab for vulnerabilities
- Automated issues for security findings
- Dependabot alerts for dependency risks

## 🐛 Troubleshooting

### Tests Failing in CI but Passing Locally

- Check Node.js version matches (use `.nvmrc`)
- Ensure DATABASE_URL is set correctly
- Verify all dependencies are installed
- **Note**: CI uses local PostgreSQL for tests, not Prisma Accelerate

### Deployment Failing

- Check secrets are configured correctly
- Verify Prisma Accelerate API keys are valid and not expired
- Ensure API keys have correct permissions for migrations
- Check if you've reached Prisma Accelerate rate limits
- Verify database migrations run successfully
- Review health check endpoints
- Check deployment platform logs

### Prisma Accelerate Issues

- **Rate Limits**: Staging/Production use Prisma Accelerate; ensure you're within limits
- **API Key Rotation**: Update GitHub secrets when rotating keys
- **Connection Issues**: Verify the API key format is correct
- **Migrations**: Ensure your Accelerate plan supports schema migrations

### PR Checks Not Running

- Ensure GitHub Actions are enabled
- Check workflow file syntax
- Verify branch name matches trigger patterns

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Jest Documentation](https://jestjs.io/)
- [Prisma Accelerate Setup Guide](./PRISMA_ACCELERATE.md) ⭐
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Prisma Console](https://console.prisma.io/)

## ✅ Checklist

Before pushing to production:

- [ ] All secrets configured in GitHub
- [ ] Branch protection rules enabled
- [ ] Environments created (staging/production)
- [ ] Deployment commands customized
- [ ] Health check endpoints working
- [ ] Database backup strategy in place
- [ ] Team members added as reviewers
- [ ] Slack/notification webhooks configured
- [ ] `.nvmrc` Node version matches production
- [ ] All tests passing locally and in CI

## 🎯 Next Steps

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "feat: add production-grade CI/CD pipeline"
   git push origin main
   ```

2. **Watch the CI pipeline run** in the Actions tab

3. **Create your first PR** to test the workflow

4. **Configure deployment** for your hosting platform

5. **Set up monitoring** and alerting for production

---

**Your backend is now production-ready with enterprise-grade CI/CD! 🚀**
