@echo off
REM SIWarga Laravel Server Launcher
REM File: siwarga.bat
REM Deskripsi: Script untuk menjalankan Laravel development server aplikasi SIWarga

echo ========================================
echo    SIWarga Laravel Server Launcher
echo ========================================
echo.

REM Pindah ke direktori root aplikasi SIWarga
echo [INFO] Mengarahkan ke direktori aplikasi...
cd /d "C:\xampp\htdocs\siwarga-app"
echo [INFO] Direktori saat ini: %CD%
echo.

REM Cek apakah file artisan ada
if not exist "artisan" (
    echo [ERROR] File artisan tidak ditemukan!
    echo [ERROR] Pastikan Anda berada di direktori root aplikasi Laravel.
    echo.
    pause
    exit /b 1
)

REM Cek apakah PHP tersedia
php --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] PHP tidak ditemukan di PATH!
    echo [ERROR] Pastikan PHP sudah terinstall dan ditambahkan ke PATH.
    echo.
    pause
    exit /b 1
)

echo [INFO] PHP ditemukan: 
php --version | findstr "PHP"
echo.

REM Cek apakah Laravel tersedia
echo [INFO] Versi Laravel:
php artisan --version
echo.

REM Tampilkan informasi aplikasi
echo [INFO] Memulai Laravel development server...
echo [INFO] Server akan berjalan di: http://127.0.0.1:8000
echo [INFO] Tekan Ctrl+C untuk menghentikan server
echo.

REM Jalankan Laravel server
echo [START] Menjalankan server Laravel...
echo ========================================
php artisan serve

REM Jika server berhenti
echo.
echo ========================================
echo [INFO] Server Laravel telah dihentikan.
echo ========================================
pause
