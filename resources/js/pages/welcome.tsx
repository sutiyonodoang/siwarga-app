import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to SIWarga">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                
                {/* Additional Meta Tags for Welcome Page */}
                <meta name="description" content="Selamat datang di SIWarga - Sistem Informasi Warga untuk mengelola data kartu keluarga dan anggota keluarga dengan mudah dan terstruktur" />
                <meta name="keywords" content="siwarga, sistem informasi warga, kartu keluarga, data warga, administrasi" />
                
                {/* Open Graph for Welcome Page */}
                <meta property="og:title" content="Selamat Datang di SIWarga" />
                <meta property="og:description" content="Sistem Informasi Warga untuk mengelola data kartu keluarga dan anggota keluarga dengan mudah dan terstruktur" />
                <meta property="og:image" content="/android-chrome-512x512.png" />
                
                {/* PWA Meta Tags */}
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="SIWarga" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 dark:text-[#EDEDEC]">
                <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                    </nav>
                </header>
                
                {/* Floating decorative elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-10 blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 right-20 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
                
                <div className="flex w-full items-center justify-center relative z-10">
                    <main className="w-full max-w-4xl">
                        <div className="rounded-lg bg-white/80 backdrop-blur-sm border-0 shadow-xl p-12 hover:shadow-2xl transition-all duration-300 dark:bg-gray-900/80">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="flex-shrink-0 mr-3 p-1 bg-white rounded-lg shadow-sm">
                                        <img 
                                            src="/android-chrome-512x512.png" 
                                            alt="SIWarga Logo" 
                                            className="w-10 h-10 object-contain"
                                        />
                                    </div>
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Selamat Datang di SIWarga
                                    </h1>
                                </div>
                                <p className="mb-8 text-lg text-gray-600 dark:text-[#A1A09A]">
                                    Sistem Informasi Warga untuk mengelola data warga lokal
                                </p>
                                
                                <div className="mb-8 grid gap-4 md:grid-cols-3">
                                    <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 dark:from-gray-800 dark:to-blue-900 dark:border-blue-700">
                                        <div className="flex items-center justify-center mb-3">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-200 text-sm">📋 Kelola KK</h3>
                                        <p className="text-xs text-blue-600 dark:text-blue-300">
                                            Data Kartu Keluarga lengkap dan terstruktur
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 dark:from-gray-800 dark:to-green-900 dark:border-green-700">
                                        <div className="flex items-center justify-center mb-3">
                                            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="mb-2 font-semibold text-green-800 dark:text-green-200 text-sm">👥 Data Warga</h3>
                                        <p className="text-xs text-green-600 dark:text-green-300">
                                            Informasi anggota keluarga dan biodata
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 dark:from-gray-800 dark:to-purple-900 dark:border-purple-700">
                                        <div className="flex items-center justify-center mb-3">
                                            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="mb-2 font-semibold text-purple-800 dark:text-purple-200 text-sm">📊 Laporan</h3>
                                        <p className="text-xs text-purple-600 dark:text-purple-300">
                                            Dashboard dan statistik warga
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex justify-center gap-4">
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
                                    >
                                        🔑 Login
                                    </Link>
                                    {!auth.user && (
                                        <Link
                                            href={route('register')}
                                            className="rounded-lg border-2 border-blue-200 bg-white/70 backdrop-blur-sm px-6 py-3 text-blue-600 font-medium shadow-md hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg transition-all duration-200 transform hover:scale-105 dark:border-purple-600 dark:bg-gray-800/70 dark:text-purple-300 dark:hover:border-purple-500 dark:hover:bg-purple-900/50"
                                        >
                                            ✨ Daftar
                                        </Link>
                                    )}
                                </div>
                                
                                {/* Additional Features Info */}
                                <div className="mt-8 pt-6 border-t border-gradient-to-r from-blue-200 to-purple-200">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        ✨ Fitur unggulan: Manajemen peran, kontrol status pengguna, dan laporan data real-time
                                    </p>
                                    <div className="flex justify-center items-center gap-2 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            🔒 <span>Aman</span>
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            ⚡ <span>Cepat</span>
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            📱 <span>Responsif</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
