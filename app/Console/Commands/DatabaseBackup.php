<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class DatabaseBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup {--encrypt : Encrypt the backup file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create secure backup of SQLite database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting database backup...');

        try {
            // Buat direktori backup jika belum ada
            $backupDir = database_path('backups');
            if (!File::exists($backupDir)) {
                File::makeDirectory($backupDir, 0755, true);
            }

            // Path database sumber
            $sourceDb = database_path('siwarga_secure.sqlite');
            if (!File::exists($sourceDb)) {
                $this->error('Database file not found: ' . $sourceDb);
                return 1;
            }

            // Generate nama file backup dengan timestamp
            $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
            $backupFileName = "siwarga_backup_{$timestamp}.sqlite";
            $backupPath = $backupDir . DIRECTORY_SEPARATOR . $backupFileName;

            // Copy database
            File::copy($sourceDb, $backupPath);

            // Enkripsi backup jika diminta
            if ($this->option('encrypt')) {
                $this->encryptBackup($backupPath);
                $backupPath .= '.enc';
                $backupFileName .= '.enc';
            }

            // Kompresi backup
            if (File::exists($backupPath)) {
                $this->compressBackup($backupPath);
                $backupPath .= '.gz';
            }

            // Hapus backup lama (simpan 30 hari terakhir)
            $this->cleanOldBackups($backupDir);

            // Verifikasi backup
            if (File::exists($backupPath)) {
                $size = File::size($backupPath);
                $this->info("✅ Backup berhasil dibuat:");
                $this->info("   File: {$backupFileName}");
                $this->info("   Size: " . $this->formatBytes($size));
                $this->info("   Path: {$backupPath}");

                // Log backup
                Log::info('Database backup created', [
                    'file' => $backupFileName,
                    'size' => $size,
                    'encrypted' => $this->option('encrypt'),
                    'timestamp' => $timestamp
                ]);

                return 0;
            } else {
                $this->error('❌ Backup gagal dibuat');
                return 1;
            }

        } catch (\Exception $e) {
            $this->error('❌ Error during backup: ' . $e->getMessage());
            Log::error('Database backup failed', ['error' => $e->getMessage()]);
            return 1;
        }
    }

    /**
     * Enkripsi file backup
     */
    private function encryptBackup($filePath)
    {
        if (!function_exists('openssl_encrypt')) {
            $this->warn('OpenSSL tidak tersedia, backup tidak dienkripsi');
            return;
        }

        $key = config('app.key');
        $data = File::get($filePath);
        $iv = openssl_random_pseudo_bytes(16);
        $encrypted = openssl_encrypt($data, 'AES-256-CBC', $key, 0, $iv);
        
        File::put($filePath . '.enc', base64_encode($iv . $encrypted));
        File::delete($filePath);
    }

    /**
     * Kompresi file backup
     */
    private function compressBackup($filePath)
    {
        if (!function_exists('gzopen')) {
            return;
        }

        $data = File::get($filePath);
        $compressed = gzencode($data, 9);
        File::put($filePath . '.gz', $compressed);
        File::delete($filePath);
    }

    /**
     * Hapus backup lama
     */
    private function cleanOldBackups($backupDir)
    {
        $files = File::glob($backupDir . '/siwarga_backup_*.sqlite*');
        $cutoff = Carbon::now()->subDays(30);

        foreach ($files as $file) {
            $fileTime = File::lastModified($file);
            if ($fileTime < $cutoff->timestamp) {
                File::delete($file);
                $this->info("🗑️  Deleted old backup: " . basename($file));
            }
        }
    }

    /**
     * Format ukuran file
     */
    private function formatBytes($size, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $size > 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }
        
        return round($size, $precision) . ' ' . $units[$i];
    }
}
