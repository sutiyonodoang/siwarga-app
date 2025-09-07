# Brand Assets - SIWarga Logo

## Struktur File Logo

```
brand/
├── logo-full.svg           # Logo lengkap dengan teks
├── logo-icon.svg          # Hanya icon/simbol
├── logo-horizontal.svg    # Layout horizontal
├── logo-vertical.svg      # Layout vertikal
├── logo-dark.svg          # Variant untuk dark mode
├── logo-light.svg         # Variant untuk light mode
└── variants/
    ├── logo-small.svg     # Versi kecil (navbar, mobile)
    ├── logo-medium.svg    # Versi sedang (header)
    └── logo-large.svg     # Versi besar (landing page)
```

## Penggunaan dalam Kode

### 1. Direct Access (Public)
```javascript
// Di React component
<img src="/images/brand/logo-full.svg" alt="SIWarga" />

// Di HTML meta tags
<link rel="icon" href="/images/brand/logo-icon.svg" />
```

### 2. Import dengan Vite (jika di resources)
```javascript
import logoFull from '@/images/brand/logo-full.svg';
<img src={logoFull} alt="SIWarga" />
```

## Format yang Direkomendasikan

- **SVG**: Untuk logo utama (scalable, kecil)
- **PNG**: Untuk favicon dan platform tertentu
- **ICO**: Untuk favicon browser lama
- **WebP**: Untuk optimisasi web modern

## Ukuran yang Disarankan

- **Logo Full**: 200x60px (ratio 10:3)
- **Logo Icon**: 32x32px, 64x64px, 128x128px
- **Favicon**: 16x16px, 32x32px, 48x48px
- **Apple Touch**: 180x180px
- **Android**: 192x192px, 512x512px

## Panduan Penggunaan

1. **Navbar**: gunakan `logo-small.svg` atau `logo-icon.svg`
2. **Header**: gunakan `logo-horizontal.svg`
3. **Landing Page**: gunakan `logo-full.svg` atau `logo-large.svg`
4. **Dark Mode**: gunakan variant `logo-dark.svg`
5. **Favicon**: gunakan `logo-icon.svg` atau convert ke ICO
