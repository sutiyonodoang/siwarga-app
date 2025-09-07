# Installation Guide - SIWarga v1.0.0

This comprehensive installation guide will help you set up SIWarga on various environments, from development to production deployment.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Docker Installation](#docker-installation)
- [Database Configuration](#database-configuration)
- [Security Configuration](#security-configuration)
- [Troubleshooting](#troubleshooting)

## 🖥️ System Requirements

### Minimum Requirements
```
💻 Hardware:
- CPU: 1 core, 1GHz+
- RAM: 512MB available
- Storage: 500MB free space
- Network: Internet connection for initial setup

🛠️ Software:
- PHP: 8.2 or higher
- Node.js: 18.0 or higher
- NPM: 9.0 or higher
- Git: 2.25 or higher
```

### Recommended Requirements
```
💻 Hardware:
- CPU: 2+ cores, 2GHz+
- RAM: 2GB+ available
- Storage: 2GB+ free space
- SSD storage for better performance

🛠️ Software:
- PHP: 8.3+ (latest stable)
- Node.js: 20.0+ (LTS version)
- NPM: 10.0+
- Composer: 2.6+
```

### PHP Extensions Required
```php
Required Extensions:
✅ PDO SQLite
✅ OpenSSL
✅ Mbstring
✅ Tokenizer
✅ XML
✅ Ctype
✅ JSON
✅ BCMath
✅ Fileinfo
✅ GD or Imagick (for image processing)
```

### Check PHP Configuration
```bash
# Check PHP version
php --version

# Check installed extensions
php -m

# Check specific extension
php -m | grep sqlite
php -m | grep openssl
```

## ⚡ Quick Installation

### Option 1: Automated Setup (Recommended)
```bash
# 1. Clone repository
git clone https://github.com/your-repo/siwarga-app.git
cd siwarga-app

# 2. Run automated setup script
chmod +x install.sh
./install.sh

# 3. Start development server
php artisan serve
```

### Option 2: Manual Setup
```bash
# 1. Clone and navigate
git clone https://github.com/your-repo/siwarga-app.git
cd siwarga-app

# 2. Install PHP dependencies
composer install

# 3. Install Node.js dependencies
npm install

# 4. Environment setup
cp .env.example .env
php artisan key:generate

# 5. Database setup
php artisan migrate --seed

# 6. Build assets
npm run build

# 7. Start server
php artisan serve
```

## 🛠️ Development Setup

### Step 1: Environment Configuration
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 2: Environment Variables
Edit `.env` file with your configuration:

```env
# Application
APP_NAME=SIWarga
APP_ENV=local
APP_KEY=base64:your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=sqlite
DB_DATABASE=database/siwarga_secure.sqlite
DB_FOREIGN_KEYS=true
DB_BUSY_TIMEOUT=30000
DB_JOURNAL_MODE=WAL
DB_SYNCHRONOUS=NORMAL

# Security Settings
SECURITY_RATE_LIMIT_ENABLED=true
SECURITY_MAX_QUERIES_PER_MINUTE=100
SECURITY_SUSPICIOUS_THRESHOLD=50

# Backup Settings
DB_BACKUP_ENABLED=true
DB_BACKUP_RETENTION_DAYS=30
DB_ENCRYPTION_ENABLED=false

# Session & Cache
SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database

# Mail (Optional)
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@siwarga.local"
MAIL_FROM_NAME="${APP_NAME}"
```

### Step 3: Database Setup
```bash
# Create database file with proper permissions
touch database/siwarga_secure.sqlite
chmod 664 database/siwarga_secure.sqlite
chmod 775 database/

# Run migrations with sample data
php artisan migrate --seed

# Verify migration status
php artisan migrate:status
```

### Step 4: Asset Building
```bash
# Development build with hot reload
npm run dev

# Or production build
npm run build

# Watch for changes (development)
npm run dev -- --watch
```

### Step 5: Development Server
```bash
# Start Laravel development server
php artisan serve

# Custom port
php artisan serve --port=8080

# Custom host
php artisan serve --host=0.0.0.0
```

### Step 6: Initial User Setup
```bash
# Create admin user (interactive)
php artisan make:admin

# Or via tinker
php artisan tinker
>>> User::factory()->create(['email' => 'admin@siwarga.local', 'name' => 'Administrator']);
```

## 🚀 Production Deployment

### Option 1: Apache Setup

#### 1. Virtual Host Configuration
```apache
<VirtualHost *:80>
    ServerName siwarga.yourdomain.com
    DocumentRoot /var/www/siwarga-app/public
    
    <Directory /var/www/siwarga-app/public>
        AllowOverride All
        Options -Indexes +FollowSymLinks
        Require all granted
    </Directory>
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Error and access logs
    ErrorLog ${APACHE_LOG_DIR}/siwarga_error.log
    CustomLog ${APACHE_LOG_DIR}/siwarga_access.log combined
    LogLevel warn
</VirtualHost>
```

#### 2. SSL Configuration (HTTPS)
```apache
<VirtualHost *:443>
    ServerName siwarga.yourdomain.com
    DocumentRoot /var/www/siwarga-app/public
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    SSLCertificateChainFile /path/to/ca-bundle.crt
    
    # Modern SSL configuration
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder off
    SSLSessionTickets off
    
    # HSTS (HTTP Strict Transport Security)
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    
    <Directory /var/www/siwarga-app/public>
        AllowOverride All
        Options -Indexes +FollowSymLinks
        Require all granted
    </Directory>
</VirtualHost>
```

### Option 2: Nginx Setup

#### 1. Server Block Configuration
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name siwarga.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name siwarga.yourdomain.com;
    root /var/www/siwarga-app/public;
    
    index index.php index.html index.htm;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Laravel specific
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }
    
    error_page 404 /index.php;
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
    
    # Asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Production Environment Configuration
```env
# Production Environment
APP_ENV=production
APP_DEBUG=false
APP_URL=https://siwarga.yourdomain.com

# Database (Production)
DB_CONNECTION=sqlite
DB_DATABASE=/secure/path/siwarga_secure.sqlite

# Security (Production)
SECURITY_RATE_LIMIT_ENABLED=true
SECURITY_MAX_QUERIES_PER_MINUTE=50
SECURITY_MAX_ADMIN_QUERIES_PER_MINUTE=200
SECURITY_SUSPICIOUS_THRESHOLD=25
SECURITY_LOG_SUSPICIOUS_ACTIVITY=true

# Backup (Production)
DB_BACKUP_ENABLED=true
DB_BACKUP_RETENTION_DAYS=30
DB_ENCRYPTION_ENABLED=true

# Cache (Production)
CACHE_STORE=database
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=strict

# Mail (Production)
MAIL_MAILER=smtp
MAIL_HOST=smtp.yourdomain.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
MAIL_USERNAME=noreply@yourdomain.com
MAIL_PASSWORD=your-email-password
```

### Production Deployment Steps
```bash
# 1. Upload files to server
rsync -avz --exclude node_modules --exclude .git siwarga-app/ user@server:/var/www/siwarga-app/

# 2. Set permissions
sudo chown -R www-data:www-data /var/www/siwarga-app
sudo chmod -R 755 /var/www/siwarga-app
sudo chmod -R 775 /var/www/siwarga-app/storage
sudo chmod -R 775 /var/www/siwarga-app/bootstrap/cache
sudo chmod -R 775 /var/www/siwarga-app/database

# 3. Install dependencies
cd /var/www/siwarga-app
composer install --optimize-autoloader --no-dev
npm ci --only=production

# 4. Environment setup
cp .env.example .env
# Edit .env with production values
php artisan key:generate

# 5. Database setup
php artisan migrate --force
php artisan db:seed --force

# 6. Build assets
npm run build

# 7. Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# 8. Set up cron job for scheduled tasks
echo "* * * * * cd /var/www/siwarga-app && php artisan schedule:run >> /dev/null 2>&1" | sudo crontab -
```

## 🐳 Docker Installation

### Docker Compose Setup
Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: siwarga-app
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./:/var/www
      - ./storage:/var/www/storage
      - ./database:/var/www/database
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    command: php artisan serve --host=0.0.0.0 --port=8000
    
  web:
    image: nginx:alpine
    container_name: siwarga-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/var/www
      - ./docker/nginx:/etc/nginx/conf.d
      - ./docker/ssl:/etc/ssl/certs
    depends_on:
      - app
```

### Dockerfile
```dockerfile
FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev \
    nodejs \
    npm

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_sqlite mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application code
COPY . /var/www

# Set permissions
RUN chown -R www-data:www-data /var/www
RUN chmod -R 775 /var/www/storage
RUN chmod -R 775 /var/www/bootstrap/cache

# Install dependencies
RUN composer install --optimize-autoloader --no-dev
RUN npm ci --only=production && npm run build

# Expose port
EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
```

### Docker Commands
```bash
# Build and start containers
docker-compose up -d --build

# Run migrations
docker-compose exec app php artisan migrate --seed

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down

# Update application
docker-compose exec app composer install
docker-compose exec app npm run build
docker-compose exec app php artisan optimize:clear
```

## 🗄️ Database Configuration

### SQLite Optimization
```env
# .env database configuration
DB_CONNECTION=sqlite
DB_DATABASE=database/siwarga_secure.sqlite
DB_FOREIGN_KEYS=true
DB_BUSY_TIMEOUT=30000
DB_JOURNAL_MODE=WAL
DB_SYNCHRONOUS=NORMAL
DB_TIMEOUT=30
```

### Database File Setup
```bash
# Create database with proper permissions
touch database/siwarga_secure.sqlite
chmod 664 database/siwarga_secure.sqlite
chmod 775 database/

# Create backup directory
mkdir -p database/backups
chmod 775 database/backups

# Set ownership (production)
sudo chown -R www-data:www-data database/
```

### Performance Tuning
```sql
-- SQLite optimization commands
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000;
PRAGMA temp_store = memory;
PRAGMA mmap_size = 268435456;
```

### Backup Configuration
```bash
# Manual backup
php artisan db:backup

# Encrypted backup
php artisan db:backup --encrypt

# Scheduled backup (crontab)
0 2 * * * cd /var/www/siwarga-app && php artisan db:backup --encrypt
```

## 🔒 Security Configuration

### File Permissions (Linux/macOS)
```bash
# Application permissions
find /var/www/siwarga-app -type f -exec chmod 644 {} \;
find /var/www/siwarga-app -type d -exec chmod 755 {} \;

# Writable directories
chmod 775 storage/
chmod 775 storage/logs/
chmod 775 storage/framework/
chmod 775 storage/framework/cache/
chmod 775 storage/framework/sessions/
chmod 775 storage/framework/views/
chmod 775 bootstrap/cache/
chmod 775 database/
chmod 775 database/backups/

# Protect sensitive files
chmod 600 .env
chmod 600 database/siwarga_secure.sqlite
```

### Web Server Security

#### Apache .htaccess (already included)
```apache
# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options SAMEORIGIN
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Deny access to sensitive files
<Files ".env">
    Order allow,deny
    Deny from all
</Files>

<Files "*.sqlite">
    Order allow,deny
    Deny from all
</Files>
```

#### Nginx Security
```nginx
# Hide server information
server_tokens off;

# Deny access to sensitive files
location ~ /\.(env|git|htaccess) {
    deny all;
}

location ~ \.sqlite$ {
    deny all;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### Environment Security
```env
# Strong application key
php artisan key:generate

# Secure session settings
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=strict
SESSION_LIFETIME=120

# Rate limiting
SECURITY_RATE_LIMIT_ENABLED=true
SECURITY_MAX_QUERIES_PER_MINUTE=50
SECURITY_SUSPICIOUS_THRESHOLD=25

# Database encryption
DB_ENCRYPTION_ENABLED=true
```

## 🚨 Troubleshooting

### Common Installation Issues

#### 1. Permission Denied Errors
```bash
# Problem: Permission denied for storage directories
# Solution:
sudo chown -R www-data:www-data storage/
sudo chmod -R 775 storage/
sudo chown -R www-data:www-data bootstrap/cache/
sudo chmod -R 775 bootstrap/cache/
```

#### 2. SQLite Database Issues
```bash
# Problem: Database file not found
# Solution:
touch database/siwarga_secure.sqlite
chmod 664 database/siwarga_secure.sqlite

# Problem: Database locked
# Solution:
php artisan config:clear
php artisan cache:clear
# Check for long-running processes
```

#### 3. PHP Extension Missing
```bash
# Check required extensions
php -m | grep -E "(sqlite|openssl|mbstring|tokenizer|xml|ctype|json)"

# Install missing extensions (Ubuntu/Debian)
sudo apt-get install php8.3-sqlite3 php8.3-mbstring php8.3-xml

# Install missing extensions (CentOS/RHEL)
sudo yum install php-pdo php-mbstring php-xml
```

#### 4. NPM Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
npm --version
```

#### 5. Memory Limit Issues
```bash
# Increase PHP memory limit
# In php.ini:
memory_limit = 512M

# Or via environment
export PHP_MEMORY_LIMIT=512M

# For Composer
COMPOSER_MEMORY_LIMIT=-1 composer install
```

### Debug Mode
```bash
# Enable debug mode
php artisan down --secret="debug-secret"

# Check logs
tail -f storage/logs/laravel.log

# Clear all caches
php artisan optimize:clear
```

### Performance Issues
```bash
# Enable query logging
php artisan db:monitor

# Profile application
php artisan telescope:install

# Optimize for production
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Support Resources
- **Documentation**: README.md, MANUAL.md
- **Developer**: sutiyonodoang@gmail.com
- **Community**: GitHub Issues
- **Logs**: storage/logs/laravel.log

---

## 🎉 Installation Complete!

After successful installation:

1. **Access your application**: http://localhost:8000 (development) or your domain (production)
2. **Login with default admin**: admin@siwarga.local / password
3. **Change default password** immediately
4. **Configure organization settings**
5. **Start adding your data**

**Welcome to SIWarga!** 🚀

For additional help, refer to the [MANUAL.md](MANUAL.md) for complete usage instructions.
