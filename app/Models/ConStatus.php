<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConStatus extends Model {
    use HasFactory;
    protected $table = "con_status";
    protected $primaryKey = "status_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = ["status_id", "status_name", "status_description"];
    public $timestamps = false;

    public function contracts() {
        return $this->hasMany(ConContract::class, "status_id", "status_id");
    }
}
