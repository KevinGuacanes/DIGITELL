<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ConParish extends Model implements Auditable {
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    
    protected $auditStrict = true;

    protected $table = "con_parishes";
    protected $primaryKey = "parish_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["parish_id", "canton_id", "parish_name"];
    public $timestamps = false;

    protected static function booted() {
        static::creating(function ($model) {
            $latestParishId = static::max("parish_id");
            $nextNumber = $latestParishId
                ? intval(substr($latestParishId, 4)) + 1
                : 1;
            $model->parish_id =
                "PAR-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public static function getParishes() {
        return self::with("canton")
            ->get()
            ->map(function ($parish) {
                return [
                    "parish_id" => $parish->parish_id,
                    "canton_id" => $parish->canton_id,
                    "canton_name" => $parish->canton->canton_name,
                    "parish_name" => $parish->parish_name,
                ];
            });
    }

    public function canton() {
        return $this->belongsTo(ConCanton::class, "canton_id", "canton_id");
    }

    public function sectors() {
        return $this->hasMany(ConSector::class, "parish_id", "parish_id");
    }
}
