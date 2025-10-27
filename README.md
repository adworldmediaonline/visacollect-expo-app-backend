# Backend API

Modern, production-grade backend API built with Express, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 14+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

## 📦 Scripts

```bash
# Development
npm run dev          # Start with hot-reload (watch mode)
npm start            # Start server

# Database
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations in development
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check formatting

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 🏗️ Project Structure

```
backend/
├── .github/              # GitHub Actions workflows
│   ├── workflows/
│   │   ├── ci.yml       # CI workflow
│   │   └── deploy.yml   # Deployment workflow
│   └── PULL_REQUEST_TEMPLATE.md
├── prisma/
│   ├── migrations/      # Database migrations
│   └── schema.prisma    # Database schema
├── src/
│   ├── config/          # Configuration files
│   │   ├── env.js
│   │   ├── logger.js
│   │   └── prisma.js
│   ├── controller/      # Request handlers
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   └── security.js
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── validations/     # Input validation schemas
│   ├── tests/           # Test files
│   ├── app.js           # Express app setup
│   ├── server.js        # Server entry point
│   └── index.js         # Application entry point
├── .editorconfig        # Editor configuration
├── .env.example         # Example environment variables
├── .gitignore
├── .nvmrc              # Node version
├── .npmrc              # npm configuration
├── eslint.config.js    # ESLint configuration
├── jest.config.js      # Jest configuration
├── package.json
├── PRISMA_ACCELERATE.md  # Prisma Accelerate setup
└── README.md
```

## 🔧 Environment Variables

See `.env.example` for all available environment variables.

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/staging/production)

### Optional Variables

- `CORS_ORIGIN` - Allowed CORS origin (default: \*)
- `LOG_LEVEL` - Logging level (default: info)

## 🗄️ Database

This project uses Prisma with **Prisma Accelerate** for connection pooling and global caching.

### Prisma Accelerate Setup

See [PRISMA_ACCELERATE.md](./PRISMA_ACCELERATE.md) for detailed setup instructions.

**Quick Start:**

1. Get your Accelerate API key from [console.prisma.io](https://console.prisma.io/)
2. Update `.env` with: `DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_KEY"`
3. Generate Prisma Client: `npm run db:generate`

### Migrations

```bash
# Create a new migration (development)
npx prisma migrate dev --name migration_name

# Apply migrations (production - done automatically in CI/CD)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Prisma Studio

```bash
npm run db:studio
```

Opens a visual database browser at `http://localhost:5555`

### Environment-Specific Database URLs

- **Development**: Direct PostgreSQL or Prisma Accelerate
- **CI/Tests**: Local PostgreSQL (not Accelerate to save quota)
- **Staging**: Prisma Accelerate with staging API key
- **Production**: Prisma Accelerate with production API key

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔒 Security

- **Helmet** - Secure HTTP headers
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - API rate limiting
- **Input Validation** - Request validation (when implemented)
- **Security Audits** - Automated npm audit in CI/CD

## 📝 API Documentation

### Base URL

```
Development: http://localhost:3001
Staging: https://staging-api.yourdomain.com
Production: https://api.yourdomain.com
```

### Endpoints

#### Health Check

```http
GET /
```

#### Todos (Example Resource)

```http
GET    /api/v1/todos      # Get all todos
GET    /api/v1/todos/:id  # Get todo by ID
POST   /api/v1/todos      # Create todo
PUT    /api/v1/todos/:id  # Update todo
DELETE /api/v1/todos/:id  # Delete todo
```

## 🤝 Contributing

1. Create a feature branch from `develop`
2. Make your changes following the coding standards
3. Write/update tests
4. Run linting and tests
5. Create a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test changes
- `chore:` Build/tooling changes

## 📄 License

[Your License Here]

## 🙋 Support

For issues and questions, please create an issue in the repository.
