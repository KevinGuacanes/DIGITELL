<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Ips extends Model implements Auditable {
    use \OwenIt\Auditing\Auditable;
    use HasFactory;
    protected $auditStrict = true;
    protected $table = "ip_ip";
    protected $primaryKey = "ip_address";
    public $incrementing = false;
    protected $keyType = "string";

    protected $fillable = [
        "ip_address",
        "distribution_nap_id",
        "ip_status",
        "last_mile_nap_id",
    ];
    public $timestamps = false;

    public static function getIps() {
        return self::with(["distributionNap", "lastMileNap"])
            ->get()
            ->map(function ($ip) {
                return [
                    "ip_address" => $ip->ip_address,
                    "distribution_nap_id" => $ip->distribution_nap_id,
                    "ip_status" => $ip->ip_status,
                    "last_mile_nap_id" => $ip->last_mile_nap_id ?? '',
                    "distribution_nap_name" =>
                        $ip->distributionNap->distribution_nap_name ?? null,
                    "last_mile_nap_name" =>
                        $ip->lastMileNap->last_mile_nap_name ?? '', // Incluir el nombre de la NAP de última milla
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

    public function lastMileNap() {
        return $this->belongsTo(
            IpLastMile::class,
            "last_mile_nap_id",
            "last_mile_nap_id"
        );
    }
    public function contracts() {
        return $this->hasMany(ConContract::class, "ip_address", "ip_address");
    }
}
