# Contributing to SIWarga

Thank you for your interest in contributing to SIWarga! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

### Our Pledge
We are committed to making participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites
Before contributing, ensure you have:
- **PHP 8.2+** with required extensions
- **Node.js 18.0+** and npm
- **Git** for version control
- **Code editor** (VS Code recommended)
- **Database tools** for SQLite management

### Fork and Clone
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/siwarga-app.git
   cd siwarga-app
   ```

## 🛠️ Development Setup

### Environment Setup
1. **Install PHP dependencies:**
   ```bash
   composer install
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Environment configuration:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database setup:**
   ```bash
   php artisan migrate --seed
   ```

5. **Build frontend assets:**
   ```bash
   npm run dev
   ```

6. **Start development server:**
   ```bash
   php artisan serve
   ```

### Development Tools
- **Laravel Sail** for Docker development
- **Laravel Telescope** for debugging
- **Vite** for frontend hot reloading
- **PHPUnit** for backend testing
- **Jest** for frontend testing

## 🔄 Contribution Workflow

### Branch Strategy
We use **Git Flow** branching strategy:

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features
- **`feature/*`** - New features
- **`bugfix/*`** - Bug fixes
- **`hotfix/*`** - Critical production fixes
- **`release/*`** - Release preparation

### Creating a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Commit Message Format
Use **Conventional Commits** format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(kartu-keluarga): add NIK validation"
git commit -m "fix(auth): resolve login session timeout"
git commit -m "docs(api): update endpoint documentation"
```

## 📏 Coding Standards

### PHP (Backend)
Follow **PSR-12** coding standards:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KartuKeluarga;

class KartuKeluargaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = KartuKeluarga::with(['anggotaKeluarga', 'village']);
        
        if ($request->has('search')) {
            $query->where('nomor_kk', 'like', "%{$request->search}%");
        }
        
        return response()->json($query->paginate(15));
    }
}
```

**PHP Guidelines:**
- Use **type declarations** for parameters and return types
- Write **PHPDoc comments** for all public methods
- Follow **SOLID principles**
- Use **Laravel conventions** for naming
- Implement **proper error handling**

### TypeScript/React (Frontend)
Follow **ESLint** and **Prettier** configurations:

```typescript
interface KartuKeluargaProps {
  id: number;
  nomorKk: string;
  namaKk: string;
  alamat: string;
  anggotaKeluarga: AnggotaKeluarga[];
}

const KartuKeluargaCard: React.FC<KartuKeluargaProps> = ({ 
  id, 
  nomorKk, 
  namaKk, 
  alamat 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleEdit = useCallback(() => {
    router.visit(`/kartu-keluarga/${id}/edit`);
  }, [id]);
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">{namaKk}</h3>
      <p className="text-sm text-gray-600">{nomorKk}</p>
      <p className="text-sm">{alamat}</p>
    </Card>
  );
};
```

**TypeScript Guidelines:**
- Use **strict TypeScript** configuration
- Define **interfaces** for all data structures
- Use **React hooks** properly
- Implement **proper error boundaries**
- Follow **React best practices**

### Database
Follow **Laravel migration** conventions:

```php
Schema::create('kartu_keluarga', function (Blueprint $table) {
    $table->id();
    $table->string('nomor_kk', 16)->unique();
    $table->string('nama_kepala_keluarga');
    $table->text('alamat');
    $table->foreignId('village_id')->constrained('reg_villages');
    $table->timestamps();
    
    $table->index(['nomor_kk', 'village_id']);
});
```

## 🧪 Testing Guidelines

### Backend Testing (PHPUnit)
```php
class KartuKeluargaTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_can_create_kartu_keluarga(): void
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->postJson('/api/kartu-keluarga', [
                'nomor_kk' => '1234567890123456',
                'nama_kepala_keluarga' => 'John Doe',
                'alamat' => 'Jl. Test No. 123',
                'village_id' => 1,
            ]);
            
        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'nomor_kk']);
    }
}
```

### Frontend Testing (Jest + React Testing Library)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import KartuKeluargaCard from '../KartuKeluargaCard';

describe('KartuKeluargaCard', () => {
  it('renders kartu keluarga information', () => {
    const props = {
      id: 1,
      nomorKk: '1234567890123456',
      namaKk: 'John Doe',
      alamat: 'Jl. Test No. 123',
      anggotaKeluarga: [],
    };
    
    render(<KartuKeluargaCard {...props} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1234567890123456')).toBeInTheDocument();
  });
});
```

### Running Tests
```bash
# Backend tests
php artisan test

# Frontend tests
npm run test

# Coverage report
php artisan test --coverage
npm run test:coverage
```

## 📚 Documentation

### Code Documentation
- **PHPDoc** for all PHP classes and methods
- **JSDoc** for complex TypeScript functions
- **README updates** for new features
- **API documentation** for new endpoints

### Documentation Standards
```php
/**
 * Create a new kartu keluarga record.
 *
 * @param  \App\Http\Requests\StoreKartuKeluargaRequest  $request
 * @return \Illuminate\Http\JsonResponse
 * 
 * @throws \Illuminate\Validation\ValidationException
 */
public function store(StoreKartuKeluargaRequest $request): JsonResponse
{
    // Implementation
}
```

## 🐛 Issue Reporting

### Bug Reports
When reporting bugs, include:

```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]
```

### Feature Requests
```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why this feature would be useful.

**Proposed Solution**
How you envision this working.

**Alternatives**
Alternative solutions you've considered.
```

## 🔀 Pull Request Process

### Before Submitting
1. **Update your branch** with latest develop
2. **Run all tests** and ensure they pass
3. **Update documentation** if needed
4. **Follow commit message** conventions
5. **Check code style** with linter

### PR Template
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added (if applicable)
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in development environment
4. **Approval** from project lead
5. **Merge** to develop branch

## 🏷️ Release Process

### Version Numbering
We follow **Semantic Versioning (SemVer)**:
- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features (backward compatible)
- **Patch** (0.0.X): Bug fixes

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Release notes written

## 📞 Getting Help

### Contact Information
- **Lead Developer**: Sutiyono (sutiyonodoang@gmail.com)
- **Technical Support**: support@siwarga.local
- **Community**: GitHub Discussions

### Resources
- **Documentation**: README.md and MANUAL.md
- **API Reference**: API.md
- **Installation Guide**: INSTALL.md

---

Thank you for contributing to SIWarga! Your efforts help improve digital administration for Indonesian communities. 🇮🇩

**Happy Coding!** 🚀
