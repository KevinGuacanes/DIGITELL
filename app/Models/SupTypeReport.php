<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class SupTypeReport extends Model implements Auditable {
    use HasFactory;
    use \OwenIt\Auditing\Auditable;
    protected $auditStrict = true;

    protected $table = "sup_type_report";

    protected $primaryKey = "type_report_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "type_report_id",
        "type_order_id",
        "name_type_report",
        "description_type_report",
    ];
    public $timestamps = false;
    public static function getTypeReports() {
        return self::with("typeOrder")
            ->get()
            ->map(function ($typeOrder) {
                return [
                    "type_report_id" => $typeOrder->type_report_id,
                    "type_order_id" => $typeOrder->type_order_id,
                    "name_type_order" => $typeOrder->typeOrder->name_type_order,
                    "name_type_report" => $typeOrder->name_type_report,
                    "description_type_report" =>
                        $typeOrder->description_type_report,
                ];
            });
    }

    protected static function booted() {
        static::creating(function ($model) {
            $latestTypeReport = static::max("type_report_id");
            $nextNumber = $latestTypeReport
                ? intval(substr($latestTypeReport, 4)) + 1
                : 1;
            $model->type_report_id =
                "TIR-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }
    public function typeOrder() {
        return $this->belongsTo(
            SupTypeOrder::class,
            "type_order_id",
            "type_order_id"
        );
    }
    public function WorkOrders() {
        return $this->hasMany(
            SupWorkOrder::class,
            "type_report_id",
            "type_report_id"
        );
    }
}
