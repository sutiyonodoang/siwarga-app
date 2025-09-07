<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class DatabaseEncryptionService
{
    private const ENCRYPTION_ALGORITHM = 'AES-256-CBC';
    private const BACKUP_EXTENSION = '.encrypted';
    
    /**
     * Encrypt database file
     */
    public function encryptDatabase(string $sourcePath, string $destinationPath = null): bool
    {
        try {
            if (!File::exists($sourcePath)) {
                throw new \Exception("Database file not found: {$sourcePath}");
            }
            
            $destinationPath = $destinationPath ?? $sourcePath . self::BACKUP_EXTENSION;
            
            // Read database content
            $data = File::get($sourcePath);
            
            // Generate encryption key from app key
            $key = $this->generateEncryptionKey();
            
            // Generate random IV
            $iv = random_bytes(16);
            
            // Encrypt data
            $encrypted = openssl_encrypt($data, self::ENCRYPTION_ALGORITHM, $key, 0, $iv);
            
            if ($encrypted === false) {
                throw new \Exception('Encryption failed');
            }
            
            // Combine IV and encrypted data
            $encryptedData = base64_encode($iv . $encrypted);
            
            // Write encrypted file
            File::put($destinationPath, $encryptedData);
            
            Log::info('Database encrypted successfully', [
                'source' => $sourcePath,
                'destination' => $destinationPath,
                'size' => File::size($destinationPath)
            ]);
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('Database encryption failed', [
                'error' => $e->getMessage(),
                'source' => $sourcePath
            ]);
            
            return false;
        }
    }
    
    /**
     * Generate encryption key from app key
     */
    private function generateEncryptionKey(): string
    {
        $appKey = config('app.key');
        
        // Remove 'base64:' prefix if present
        if (strpos($appKey, 'base64:') === 0) {
            $appKey = base64_decode(substr($appKey, 7));
        }
        
        // Generate 32-byte key for AES-256
        return hash('sha256', $appKey, true);
    }
}
