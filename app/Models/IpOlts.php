<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;


class IpOlts extends Model implements Auditable
{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    protected $auditStrict = true;
    protected $table = "ip_olts";

    protected $primaryKey = "olt_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        'olt_id',
        'olt_name',
        'olt_address',
        'olt_coordx',
        'olt_coordy',
        'olt_ports',
    ];
    public $timestamps = false;

    protected static function booted()
    {
        static::creating(function ($model) {
            $latestOltId = static::max("olt_id");
            $nextNumber = $latestOltId
                ? intval(substr($latestOltId, 4)) + 1
                : 1;
            $model->olt_id =
                "OLT-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public function distributionNaps() {
        return $this->hasMany(IpDistribution::class, 'olt_id', 'olt_id');
    }
}
