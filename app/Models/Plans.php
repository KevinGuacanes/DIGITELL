<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Plans extends Model implements Auditable {
    use HasFactory;
    use \OwenIt\Auditing\Auditable;
    protected $auditStrict = true;
    protected $table = "pla_plans";

    protected $primaryKey = "plan_id";
    public $incrementing = false;
    protected $keyType = "string";
    public $timestamps = false;

    protected $fillable = [
        "plan_id",
        "plan_name",
        "plan_value",
        "plan_megas",
        "plan_description",
    ];

    protected static function booted() {
        static::creating(function ($model) {
            $latestPlanId = static::max("plan_id");
            $nextNumber = $latestPlanId
                ? intval(substr($latestPlanId, 4)) + 1
                : 1;
            $model->plan_id =
                "PLN-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public function contracts() {
        return $this->hasMany(ConContract::class, "_id", "_id");
    }
}
