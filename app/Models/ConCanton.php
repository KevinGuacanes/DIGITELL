<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ConCanton extends Model implements Auditable {
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    
    protected $auditStrict = true;
    
    protected $table = "con_cantons";
    protected $primaryKey = "canton_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["canton_id", "province_id", "canton_name"];
    public $timestamps = false;

    protected static function booted() {
        static::creating(function ($model) {
            $latestCantonId = static::max("canton_id");
            $nextNumber = $latestCantonId
                ? intval(substr($latestCantonId, 4)) + 1
                : 1;
            $model->canton_id =
                "CAN-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public static function getCantons() {
        return self::with("province")
            ->get()
            ->map(function ($canton) {
                return [
                    "canton_id" => $canton->canton_id,
                    "province_id" => $canton->province_id,
                    "province_name" => $canton->province->province_name,
                    "canton_name" => $canton->canton_name,
                ];
            });
    }

    public function province() {
        return $this->belongsTo(
            ConProvince::class,
            "province_id",
            "province_id"
        );
    }

    public function parishes() {
        return $this->hasMany(ConParish::class, "canton_id", "canton_id");
    }
}
