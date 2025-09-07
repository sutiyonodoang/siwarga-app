# API Documentation - SIWarga v1.0.0

This document provides comprehensive API documentation for SIWarga application, including authentication, endpoints, request/response formats, and usage examples.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URLs & Headers](#base-urls--headers)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
- [Request/Response Examples](#requestresponse-examples)
- [SDK & Libraries](#sdk--libraries)
- [Changelog](#changelog)

## 🚀 Overview

SIWarga provides a RESTful API for managing citizen data, family cards, and regional information. The API follows REST principles and returns JSON responses.

### API Features
- **Authentication**: Session-based with CSRF protection
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: Configurable request limits
- **Validation**: Comprehensive input validation
- **Pagination**: Cursor and offset pagination
- **Filtering**: Advanced search and filtering
- **Encryption**: Data encryption for sensitive information

### API Version
- **Current Version**: v1.0.0
- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json`
- **Character Encoding**: UTF-8

## 🔐 Authentication

SIWarga uses session-based authentication with CSRF protection for web applications.

### Authentication Methods

#### 1. Web Session Authentication
```javascript
// Login request
POST /api/v1/auth/login
Content-Type: application/json
X-CSRF-TOKEN: your-csrf-token

{
  "email": "admin@siwarga.local",
  "password": "your-password"
}
```

#### 2. CSRF Token
All mutating requests require CSRF token:
```javascript
// Get CSRF token
GET /sanctum/csrf-cookie

// Include in subsequent requests
X-CSRF-TOKEN: your-csrf-token
```

### User Roles & Permissions
```json
{
  "roles": {
    "admin": {
      "name": "Administrator",
      "permissions": ["*"]
    },
    "operator": {
      "name": "Operator",
      "permissions": [
        "kartu-keluarga.view",
        "kartu-keluarga.create",
        "kartu-keluarga.edit",
        "anggota-keluarga.view",
        "anggota-keluarga.create",
        "anggota-keluarga.edit"
      ]
    },
    "viewer": {
      "name": "Viewer",
      "permissions": [
        "kartu-keluarga.view",
        "anggota-keluarga.view"
      ]
    }
  }
}
```

## 🌐 Base URLs & Headers

### Base URLs
```
Development: http://localhost:8000/api/v1
Production:  https://siwarga.yourdomain.com/api/v1
```

### Required Headers
```http
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: your-csrf-token
X-Requested-With: XMLHttpRequest
```

### Optional Headers
```http
Accept-Language: id-ID
User-Agent: YourApp/1.0
```

## ⚠️ Error Handling

### Error Response Format
```json
{
  "status": "error",
  "message": "Human readable error message",
  "code": "ERROR_CODE",
  "errors": {
    "field_name": ["Validation error message"]
  },
  "meta": {
    "timestamp": "2025-01-27T12:00:00Z",
    "request_id": "uuid-string"
  }
}
```

### HTTP Status Codes
```
200 OK - Request successful
201 Created - Resource created successfully
400 Bad Request - Invalid request data
401 Unauthorized - Authentication required
403 Forbidden - Access denied
404 Not Found - Resource not found
422 Unprocessable Entity - Validation errors
429 Too Many Requests - Rate limit exceeded
500 Internal Server Error - Server error
503 Service Unavailable - Maintenance mode
```

### Common Error Codes
```json
{
  "VALIDATION_ERROR": "Input validation failed",
  "UNAUTHORIZED": "Authentication required",
  "FORBIDDEN": "Access denied",
  "NOT_FOUND": "Resource not found",
  "RATE_LIMIT_EXCEEDED": "Too many requests",
  "DUPLICATE_ENTRY": "Resource already exists",
  "INVALID_CREDENTIALS": "Login failed",
  "TOKEN_EXPIRED": "Session expired"
}
```

## 🚦 Rate Limiting

### Default Limits
```json
{
  "rate_limits": {
    "guest": {
      "requests_per_minute": 30,
      "burst": 10
    },
    "authenticated": {
      "requests_per_minute": 100,
      "burst": 20
    },
    "admin": {
      "requests_per_minute": 200,
      "burst": 50
    }
  }
}
```

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643723400
```

### Rate Limit Exceeded Response
```json
{
  "status": "error",
  "message": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "meta": {
    "retry_after": 60,
    "limit": 100,
    "remaining": 0,
    "reset": 1643723400
  }
}
```

## 📡 API Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/login
Login user and create session.

**Request:**
```json
{
  "email": "admin@siwarga.local",
  "password": "password"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Administrator",
      "email": "admin@siwarga.local",
      "roles": ["admin"]
    },
    "permissions": ["*"]
  }
}
```

#### POST /api/v1/auth/logout
Logout user and destroy session.

**Response:**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

#### GET /api/v1/auth/user
Get current authenticated user.

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Administrator",
      "email": "admin@siwarga.local",
      "roles": ["admin"],
      "permissions": ["*"]
    }
  }
}
```

### Regional Data Endpoints

#### GET /api/v1/regions/provinces
Get list of provinces.

**Query Parameters:**
- `search` (string): Search by name
- `per_page` (integer): Items per page (1-100)
- `page` (integer): Page number

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "11",
      "name": "ACEH",
      "regencies_count": 23
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 37,
    "last_page": 2
  }
}
```

#### GET /api/v1/regions/provinces/{id}/regencies
Get regencies in a province.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "1101",
      "province_id": "11",
      "name": "KABUPATEN ACEH SELATAN",
      "districts_count": 18
    }
  ]
}
```

#### GET /api/v1/regions/regencies/{id}/districts
Get districts in a regency.

#### GET /api/v1/regions/districts/{id}/villages
Get villages in a district.

### Family Card (Kartu Keluarga) Endpoints

#### GET /api/v1/kartu-keluarga
Get list of family cards.

**Query Parameters:**
- `search` (string): Search by number or head name
- `province_id` (string): Filter by province
- `regency_id` (string): Filter by regency
- `district_id` (string): Filter by district
- `village_id` (string): Filter by village
- `per_page` (integer): Items per page (1-100)
- `page` (integer): Page number
- `sort` (string): Sort field (nomor_kk, tanggal_dibuat)
- `direction` (string): Sort direction (asc, desc)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nomor_kk": "1234567890123456",
      "kepala_keluarga": "John Doe",
      "alamat": "Jl. Example No. 123",
      "rt": "001",
      "rw": "002",
      "kode_pos": "12345",
      "tanggal_dibuat": "2025-01-01",
      "tanggal_diperbarui": "2025-01-27",
      "province": {
        "id": "31",
        "name": "DKI JAKARTA"
      },
      "regency": {
        "id": "3101",
        "name": "KABUPATEN KEPULAUAN SERIBU"
      },
      "district": {
        "id": "310101",
        "name": "KEPULAUAN SERIBU SELATAN"
      },
      "village": {
        "id": "3101011001",
        "name": "PULAU TIDUNG"
      },
      "anggota_count": 4,
      "status": "active"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8
  }
}
```

#### POST /api/v1/kartu-keluarga
Create new family card.

**Request:**
```json
{
  "nomor_kk": "1234567890123456",
  "kepala_keluarga": "John Doe",
  "alamat": "Jl. Example No. 123",
  "rt": "001",
  "rw": "002",
  "kode_pos": "12345",
  "province_id": "31",
  "regency_id": "3101",
  "district_id": "310101",
  "village_id": "3101011001",
  "tanggal_dibuat": "2025-01-01"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Kartu keluarga berhasil dibuat",
  "data": {
    "id": 1,
    "nomor_kk": "1234567890123456",
    "kepala_keluarga": "John Doe",
    // ... other fields
  }
}
```

#### GET /api/v1/kartu-keluarga/{id}
Get specific family card.

#### PUT /api/v1/kartu-keluarga/{id}
Update family card.

#### DELETE /api/v1/kartu-keluarga/{id}
Delete family card.

### Family Member (Anggota Keluarga) Endpoints

#### GET /api/v1/anggota-keluarga
Get list of family members.

**Query Parameters:**
- `search` (string): Search by name or NIK
- `kartu_keluarga_id` (integer): Filter by family card
- `jenis_kelamin` (string): Filter by gender (L/P)
- `status_perkawinan` (string): Filter by marital status
- `per_page` (integer): Items per page (1-100)
- `page` (integer): Page number

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nik": "3101011001850001",
      "nama_lengkap": "John Doe",
      "jenis_kelamin": "L",
      "tempat_lahir": "Jakarta",
      "tanggal_lahir": "1985-01-01",
      "agama": "Islam",
      "pendidikan": "S1",
      "pekerjaan": "Pegawai Swasta",
      "status_perkawinan": "Kawin",
      "status_dalam_keluarga": "Kepala Keluarga",
      "kewarganegaraan": "WNI",
      "kartu_keluarga": {
        "id": 1,
        "nomor_kk": "1234567890123456",
        "kepala_keluarga": "John Doe"
      },
      "umur": 40
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 300,
    "last_page": 15
  }
}
```

#### POST /api/v1/anggota-keluarga
Create new family member.

**Request:**
```json
{
  "kartu_keluarga_id": 1,
  "nik": "3101011001850001",
  "nama_lengkap": "John Doe",
  "jenis_kelamin": "L",
  "tempat_lahir": "Jakarta",
  "tanggal_lahir": "1985-01-01",
  "agama": "Islam",
  "pendidikan": "S1",
  "pekerjaan": "Pegawai Swasta",
  "status_perkawinan": "Kawin",
  "status_dalam_keluarga": "Kepala Keluarga",
  "kewarganegaraan": "WNI",
  "nama_ayah": "Father Name",
  "nama_ibu": "Mother Name"
}
```

#### GET /api/v1/anggota-keluarga/{id}
Get specific family member.

#### PUT /api/v1/anggota-keluarga/{id}
Update family member.

#### DELETE /api/v1/anggota-keluarga/{id}
Delete family member.

### Statistics Endpoints

#### GET /api/v1/statistics/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_kartu_keluarga": 150,
    "total_anggota_keluarga": 600,
    "total_laki_laki": 305,
    "total_perempuan": 295,
    "total_provinces": 37,
    "total_regencies": 514,
    "growth_this_month": {
      "kartu_keluarga": 5,
      "anggota_keluarga": 20
    },
    "top_provinces": [
      {
        "province": "DKI JAKARTA",
        "count": 45
      }
    ],
    "age_distribution": {
      "0-17": 120,
      "18-35": 180,
      "36-50": 200,
      "51+": 100
    }
  }
}
```

#### GET /api/v1/statistics/population
Get population statistics by region.

#### GET /api/v1/statistics/demographics
Get demographic analysis.

### Export Endpoints

#### GET /api/v1/export/kartu-keluarga
Export family cards to Excel/PDF.

**Query Parameters:**
- `format` (string): Export format (excel, pdf)
- `province_id` (string): Filter by province
- `regency_id` (string): Filter by regency
- `district_id` (string): Filter by district
- `village_id` (string): Filter by village

**Response:** Binary file download

#### GET /api/v1/export/anggota-keluarga
Export family members to Excel/PDF.

## 📝 Request/Response Examples

### Advanced Search Example
```javascript
// Search family cards with multiple filters
GET /api/v1/kartu-keluarga?search=john&province_id=31&page=2&per_page=10&sort=tanggal_dibuat&direction=desc

// Response includes pagination and filtering information
{
  "status": "success",
  "data": [...],
  "meta": {
    "current_page": 2,
    "per_page": 10,
    "total": 25,
    "last_page": 3,
    "from": 11,
    "to": 20
  },
  "filters": {
    "search": "john",
    "province_id": "31",
    "sort": "tanggal_dibuat",
    "direction": "desc"
  }
}
```

### Batch Operations Example
```javascript
// Bulk create family members
POST /api/v1/anggota-keluarga/batch
{
  "kartu_keluarga_id": 1,
  "members": [
    {
      "nik": "3101011001850001",
      "nama_lengkap": "John Doe",
      // ... other fields
    },
    {
      "nik": "3101011001850002",
      "nama_lengkap": "Jane Doe",
      // ... other fields
    }
  ]
}

// Response with individual results
{
  "status": "success",
  "message": "2 anggota keluarga berhasil dibuat",
  "data": {
    "created": 2,
    "failed": 0,
    "results": [
      {
        "status": "success",
        "data": { /* member 1 data */ }
      },
      {
        "status": "success",
        "data": { /* member 2 data */ }
      }
    ]
  }
}
```

### Validation Error Example
```javascript
// Invalid request
POST /api/v1/kartu-keluarga
{
  "nomor_kk": "123", // Too short
  "kepala_keluarga": "", // Required field empty
  "province_id": "invalid" // Invalid province
}

// Validation error response
{
  "status": "error",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": {
    "nomor_kk": ["Nomor KK harus 16 digit"],
    "kepala_keluarga": ["Nama kepala keluarga wajib diisi"],
    "province_id": ["Provinsi yang dipilih tidak valid"]
  }
}
```

## 🛠️ SDK & Libraries

### JavaScript/TypeScript SDK
```javascript
// Install SDK
npm install siwarga-js-sdk

// Usage example
import SIWarga from 'siwarga-js-sdk';

const client = new SIWarga({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 30000
});

// Login
await client.auth.login('admin@siwarga.local', 'password');

// Get family cards
const kartuKeluarga = await client.kartuKeluarga.list({
  search: 'john',
  per_page: 20,
  page: 1
});

// Create family member
const anggota = await client.anggotaKeluarga.create({
  kartu_keluarga_id: 1,
  nik: '3101011001850001',
  nama_lengkap: 'John Doe',
  // ... other fields
});
```

### PHP SDK
```php
// Install SDK
composer require siwarga/php-sdk

// Usage example
use SIWarga\Client;

$client = new Client([
    'base_url' => 'http://localhost:8000/api/v1',
    'timeout' => 30
]);

// Login
$client->auth()->login('admin@siwarga.local', 'password');

// Get family cards
$kartuKeluarga = $client->kartuKeluarga()->list([
    'search' => 'john',
    'per_page' => 20,
    'page' => 1
]);

// Create family member
$anggota = $client->anggotaKeluarga()->create([
    'kartu_keluarga_id' => 1,
    'nik' => '3101011001850001',
    'nama_lengkap' => 'John Doe',
    // ... other fields
]);
```

### Python SDK
```python
# Install SDK
pip install siwarga-python-sdk

# Usage example
from siwarga import SIWarga

client = SIWarga(
    base_url='http://localhost:8000/api/v1',
    timeout=30
)

# Login
client.auth.login('admin@siwarga.local', 'password')

# Get family cards
kartu_keluarga = client.kartu_keluarga.list(
    search='john',
    per_page=20,
    page=1
)

# Create family member
anggota = client.anggota_keluarga.create(
    kartu_keluarga_id=1,
    nik='3101011001850001',
    nama_lengkap='John Doe',
    # ... other fields
)
```

## 📈 Changelog

### v1.0.0 (2025-01-27)
- **Initial Release**
- Authentication endpoints with session support
- Complete regional data API (provinces, regencies, districts, villages)
- Family card (Kartu Keluarga) CRUD operations
- Family member (Anggota Keluarga) CRUD operations
- Advanced search and filtering
- Statistics and analytics endpoints
- Export functionality (Excel/PDF)
- Rate limiting and security features
- Comprehensive validation and error handling
- API documentation and examples

### Upcoming Features (v1.1.0)
- GraphQL API support
- Real-time notifications via WebSocket
- Advanced analytics and reporting
- Batch import/export operations
- API versioning support
- Enhanced search with Elasticsearch
- Mobile-specific endpoints
- Third-party integrations

---

## 📞 Support

For API support and questions:
- **Developer**: sutiyonodoang@gmail.com
- **Documentation**: README.md, MANUAL.md
- **GitHub Issues**: Report bugs and feature requests
- **Response Time**: 24-48 hours

**API Status**: https://status.siwarga.local

---

## 📄 License

This API documentation is part of SIWarga application.

**Copyright © 2025 Sutiyono**  
**Email**: sutiyonodoang@gmail.com  
**License**: MIT License - see [LICENSE](LICENSE) file for details.

---

*SIWarga API v1.0.0 - Sistem Informasi Warga untuk pengelolaan data kependudukan yang modern, aman, dan efisien.*
