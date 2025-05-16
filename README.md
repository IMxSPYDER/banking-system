# SecureBank - Banking System

A modern, secure banking system built with React, TypeScript, and MySQL, featuring customer and banker portals with real-time transaction management.

## Features

### Customer Portal
- Account registration with initial deposit
- Secure authentication
- Real-time balance tracking
- Deposit and withdrawal functionality
- Detailed transaction history
- Age verification (18+ requirement)

### Banker Portal
- Secure banker authentication
- View all customer accounts
- Access detailed customer information
- Monitor customer transaction histories
- Real-time data updates

## Tech Stack

- **Frontend**
  - React JS
  - TypeScript
  - Tailwind CSS

- **Backend**
  - Node.js
  - Express.js
  - MySQL
  - JSON Web Tokens (JWT)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MySQL database:
   ```sql
   CREATE DATABASE securebank;
   USE securebank;

   -- Users table
   CREATE TABLE users (
     id CHAR(36) PRIMARY KEY,
     first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255) NOT NULL,
     age INT NOT NULL,
     dob DATE NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role ENUM('customer', 'banker') NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Accounts table
   CREATE TABLE accounts (
     id CHAR(36) PRIMARY KEY,
     user_id CHAR(36) NOT NULL,
     balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );

   -- Transactions table
   CREATE TABLE transactions (
     id CHAR(36) PRIMARY KEY,
     account_id CHAR(36) NOT NULL,
     type ENUM('deposit', 'withdraw') NOT NULL,
     amount DECIMAL(10, 2) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
   );
   ```

4. Configure environment variables:
   ```env
   # Create a .env file in the root directory
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=securebank
   JWT_SECRET=your_jwt_secret
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/register` - Register new customer
- `POST /api/login` - Login for customers and bankers

### Customer Routes
- `GET /api/customer/transactions` - Get user transactions
- `POST /api/customer/deposit` - Make a deposit
- `POST /api/customer/withdraw` - Make a withdrawal

### Banker Routes
- `GET /api/banker/customers` - Get all customers
- `GET /api/banker/customers/:id/transactions` - Get customer transactions

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Protected routes
- Transaction verification
- SQL injection prevention
- Rate limiting

![image](https://github.com/user-attachments/assets/ceedf9d1-e64d-4694-b91b-7b6f919772a0)

