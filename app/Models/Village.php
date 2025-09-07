<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Village extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'reg_villages';

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
        'district_id',
        'name',
    ];

    /**
     * Get the district that owns the village.
     */
    public function district()
    {
        return $this->belongsTo(District::class, 'district_id', 'id');
    }
}