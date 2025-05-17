CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  age INT,
  dob DATE,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('customer', 'banker') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  balance DECIMAL(10, 2) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transactions (
  id VARCHAR(36) PRIMARY KEY,
  account_id VARCHAR(36),
  type ENUM('deposit', 'withdraw') NOT NULL,
  amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- select * from users;
-- select * from accounts;
-- select * from transactions;



INSERT INTO users (id, first_name, last_name, age, dob, email, password, role)
VALUES (
  UUID(),
  'Admin',
  'User',
  30,
  '1995-01-01',
  'admin@example.com',
  'admin123',
  'banker'
);
