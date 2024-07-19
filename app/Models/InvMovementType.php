<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvMovementType extends Model {
    use HasFactory;
    protected $table = "inv_movement_types";
    protected $primaryKey = "movement_type_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["movement_type_id", "movement_type_description"];
    public $timestamps = false;

    protected static function booted() {
        static::creating(function ($model) {
            $latestTypesId = static::max("movement_type_id");
            $nextNumber = $latestTypesId
                ? intval(substr($latestTypesId, 4)) + 1
                : 1;
            $model->movement_type_id =
                "TPM-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }
    public function movements() {
        return $this->hasMany(InvMovement::class, "movement_type_id");
    }
}
