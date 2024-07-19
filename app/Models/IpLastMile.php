<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class IpLastMile extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable; 
    use HasFactory;
    protected $auditStrict = true;

    protected $table = "ip_last_mile_naps";

    protected $primaryKey = "last_mile_nap_id";
    public $incrementing = false;
    protected $keyType = "string";
    
    protected $fillable = [
        "last_mile_nap_id",
        "distribution_nap_id",
        "last_mile_nap_name",
        "last_mile_nap_address",
        "last_mile_nap_coordx",
        "last_mile_nap_coordy",
        "last_mile_nap_splitter",
    ];
    
    protected static function booted()
    {
        static::creating(function ($model) {
            $LastMileNapId = static::max("last_mile_nap_id");
            $nextNumber = $LastMileNapId
                ? intval(substr($LastMileNapId, 4)) + 1
                : 1;
            $model->last_mile_nap_id =
                "NUM-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public $timestamps = false;

    public static function getLastMileNaps() {
        return self::with("distributionNap")
            ->get()
            ->map(function ($nap) {
                return [
                    "last_mile_nap_id" => $nap->last_mile_nap_id,
                    "distribution_nap_id" => $nap->distribution_nap_id,
                    "distribution_nap_name" => $nap->distributionNap->distribution_nap_name,
                    "last_mile_nap_name" => $nap->last_mile_nap_name,
                    "last_mile_nap_address" => $nap->last_mile_nap_address,
                    "last_mile_nap_coordx" => $nap->last_mile_nap_coordx,
                    "last_mile_nap_coordy" => $nap->last_mile_nap_coordy,
                    "last_mile_nap_splitter" => $nap->last_mile_nap_splitter,
                ];
            });
    }

    public function distributionNap() {
        return $this->belongsTo(
            IpDistribution::class,
            "distribution_nap_id",
            "distribution_nap_id"
        );
    }
    public function Ips() {
        return $this->hasMany(Ips::class, "ip_address");
    }

    
}
