// Test setup file
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = 3002;
process.env.LOG_LEVEL = 'error';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://test_user:test_password@localhost:5432/test_db';

// Clean up after all tests
// Add cleanup logic here if needed
