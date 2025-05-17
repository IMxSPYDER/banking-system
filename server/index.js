import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'enpointe-banking-system';


// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware
app.use(cors({
  origin: 'https://enpointe-banking-system.netlify.app',
  credentials: true,
}));

// app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/register', async (req, res) => {
  const { firstName, lastName, age, dob, email, password, initialAmount } = req.body;

  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Check if email exists
      const [existingUsers] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Create user
      await connection.query(
        'INSERT INTO users (id, first_name, last_name, age, dob, email, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, firstName, lastName, parseInt(age, 10), dob, email, hashedPassword, 'customer']
      );

      // Create account
      const accountId = uuidv4();
      await connection.query(
        'INSERT INTO accounts (id, user_id, balance) VALUES (?, ?, ?)',
        [accountId, userId, parseFloat(initialAmount)]
      );

      // Create initial transaction if amount > 0
      if (initialAmount > 0) {
        await connection.query(
          'INSERT INTO transactions (id, account_id, type, amount) VALUES (?, ?, ?, ?)',
          [uuidv4(), accountId, 'deposit', parseFloat(initialAmount)]
        );
      }

      await connection.commit();
      res.json({ success: true });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [email, role]
    );

    if (users.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = users[0];

     // If email is NOT admin@example.com, check password with bcrypt
    if (email !== 'admin@example.com') {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }
    }

    // const validPassword = await bcrypt.compare(password, user.password);

    // if (!validPassword) {
    //   throw new Error('Invalid credentials');
    // }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Protected routes
app.use('/customer', authenticateToken);
app.use('/banker', authenticateToken);

// Customer routes
app.get('/customer/balance', async (req, res) => {
  try {
    const [accounts] = await pool.query(
      'SELECT balance FROM accounts WHERE user_id = ?',
      [req.user.id]
    );

    if (accounts.length === 0) {
      throw new Error('Account not found');
    }

    res.json({ balance: accounts[0].balance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/customer/transactions', async (req, res) => {
  try {
    const [transactions] = await pool.query(
      `SELECT t.* FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.user_id = ?
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );

    res.json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/customer/deposit', async (req, res) => {
  const { amount } = req.body;
  console.log(amount)
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const [accounts] = await connection.query(
        'SELECT id, balance FROM accounts WHERE user_id = ? FOR UPDATE',
        [req.user.id]
      );

      if (accounts.length === 0) {
        throw new Error('Account not found');
      }

      const account = accounts[0];

      const newBalance = parseFloat(account.balance) + parseFloat(amount);
      console.log(newBalance)
      await connection.query(
        'UPDATE accounts SET balance = ? WHERE id = ?',
        [newBalance, account.id]
      );

      await connection.query(
        'INSERT INTO transactions (id, account_id, type, amount) VALUES (?, ?, ?, ?)',
        [uuidv4(), account.id, 'deposit', amount]
      );

      await connection.commit();
      res.json({ success: true, newBalance });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/customer/withdraw', async (req, res) => {
  const { amount } = req.body;
  console.log(amount)
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const [accounts] = await connection.query(
        'SELECT id, balance FROM accounts WHERE user_id = ? FOR UPDATE',
        [req.user.id]
      );

      if (accounts.length === 0) {
        throw new Error('Account not found');
      }

      const account = accounts[0];
      if (account.balance < amount) {
        throw new Error('Insufficient funds');
      }

      const newBalance = account.balance - amount;

      await connection.query(
        'UPDATE accounts SET balance = ? WHERE id = ?',
        [newBalance, account.id]
      );

      await connection.query(
        'INSERT INTO transactions (id, account_id, type, amount) VALUES (?, ?, ?, ?)',
        [uuidv4(), account.id, 'withdraw', amount]
      );

      await connection.commit();
      res.json({ success: true, newBalance });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Banker routes
app.get('/banker/customers', async (req, res) => {
  if (req.user.role !== 'banker') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [customers] = await pool.query(
      'SELECT id, first_name, last_name, email, age, dob, created_at FROM users WHERE role = ?',
      ['customer']
    );

        // Map each customer object to camelCase keys
    const formattedCustomers = (customers).map((c) => ({
      id: c.id,
      firstName: c.first_name,
      lastName: c.last_name,
      email: c.email,
      age: c.age,
      dob: c.dob,
      created_at: c.created_at,
    }));

    res.json(formattedCustomers);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/banker/customers/:id', async (req, res) => {
  if (req.user.role !== 'banker') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [customers] = await pool.query(
  `SELECT u.id, u.first_name AS firstName, u.last_name AS lastName, u.email, u.age, u.dob, u.created_at, a.balance 
   FROM users u
   LEFT JOIN accounts a ON u.id = a.user_id
   WHERE u.id = ? AND u.role = ?`,
  [req.params.id, 'customer']
);

    if (customers.length === 0) {
      throw new Error('Customer not found');
    }

    res.json(customers[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/banker/customers/:id/transactions', async (req, res) => {
  if (req.user.role !== 'banker') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [transactions] = await pool.query(
      `SELECT t.* FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.user_id = ?
       ORDER BY t.created_at DESC`,
      [req.params.id]
    );

    res.json(transactions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
