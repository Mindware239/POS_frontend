#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Mindware POS - Project Setup');
console.log('================================\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if required tools are installed
function checkRequirements() {
  logStep(1, 'Checking system requirements...');
  
  try {
    // Check Node.js version
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const nodeVersionNum = nodeVersion.replace('v', '');
    if (parseFloat(nodeVersionNum) < 18) {
      logError(`Node.js version ${nodeVersion} is too old. Please install Node.js 18 or higher.`);
      process.exit(1);
    }
    logSuccess(`Node.js ${nodeVersion} detected`);
    
    // Check npm
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    logSuccess(`npm ${npmVersion} detected`);
    
    // Check if PostgreSQL is running (optional check)
    try {
      execSync('pg_isready', { stdio: 'ignore' });
      logSuccess('PostgreSQL is running');
    } catch (error) {
      logWarning('PostgreSQL check failed - make sure PostgreSQL is installed and running');
    }
    
  } catch (error) {
    logError('Failed to check system requirements');
    logError(error.message);
    process.exit(1);
  }
}

// Install dependencies
function installDependencies() {
  logStep(2, 'Installing project dependencies...');
  
  try {
    logInfo('Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    logInfo('Installing frontend dependencies...');
    execSync('cd frontend && npm install', { stdio: 'inherit' });
    
    logInfo('Installing backend dependencies...');
    execSync('cd backend && npm install', { stdio: 'inherit' });
    
    logSuccess('All dependencies installed successfully');
    
  } catch (error) {
    logError('Failed to install dependencies');
    logError(error.message);
    process.exit(1);
  }
}

// Setup environment file
function setupEnvironment() {
  logStep(3, 'Setting up environment configuration...');
  
  try {
    const envExamplePath = path.join(__dirname, 'env.example');
    const envPath = path.join(__dirname, '.env');
    
    if (!fs.existsSync(envPath)) {
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        logSuccess('Environment file created from template');
        logWarning('Please edit .env file with your actual configuration values');
      } else {
        logWarning('env.example not found - please create .env file manually');
      }
    } else {
      logInfo('Environment file already exists');
    }
    
  } catch (error) {
    logError('Failed to setup environment file');
    logError(error.message);
  }
}

// Setup database
function setupDatabase() {
  logStep(4, 'Setting up database...');
  
  try {
    logInfo('Running database migrations...');
    execSync('cd backend && npm run db:migrate', { stdio: 'inherit' });
    
    logInfo('Seeding database with sample data...');
    execSync('cd backend && npm run db:seed', { stdio: 'inherit' });
    
    logSuccess('Database setup completed');
    
  } catch (error) {
    logError('Failed to setup database');
    logError(error.message);
    logWarning('You may need to manually setup the database');
  }
}

// Create necessary directories
function createDirectories() {
  logStep(5, 'Creating necessary directories...');
  
  try {
    const dirs = [
      'backend/uploads',
      'backend/logs',
      'backend/ai_models',
      'frontend/public/images'
    ];
    
    dirs.forEach(dir => {
      const fullPath = path.join(__dirname, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        logSuccess(`Created directory: ${dir}`);
      } else {
        logInfo(`Directory already exists: ${dir}`);
      }
    });
    
  } catch (error) {
    logError('Failed to create directories');
    logError(error.message);
  }
}

// Display next steps
function displayNextSteps() {
  logStep(6, 'Setup completed! Next steps:');
  
  console.log('\n📋 To get started:');
  console.log('   1. Edit .env file with your configuration');
  console.log('   2. Ensure PostgreSQL is running');
  console.log('   3. Run: npm run dev');
  
  console.log('\n🌐 The application will be available at:');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Backend API: http://localhost:5000');
  
  console.log('\n🔑 Default login credentials:');
  console.log('   Email: admin@mindware.com');
  console.log('   Password: password123');
  
  console.log('\n📚 Useful commands:');
  console.log('   npm run dev          - Start both frontend and backend');
  console.log('   npm run dev:frontend - Start only frontend');
  console.log('   npm run dev:backend  - Start only backend');
  console.log('   npm run db:migrate   - Run database migrations');
  console.log('   npm run db:seed      - Seed database with sample data');
  
  console.log('\n📖 Documentation:');
  console.log('   README.md - Project overview and setup instructions');
  console.log('   Backend API documentation available at /api/docs (when running)');
}

// Main setup function
async function main() {
  try {
    checkRequirements();
    installDependencies();
    setupEnvironment();
    createDirectories();
    setupDatabase();
    displayNextSteps();
    
    log('\n🎉 Mindware POS setup completed successfully!', 'green');
    
  } catch (error) {
    logError('Setup failed');
    logError(error.message);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
