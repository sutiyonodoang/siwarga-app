<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'reg_districts';

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
        'regency_id',
        'name',
    ];

    /**
     * Get the regency that owns the district.
     */
    public function regency()
    {
        return $this->belongsTo(Regency::class, 'regency_id', 'id');
    }

    /**
     * Get the villages for the district.
     */
    public function villages()
    {
        return $this->hasMany(Village::class, 'district_id', 'id');
    }
}