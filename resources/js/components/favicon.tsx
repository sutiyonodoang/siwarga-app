import { Head } from '@inertiajs/react';

interface FaviconProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

export default function Favicon({ 
    title = 'SIWarga', 
    description = 'Sistem Informasi Warga untuk mengelola data warga lokal',
    image = '/android-chrome-512x512.png',
    url = window.location.href
}: FaviconProps) {
    return (
        <Head>
            {/* Favicon ICO */}
            <link rel="icon" href="/favicon.ico" sizes="32x32" />
            
            {/* PNG Favicons */}
            <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
            <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
            
            {/* SVG Favicon (Modern browsers) */}
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            
            {/* Apple Touch Icon */}
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
            
            {/* Android Chrome Icons */}
            <link rel="icon" href="/android-chrome-192x192.png" sizes="192x192" type="image/png" />
            <link rel="icon" href="/android-chrome-512x512.png" sizes="512x512" type="image/png" />
            
            {/* Web App Manifest */}
            <link rel="manifest" href="/site.webmanifest" />
            
            {/* Theme Colors */}
            <meta name="theme-color" content="#3b82f6" />
            <meta name="msapplication-TileColor" content="#3b82f6" />
            
            {/* Page Specific Meta */}
            <title>{title}</title>
            <meta name="description" content={description} />
            
            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
            
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Head>
    );
}
