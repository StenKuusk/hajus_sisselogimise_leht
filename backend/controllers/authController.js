const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registreerimise funktsioon
exports.register = (req, res) => {
  const { username, password } = req.body;

  // Kontrolli, et parool on olemas
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Kontrolli, kas kasutajanimi on juba olemas
  const checkSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkSql, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error checking username' });
    }

    if (results.length > 0) {
      console.log('Kasutajanimi juba eksisteerib:', username);
      return res.status(409).json({ message: 'Username already exists' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

// Sisselogimise funktsioon
exports.login = (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  });
};