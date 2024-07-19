<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class IpDistribution extends Model  implements Auditable{
    use HasFactory;
    use \OwenIt\Auditing\Auditable;
    protected $auditStrict = true;
    protected $table = "ip_distribution_naps";

    protected $primaryKey = "distribution_nap_id";
    public $incrementing = false;
    protected $keyType = "string";

    protected $fillable = [
        "distribution_nap_id",
        "olt_id",
        "olt_ports",
        "distribution_nap_name",
        "distribution_nap_address",
        "distribution_nap_coordx",
        "distribution_nap_coordy",
        "distribution_nap_splitter",
    ];

    protected static function booted() {
        static::creating(function ($model) {
            $DistributionNapId = static::max("distribution_nap_id");
            $nextNumber = $DistributionNapId
                ? intval(substr($DistributionNapId, 4)) + 1
                : 1;
            $model->distribution_nap_id =
                "NDI-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
        static::created(function ($model) {
            $model->generateIpsForDistributionNap();
        });
    }

    public $timestamps = false;

    public static function getDistributionNaps() {
        return self::with("olts")
            ->get()
            ->map(function ($nap) {
                return [
                    "distribution_nap_id" => $nap->distribution_nap_id,
                    "olt_id" => $nap->olt_id,
                    "olt_name" => $nap->olts->olt_name,
                    "olt_ports" => $nap->olt_ports,
                    "distribution_nap_name" => $nap->distribution_nap_name,
                    "distribution_nap_address" =>
                        $nap->distribution_nap_address,
                    "distribution_nap_coordx" => $nap->distribution_nap_coordx,
                    "distribution_nap_coordy" => $nap->distribution_nap_coordy,
                    "distribution_nap_splitter" =>
                        $nap->distribution_nap_splitter,
                ];
            });
    }

    public function lastmileNaps() {
        return $this->hasMany(IpLastMile::class, "last_mile_nap_id");
    }

    public function olts() {
        return $this->belongsTo(IpOlts::class, "olt_id", "olt_id");
    }

    private function generateIpsForDistributionNap() {
        $olt = $this->olts;
    
        $previousPortsCount = IpOlts::where("olt_id", "<", $olt->olt_id)->sum("olt_ports");
    
        $selectedPort = $this->olt_ports;
    
        $startIpThirdOctet = $previousPortsCount + $selectedPort;
    
        for ($fourthOctet = 2; $fourthOctet <= 254; $fourthOctet++) {
            // Ajustar el cuarto octeto como una cadena con tres dígitos
            $fourthOctetFormatted = str_pad($fourthOctet, 3, "0", STR_PAD_LEFT);
    
            $ipAddress = "10.0.$startIpThirdOctet.$fourthOctetFormatted";
    
            $ip = new Ips([
                "ip_address" => $ipAddress,
                "distribution_nap_id" => $this->distribution_nap_id,
                "ip_status" => false,
            ]);
    
            if ($fourthOctet == 2 || $fourthOctet == 254) {
                $ip->save();
            } else {
                $ip->disableAuditing();
                $ip->save();
                $ip->enableAuditing();
            }
        }
    }
    
}
