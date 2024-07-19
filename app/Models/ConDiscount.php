<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConDiscount extends Model {
    use HasFactory;
    protected $table = "con_discounts";
    protected $primaryKey = "discount_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "discount_id",
        "discount_name",
        "discount_description",
    ];
    public $timestamps = false;

    public function contracts() {
        return $this->hasMany(ConContract::class, "discount_id", "discount_id");
    }
}
