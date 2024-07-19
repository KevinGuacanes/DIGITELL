<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class InvMovement extends Model implements Auditable {
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    
    protected $auditStrict = true;
    protected $table = "inv_movements";
    protected $primaryKey = "movement_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "movement_id",
        "product_id",
        "work_order_id",
        "movement_date",
        "movement_quantity",
        "movement_total",
        "movement_type",
    ];
    public $timestamps = false;

    protected static function booted() {
        static::creating(function ($model) {
            $latestMovementsId = static::max("movement_id");
            $nextNumber = $latestMovementsId
                ? intval(substr($latestMovementsId, 4)) + 1
                : 1;
            $model->movement_id =
                "MOV-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }
    public static function getMovements() {
        return self::with("product")
            ->get()
            ->map(function ($movement) {
                return [
                    "movement_id" => $movement->movement_id,
                    "product_id" => $movement->product_id,
                    "product_price" => $movement->product->product_price,
                    "product_quantity" => $movement->product->product_quantity,
                    "product_vat" => $movement->product->product_vat,
                    "product_name" => $movement->product->product_name,
                    "work_order_id" => $movement->work_order_id,
                    "movement_date" => $movement->movement_date,
                    "movement_quantity" => $movement->movement_quantity,
                    "movement_total" => $movement->movement_total,
                    "movement_type" => $movement->movement_type,
                ];
            });
    }

    public function order() {
        return $this->belongsTo(
            SupWorkOrder::class,
            "work_order_id",
            "work_order_id"
        );
    }
    public function product() {
        return $this->belongsTo(InvProduct::class, "product_id", "product_id");
    }
}
