<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class ResetUserPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:reset-password {email} {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset password for a specific user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');

        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User dengan email {$email} tidak ditemukan.");
            
            $this->info("Menampilkan semua user yang ada:");
            $users = User::all();
            foreach ($users as $u) {
                $this->line("- {$u->email} ({$u->name})");
            }
            return 1;
        }

        $user->password = Hash::make($password);
        $user->save();

        $this->info("Password berhasil diubah untuk user: {$user->email}");
        $this->info("Email: {$user->email}");
        $this->info("Password baru: {$password}");
        
        return 0;
    }
}
