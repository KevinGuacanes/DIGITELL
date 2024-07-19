<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ConSector extends Model implements Auditable {
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    protected $auditStrict = true;

    protected $table = "con_sector";
    protected $primaryKey = "sector_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "sector_id",
        "parish_id",
        "sector_name",
        "description",
    ];
    public $timestamps = false;

    protected static function booted() {
        static::creating(function ($model) {
            $latestSectorId = static::max("sector_id");
            $nextNumber = $latestSectorId
                ? intval(substr($latestSectorId, 4)) + 1
                : 1;
            $model->sector_id =
                "SEC-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public static function getSectors() {
        return self::with("parish")
            ->get()
            ->map(function ($sector) {
                return [
                    "sector_id" => $sector->sector_id,
                    "parish_id" => $sector->parish_id,
                    "parish_name" => $sector->parish->parish_name,
                    "sector_name" => $sector->sector_name,
                    "description" => $sector->description,
                ];
            });
    }

    public function parish() {
        return $this->belongsTo(ConParish::class, "parish_id", "parish_id");
    }

    public function clients() {
        return $this->hasMany(ConClient::class, "sector_id", "sector_id");
    }
}
