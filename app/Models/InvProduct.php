<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class InvProduct extends Model implements Auditable {
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    
    protected $auditStrict = true;

    protected $table = "inv_products";
    protected $primaryKey = "product_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "product_id",
        "product_name",
        "product_description",
        "product_price",
        "product_quantity",
        "product_brand",
        "product_vat",
    ];
    public $timestamps = false;

    protected static function booted() {
        static::creating(function ($model) {
            $latestProductsId = static::max("product_id");
            $nextNumber = $latestProductsId
                ? intval(substr($latestProductsId, 4)) + 1
                : 1;
            $model->product_id =
                "PRO-" . str_pad($nextNumber, 2, "0", STR_PAD_LEFT);
        });
    }

    public function movements() {
        return $this->hasMany(InvMovement::class, "product_id");
    }
}
