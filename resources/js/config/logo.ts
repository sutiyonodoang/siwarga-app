// Logo Configuration for SIWarga
export const LOGO_CONFIG = {
    // Base paths
    basePath: '/images/brand',
    
    // Logo variants
    variants: {
        full: '/images/brand/logo-full.svg',
        icon: '/images/brand/logo-icon.svg',
        horizontal: '/images/brand/logo-horizontal.svg',
        vertical: '/images/brand/logo-vertical.svg',
        dark: '/images/brand/logo-dark.svg',
        light: '/images/brand/logo-light.svg',
        small: '/images/brand/variants/logo-small.svg',
        medium: '/images/brand/variants/logo-medium.svg',
        large: '/images/brand/variants/logo-large.svg',
    },
    
    // Fallback to current icon component
    fallback: 'AppLogoIcon',
    
    // Alt text
    alt: 'SIWarga - Sistem Informasi Warga'
};

// Usage examples:
// <img src={LOGO_CONFIG.variants.full} alt={LOGO_CONFIG.alt} />
// <img src={LOGO_CONFIG.variants.icon} alt={LOGO_CONFIG.alt} />

export default LOGO_CONFIG;
