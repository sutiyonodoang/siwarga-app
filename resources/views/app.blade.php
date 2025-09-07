<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'SIWarga') }}</title>

        {{-- Favicon and Icons --}}
        <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="32x32">
        <link rel="icon" href="{{ asset('favicon-16x16.png') }}" sizes="16x16" type="image/png">
        <link rel="icon" href="{{ asset('favicon-32x32.png') }}" sizes="32x32" type="image/png">
        <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
        
        {{-- Apple Touch Icon --}}
        <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}" sizes="180x180">
        
        {{-- Android Chrome Icons --}}
        <link rel="icon" href="{{ asset('android-chrome-192x192.png') }}" sizes="192x192" type="image/png">
        <link rel="icon" href="{{ asset('android-chrome-512x512.png') }}" sizes="512x512" type="image/png">
        
        {{-- Web App Manifest --}}
        <link rel="manifest" href="{{ asset('site.webmanifest') }}">
        
        {{-- Theme Color for Mobile Browsers --}}
        <meta name="theme-color" content="#3b82f6">
        <meta name="msapplication-TileColor" content="#3b82f6">
        
        {{-- Open Graph Meta Tags --}}
        <meta property="og:title" content="{{ config('app.name', 'SIWarga') }}">
        <meta property="og:description" content="Sistem Informasi Warga untuk mengelola data warga lokal">
        <meta property="og:image" content="{{ asset('android-chrome-512x512.png') }}">
        <meta property="og:url" content="{{ url('/') }}">
        <meta property="og:type" content="website">
        
        {{-- Twitter Card Meta Tags --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name', 'SIWarga') }}">
        <meta name="twitter:description" content="Sistem Informasi Warga untuk mengelola data warga lokal">
        <meta name="twitter:image" content="{{ asset('android-chrome-512x512.png') }}">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
