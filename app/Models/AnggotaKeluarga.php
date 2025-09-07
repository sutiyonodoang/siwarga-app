<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $no_kk
 * @property int $no_urut
 * @property string $nama_lengkap
 * @property string $nik
 * @property bool $is_warga_musiman
 * @property \Carbon\Carbon|null $tanggal_mulai
 * @property \Carbon\Carbon|null $tanggal_selesai
 * @property string|null $alamat_asal
 * @property string|null $alasan_kedatangan
 * @property string|null $nomor_telepon_darurat
 * @property string|null $nama_kontak_darurat
 * @property string|null $hubungan_kontak_darurat
 * @property bool $status_aktif
 */
class AnggotaKeluarga extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'anggota_keluarga';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'no_kk',
        'no_urut',
        'nama_lengkap',
        'nik',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'agama',
        'pendidikan',
        'jenis_pekerjaan',
        'golongan_darah',
        'status_perkawinan',
        'tanggal_perkawinan',
        'status_hubungan_dalam_keluarga',
        'status_hubungan_custom',
        'kewarganegaraan',
        'no_paspor',
        'no_kitap',
        // Atribut sosial survey
        'is_masyarakat_miskin',
        'has_bpjs_kesehatan',
        'status_bpjs_kesehatan_aktif',
        'jenis_keanggotaan_bpjs',
        'detail_nonpbi_bpjs',
        'has_bpjs_ketenagakerjaan',
        'has_e_ktp',
        'kondisi_e_ktp',
        'perlu_update_kk',
        'has_akta_kelahiran',
        'catatan_sosial',
        'created_by',
        // Atribut warga musiman
        'is_warga_musiman',
        'tanggal_mulai',
        'tanggal_selesai',
        'alamat_asal',
        'province_id',
        'regency_id',
        'district_id',
        'village_id',
        'rt',
        'rw',
        'alasan_kedatangan',
        'nomor_telepon_darurat',
        'nama_kontak_darurat',
        'hubungan_kontak_darurat',
        'status_aktif',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_perkawinan' => 'date',
        // Atribut sosial survey
        'is_masyarakat_miskin' => 'boolean',
        'has_bpjs_kesehatan' => 'boolean',
        'status_bpjs_kesehatan_aktif' => 'boolean',
        'has_bpjs_ketenagakerjaan' => 'boolean',
        'has_e_ktp' => 'boolean',
        'perlu_update_kk' => 'boolean',
        'has_akta_kelahiran' => 'boolean',
        // Atribut warga musiman
        'is_warga_musiman' => 'boolean',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'status_aktif' => 'boolean',
    ];

    /**
     * Get the kartu keluarga that owns the anggota keluarga.
     */
    public function kartuKeluarga()
    {
        return $this->belongsTo(KartuKeluarga::class, 'no_kk', 'no_kk');
    }

    /**
     * Get the user who created this anggota keluarga.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the province of the alamat_asal.
     */
    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    /**
     * Get the regency of the alamat_asal.
     */
    public function regency()
    {
        return $this->belongsTo(Regency::class, 'regency_id');
    }

    /**
     * Get the district of the alamat_asal.
     */
    public function district()
    {
        return $this->belongsTo(District::class, 'district_id');
    }

    /**
     * Get the village of the alamat_asal.
     */
    public function village()
    {
        return $this->belongsTo(Village::class, 'village_id');
    }

    /**
     * Scope a query to only include records created by the current user.
     */
    public function scopeOwnedBy($query, $userId)
    {
        return $query->where('created_by', $userId);
    }

    /**
     * Scope a query to only include warga musiman.
     */
    public function scopeWargaMusiman($query)
    {
        return $query->where('is_warga_musiman', true);
    }

    /**
     * Scope a query to only include active warga musiman.
     */
    public function scopeWargaMusimanAktif($query)
    {
        return $query->where('is_warga_musiman', true)
                    ->where('status_aktif', true);
    }

    /**
     * Get the is_warga_musiman attribute.
     *
     * @return bool
     */
    public function getIsWargaMusimanAttribute(): bool
    {
        return $this->attributes['is_warga_musiman'] ?? false;
    }

    /**
     * Get the status_aktif attribute.
     *
     * @return bool
     */
    public function getStatusAktifAttribute(): bool
    {
        return $this->attributes['status_aktif'] ?? true;
    }

    /**
     * Set the is_warga_musiman attribute.
     *
     * @param bool $value
     * @return void
     */
    public function setIsWargaMusimanAttribute(bool $value): void
    {
        $this->attributes['is_warga_musiman'] = $value;
    }

    /**
     * Set the status_aktif attribute.
     *
     * @param bool $value
     * @return void
     */
    public function setStatusAktifAttribute(bool $value): void
    {
        $this->attributes['status_aktif'] = $value;
    }

    /**
     * Check if the warga musiman period is still active.
     *
     * @return bool
     */
    public function isPeriodeAktif(): bool
    {
        if (!$this->is_warga_musiman || !$this->tanggal_selesai) {
            return false;
        }

        return now()->lte($this->tanggal_selesai);
    }
}