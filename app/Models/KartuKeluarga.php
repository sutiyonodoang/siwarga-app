<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\KartuKeluarga
 *
 * @property string $no_kk
 * @property string $nama_kepala_keluarga
 * @property string $alamat
 * @property string|null $rt_rw
 * @property string|null $kode_pos
 * @property string|null $desa_kelurahan
 * @property string|null $kecamatan
 * @property string|null $kabupaten_kota
 * @property string|null $provinsi
 * @property string|null $province_id
 * @property string|null $regency_id
 * @property string|null $district_id
 * @property string|null $village_id
 * @property \Illuminate\Support\Carbon|null $tanggal_dikeluarkan
 * @property string|null $qr_code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AnggotaKeluarga> $anggotaKeluarga
 * @property-read int|null $anggota_keluarga_count
 */
class KartuKeluarga extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'kartu_keluarga';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'no_kk';

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'no_kk',
        'nama_kepala_keluarga',
        'alamat',
        'rt_rw',
        'kode_pos',
        'desa_kelurahan',
        'kecamatan',
        'kabupaten_kota',
        'provinsi',
        'province_id',
        'regency_id',
        'district_id',
        'village_id',
        'tanggal_dikeluarkan',
        'qr_code',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_dikeluarkan' => 'date',
    ];

    /**
     * Get the anggota keluarga for the kartu keluarga.
     */
    public function anggotaKeluarga()
    {
        return $this->hasMany(AnggotaKeluarga::class, 'no_kk', 'no_kk');
    }

    /**
     * Get the user who created this kartu keluarga.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Scope a query to only include records created by the current user.
     */
    public function scopeOwnedBy($query, $userId)
    {
        return $query->where('created_by', $userId);
    }
}