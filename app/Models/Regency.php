<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Regency extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'reg_regencies';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'province_id',
        'name',
    ];

    /**
     * Get the province that owns the regency.
     */
    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    /**
     * Get the districts for the regency.
     */
    public function districts()
    {
        return $this->hasMany(District::class, 'regency_id', 'id');
    }
}