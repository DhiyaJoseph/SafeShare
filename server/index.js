const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-super-secret-encryption-key-32-chars';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again later.'
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create necessary directories
const ensureDirectories = async () => {
  const dirs = ['uploads', 'encrypted', 'quarantine'];
  for (const dir of dirs) {
    try {
      await fs.mkdir(path.join(__dirname, dir), { recursive: true });
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
    }
  }
};

// Mock database (in production, use PostgreSQL/MySQL)
let users = [
  {
    id: '1',
    email: 'admin@safeshare.com',
    password: '$2a$10$X.BoGmWcZOJKrPGKt2XK.uFGbPhLlYcX8WZcGGnOPJq0YdFfVKZK2', // admin123
    name: 'System Administrator',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'manager@safeshare.com',
    password: '$2a$10$X.BoGmWcZOJKrPGKt2XK.uFGbPhLlYcX8WZcGGnOPJq0YdFfVKZK2', // manager123
    name: 'Team Manager',
    role: 'manager',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '3',
    email: 'user@safeshare.com',
    password: '$2a$10$X.BoGmWcZOJKrPGKt2XK.uFGbPhLlYcX8WZcGGnOPJq0YdFfVKZK2', // user123
    name: 'Standard User',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

let files = [];
let auditLogs = [];
let securityAlerts = [];

// Utility functions
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const encryptFile = (buffer) => {
  const encrypted = crypto.AES.encrypt(buffer.toString('base64'), ENCRYPTION_KEY).toString();
  return encrypted;
};

const decryptFile = (encryptedData) => {
  const decrypted = crypto.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return Buffer.from(decrypted.toString(crypto.enc.Utf8), 'base64');
};

const addAuditLog = (userId, userName, action, resource, req, success = true, details = '', riskLevel = 'low') => {
  const log = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    userId,
    userName,
    action,
    resource,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent') || 'Unknown',
    success,
    details,
    riskLevel,
    location: 'Unknown' // In production, use IP geolocation service
  };
  auditLogs.push(log);
  
  // Keep only last 1000 logs in memory
  if (auditLogs.length > 1000) {
    auditLogs = auditLogs.slice(-1000);
  }
  
  console.log('Audit Log:', log);
};

const detectThreat = (filename, buffer) => {
  const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar'];
  const extension = path.extname(filename).toLowerCase();
  
  // Check for suspicious extensions
  if (suspiciousExtensions.includes(extension)) {
    return {
      threat: true,
      reason: 'Suspicious file extension detected',
      riskLevel: 'high'
    };
  }
  
  // Check file size (over 100MB is suspicious for most documents)
  if (buffer.length > 100 * 1024 * 1024) {
    return {
      threat: true,
      reason: 'File size exceeds safe limits',
      riskLevel: 'medium'
    };
  }
  
  // Check for embedded executables in file content
  const content = buffer.toString('hex').toLowerCase();
  if (content.includes('4d5a') || content.includes('504b0304')) { // MZ header or ZIP header
    if (extension !== '.zip' && extension !== '.docx' && extension !== '.xlsx') {
      return {
        threat: true,
        reason: 'Potential embedded executable detected',
        riskLevel: 'high'
      };
    }
  }
  
  return { threat: false, reason: 'File appears safe', riskLevel: 'low' };
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      addAuditLog(
        req.user.id, 
        req.user.email, 
        'UNAUTHORIZED_ACCESS_ATTEMPT', 
        req.originalUrl, 
        req, 
        false, 
        `User with role ${req.user.role} attempted to access resource requiring roles: ${roles.join(', ')}`,
        'medium'
      );
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Basic file validation
    if (!file.originalname || file.originalname.length > 255) {
      return cb(new Error('Invalid filename'));
    }
    cb(null, true);
  }
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication routes
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      addAuditLog('unknown', email, 'REGISTRATION_ATTEMPT', 'User Registration', req, false, 'Email already exists', 'low');
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role: ['admin', 'manager', 'user'].includes(role) ? role : 'user',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    addAuditLog(newUser.id, newUser.name, 'USER_REGISTERED', 'User Registration', req, true, 'New user account created', 'low');

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      addAuditLog('unknown', email, 'LOGIN_ATTEMPT', 'Authentication System', req, false, 'User not found', 'medium');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      addAuditLog(user.id, user.name, 'LOGIN_ATTEMPT', 'Authentication System', req, false, 'Account is deactivated', 'medium');
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      addAuditLog(user.id, user.name, 'LOGIN_ATTEMPT', 'Authentication System', req, false, 'Invalid password', 'medium');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    addAuditLog(user.id, user.name, 'LOGIN_SUCCESS', 'Authentication System', req, true, 'User logged in successfully', 'low');

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password: _, ...userResponse } = user;
  res.json(userResponse);
});

// File routes
app.post('/api/files/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, mimetype, size } = req.file;
    
    // Threat detection
    const threatAnalysis = detectThreat(originalname, buffer);
    
    if (threatAnalysis.threat) {
      // Quarantine the file
      const quarantineId = uuidv4();
      await fs.writeFile(
        path.join(__dirname, 'quarantine', `${quarantineId}_${originalname}`),
        buffer
      );
      
      addAuditLog(
        req.user.id, 
        req.user.email, 
        'THREAT_DETECTED', 
        originalname, 
        req, 
        false, 
        threatAnalysis.reason, 
        threatAnalysis.riskLevel
      );
      
      return res.status(400).json({ 
        message: 'File blocked due to security concerns',
        reason: threatAnalysis.reason 
      });
    }

    // Encrypt file
    const encryptedData = encryptFile(buffer);
    
    // Save encrypted file
    const fileId = uuidv4();
    const encryptedFilename = `${fileId}.enc`;
    await fs.writeFile(
      path.join(__dirname, 'encrypted', encryptedFilename),
      encryptedData
    );

    // Create file record
    const fileRecord = {
      id: fileId,
      name: originalname,
      type: mimetype,
      size,
      uploadedBy: req.user.id,
      uploaderName: req.user.email,
      uploadDate: new Date().toISOString(),
      isEncrypted: true,
      threatStatus: 'safe',
      shared: false,
      downloads: 0,
      encryptedPath: encryptedFilename
    };

    files.push(fileRecord);

    addAuditLog(
      req.user.id, 
      req.user.email, 
      'FILE_UPLOAD', 
      originalname, 
      req, 
      true, 
      'File uploaded and encrypted successfully', 
      'low'
    );

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileRecord
    });
  } catch (error) {
    console.error('File upload error:', error);
    addAuditLog(
      req.user.id, 
      req.user.email, 
      'FILE_UPLOAD', 
      req.file?.originalname || 'unknown', 
      req, 
      false, 
      `Upload failed: ${error.message}`, 
      'medium'
    );
    res.status(500).json({ message: 'File upload failed' });
  }
});

app.get('/api/files', authenticateToken, (req, res) => {
  // Users can see all files, but admins/managers get additional metadata
  let userFiles = files.map(file => {
    const baseFile = {
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: file.uploadDate,
      isEncrypted: file.isEncrypted,
      threatStatus: file.threatStatus,
      shared: file.shared,
      downloads: file.downloads
    };

    // Include uploader info for managers and admins
    if (['admin', 'manager'].includes(req.user.role)) {
      baseFile.uploadedBy = file.uploaderName;
    } else {
      // Regular users only see their own files or shared files
      if (file.uploadedBy !== req.user.id && !file.shared) {
        return null;
      }
      baseFile.uploadedBy = file.uploadedBy === req.user.id ? 'You' : 'Shared with you';
    }

    return baseFile;
  }).filter(Boolean);

  res.json(userFiles);
});

app.get('/api/files/:id/download', authenticateToken, async (req, res) => {
  try {
    const file = files.find(f => f.id === req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check permissions
    if (req.user.role === 'user' && file.uploadedBy !== req.user.id && !file.shared) {
      addAuditLog(
        req.user.id, 
        req.user.email, 
        'UNAUTHORIZED_FILE_ACCESS', 
        file.name, 
        req, 
        false, 
        'Attempted to download file without permission', 
        'medium'
      );
      return res.status(403).json({ message: 'Insufficient permissions to download this file' });
    }

    // Read and decrypt file
    const encryptedData = await fs.readFile(
      path.join(__dirname, 'encrypted', file.encryptedPath)
    );
    const decryptedBuffer = decryptFile(encryptedData);

    // Update download count
    file.downloads += 1;

    addAuditLog(
      req.user.id, 
      req.user.email, 
      'FILE_DOWNLOAD', 
      file.name, 
      req, 
      true, 
      'File downloaded and decrypted successfully', 
      'low'
    );

    res.set({
      'Content-Type': file.type,
      'Content-Disposition': `attachment; filename="${file.name}"`,
      'Content-Length': decryptedBuffer.length
    });

    res.send(decryptedBuffer);
  } catch (error) {
    console.error('File download error:', error);
    addAuditLog(
      req.user.id, 
      req.user.email, 
      'FILE_DOWNLOAD', 
      req.params.id, 
      req, 
      false, 
      `Download failed: ${error.message}`, 
      'medium'
    );
    res.status(500).json({ message: 'File download failed' });
  }
});

app.delete('/api/files/:id', authenticateToken, async (req, res) => {
  try {
    const fileIndex = files.findIndex(f => f.id === req.params.id);
    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[fileIndex];

    // Check permissions
    if (req.user.role === 'user' && file.uploadedBy !== req.user.id) {
      addAuditLog(
        req.user.id, 
        req.user.email, 
        'UNAUTHORIZED_FILE_DELETE', 
        file.name, 
        req, 
        false, 
        'Attempted to delete file without permission', 
        'medium'
      );
      return res.status(403).json({ message: 'Insufficient permissions to delete this file' });
    }

    // Delete encrypted file
    try {
      await fs.unlink(path.join(__dirname, 'encrypted', file.encryptedPath));
    } catch (error) {
      console.error('Error deleting encrypted file:', error);
    }

    // Remove from database
    files.splice(fileIndex, 1);

    addAuditLog(
      req.user.id, 
      req.user.email, 
      'FILE_DELETE', 
      file.name, 
      req, 
      true, 
      'File deleted successfully', 
      'low'
    );

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ message: 'File deletion failed' });
  }
});

// User management routes
app.get('/api/users', authenticateToken, authorizeRoles('admin', 'manager'), (req, res) => {
  const safeUsers = users.map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
  
  addAuditLog(
    req.user.id, 
    req.user.email, 
    'USER_LIST_ACCESS', 
    'User Management', 
    req, 
    true, 
    'Accessed user list', 
    'low'
  );
  
  res.json(safeUsers);
});

app.post('/api/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role: ['admin', 'manager', 'user'].includes(role) ? role : 'user',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.push(newUser);

    const { password: _, ...userResponse } = newUser;

    addAuditLog(
      req.user.id, 
      req.user.email, 
      'USER_CREATED', 
      email, 
      req, 
      true, 
      `New user created with role: ${newUser.role}`, 
      'low'
    );

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ message: 'User creation failed' });
  }
});

app.put('/api/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[userIndex];
    
    // Update user properties
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && ['admin', 'manager', 'user'].includes(role)) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    const { password: _, ...userResponse } = user;

    addAuditLog(
      req.user.id, 
      req.user.email, 
      'USER_UPDATED', 
      user.email, 
      req, 
      true, 
      'User information updated', 
      'low'
    );

    res.json({
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ message: 'User update failed' });
  }
});

app.delete('/api/users/:id', authenticateToken, authorizeRoles('admin'), (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.params.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[userIndex];
    
    // Prevent deleting yourself
    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    users.splice(userIndex, 1);

    addAuditLog(
      req.user.id, 
      req.user.email, 
      'USER_DELETED', 
      user.email, 
      req, 
      true, 
      'User account deleted', 
      'medium'
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ message: 'User deletion failed' });
  }
});

// Audit logs route
app.get('/api/audit-logs', authenticateToken, authorizeRoles('admin'), (req, res) => {
  addAuditLog(
    req.user.id, 
    req.user.email, 
    'AUDIT_LOG_ACCESS', 
    'Audit System', 
    req, 
    true, 
    'Accessed audit logs', 
    'low'
  );
  
  res.json(auditLogs);
});

// Security alerts route
app.get('/api/security-alerts', authenticateToken, (req, res) => {
  res.json(securityAlerts);
});

// Dashboard stats route
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {
    totalFiles: files.length,
    totalUsers: users.length,
    securityAlerts: auditLogs.filter(log => log.riskLevel === 'high').length,
    storageUsed: Math.round((files.reduce((total, file) => total + file.size, 0) / (1024 * 1024 * 1024)) * 100) / 100, // GB
    recentActivity: auditLogs.slice(-10).reverse(),
    threatDetections: auditLogs.filter(log => log.action === 'THREAT_DETECTED').length
  };

  res.json(stats);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large' });
    }
  }
  
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize server
const startServer = async () => {
  try {
    await ensureDirectories();
    
    app.listen(PORT, () => {
      console.log(`SafeShare server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('Security features enabled:');
      console.log('- Rate limiting');
      console.log('- File encryption (AES-256)');
      console.log('- Threat detection');
      console.log('- Audit logging');
      console.log('- Role-based access control');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;