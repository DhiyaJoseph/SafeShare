# SafeShare - Secure File Sharing Platform

A production-ready secure file sharing platform with enterprise-grade encryption, role-based access control, and advanced threat detection. Built for teams that prioritize security.

## 🔒 Security Features

### Core Security
- **AES-256 Encryption**: All files encrypted before storage
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, Manager, and User roles
- **Password Security**: bcrypt hashing with strength validation
- **Rate Limiting**: Brute-force protection
- **Security Headers**: Helmet.js protection

### Threat Detection
- **File Scanning**: Suspicious extension detection
- **Size Validation**: Prevents oversized file attacks
- **Content Analysis**: Embedded executable detection
- **Quarantine System**: Isolates detected threats
- **Real-time Alerts**: Immediate threat notifications

### Audit & Compliance
- **Complete Audit Trail**: All actions logged
- **Risk Level Assessment**: Low, medium, high risk categorization
- **User Activity Monitoring**: Login attempts, file access
- **Geolocation Tracking**: IP-based location detection
- **Export Capabilities**: CSV audit log exports

## 🚀 Features

### For Users
- **Secure File Upload**: Drag-and-drop with encryption
- **File Management**: Organize, share, and download files
- **Preview Support**: Common file type previews
- **Share Controls**: Secure file sharing with permissions
- **Activity Dashboard**: Personal usage statistics

### For Managers
- **User Oversight**: Monitor team file activity
- **Access Management**: Control file permissions
- **Security Reports**: Team security insights
- **Bulk Operations**: Manage multiple files/users

### For Administrators
- **Full System Control**: Complete platform management
- **User Management**: Create, edit, deactivate users
- **Security Configuration**: Password policies, encryption settings
- **Audit Logs**: Comprehensive system monitoring
- **Threat Management**: Security incident response

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **JWT** for authentication
- **bcrypt** for password hashing
- **crypto-js** for AES encryption
- **multer** for file uploads
- **helmet** for security headers
- **express-rate-limit** for DoS protection

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd safeshare
npm install
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Configure environment**
```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the application**

Backend (Terminal 1):
```bash
cd server
npm run dev
```

Frontend (Terminal 2):
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables
Copy `server/.env.example` to `server/.env` and configure:

```env
# Security Keys (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-very-long-and-random
ENCRYPTION_KEY=your-32-character-encryption-key

# Server Configuration  
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:5173

# Security Settings
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5
MAX_FILE_SIZE=104857600
```

### Security Recommendations

#### Production Deployment
1. **Generate Strong Keys**:
   - JWT_SECRET: 64+ random characters
   - ENCRYPTION_KEY: Exactly 32 characters for AES-256

2. **Database**: Replace in-memory storage with PostgreSQL/MySQL

3. **HTTPS**: Enable SSL/TLS certificates

4. **File Storage**: Use cloud storage (AWS S3, Azure Blob)

5. **Monitoring**: Implement log aggregation and alerting

## 👤 Default Accounts

For testing purposes, use these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@safeshare.com | admin123 |
| Manager | manager@safeshare.com | manager123 |
| User | user@safeshare.com | user123 |

## 🔐 Security Architecture

### File Encryption Flow
1. File uploaded via secure form
2. Threat detection analysis
3. AES-256 encryption applied
4. Encrypted file stored on server
5. Original file data destroyed
6. Metadata stored with encryption keys

### Authentication Flow  
1. User credentials validated
2. Password verified with bcrypt
3. JWT token generated with role claims
4. Token validates subsequent requests
5. Automatic token refresh handling



## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get current user

### File Management
- `POST /api/files/upload` - Upload encrypted file
- `GET /api/files` - List accessible files
- `GET /api/files/:id/download` - Download and decrypt file
- `DELETE /api/files/:id` - Delete file

### User Management (Admin/Manager)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Monitoring
- `GET /api/audit-logs` - Audit trail (Admin only)
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/security-alerts` - Security alerts

## 🚨 Threat Detection Rules

### File Analysis
- **Suspicious Extensions**: .exe, .bat, .cmd, .scr, .vbs, .js, .jar
- **Size Limits**: Files over 100MB flagged
- **Content Scanning**: Embedded executable detection
- **Magic Number Validation**: File type verification

### Risk Levels
- **Low**: Normal file operations
- **Medium**: Failed logins, large files, unauthorized access
- **High**: Malware detection, multiple failed attempts, suspicious patterns

## 🔍 Monitoring & Auditing

### Audit Events
- User authentication (success/failure)
- File operations (upload, download, delete)
- Permission changes
- Security configuration updates
- Threat detections
- User management actions

### Log Retention
- Default: 365 days
- Configurable retention periods
- Automatic log rotation
- Export capabilities for compliance

## 🛡 Compliance Features

### Data Protection
- **Encryption at Rest**: AES-256 file encryption
- **Encryption in Transit**: HTTPS/TLS
- **Access Logging**: Complete audit trail
- **Data Residency**: Configurable storage locations
- **Secure Deletion**: Cryptographic key destruction

### Standards Compliance
- **SOC 2 Ready**: Audit logging and access controls
- **ISO 27001**: Security management framework
- **GDPR**: Data protection and privacy rights
- **HIPAA**: Healthcare data protection (with proper deployment)

## 📈 Performance

### Scalability
- Stateless JWT authentication
- File streaming for large downloads
- Configurable rate limiting
- Database connection pooling ready

### Optimization
- Gzip compression
- Static asset caching
- Lazy loading components
- Efficient file chunking

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🚀 Production Deployment

### Quick Checklist
- [ ] Change default JWT_SECRET and ENCRYPTION_KEY
- [ ] Configure production database
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategies
- [ ] Review security settings
- [ ] Test disaster recovery procedures

### Cloud Deployment Options
- **AWS**: EC2, RDS, S3, CloudFront
- **Azure**: App Service, SQL Database, Blob Storage
- **Google Cloud**: Compute Engine, Cloud SQL, Cloud Storage
- **Docker**: Containerized deployment ready

---

**SafeShare** - Built with security in mind. 🔒