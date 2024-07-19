<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ConContract extends Model implements Auditable {
    use HasFactory;
    use \OwenIt\Auditing\Auditable;

    protected $auditStrict = true;

    protected $table = "con_contracts";
    protected $primaryKey = "contract_num";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "contract_num",
        "client_id",
        "ip_address",
        "plan_id",
        "discount_id",
        "status_id",
        "contract_id",
        "installation_date",
        "maximum_date",
    ];
    public $timestamps = false;

    public static function getContracts() {
        return self::with("client", "statu", "plan", "ipaddress") // Incluir relaciones

            ->get()
            ->map(function ($contract) {
                return [
                    "contract_num" => $contract->contract_num,
                    "contract_id" => $contract->contract_id,
                    "client_id" => $contract->client->client_id,
                    "client_name" => $contract->client->client_name,

                    "status_id" => $contract->status_id,
                    "status_name" => $contract->statu->status_name,

                    "discount_id" => $contract->discount_id,
                    "discount_name" => $contract->discount->discount_name,

                    "ip_address" => $contract->ipaddress->ip_address,
                    "plan_id" => $contract->plan->plan_id,
                    "plan_name" => $contract->plan->plan_name,

                    "installation_date" => $contract->installation_date,
                    "maximum_date" => $contract->maximum_date,
                ];
            });
    }
    public static function getContractsNotAnnulment() {
        return self::with("client", "statu", "plan", "ipaddress") // Incluir relaciones
            ->where("status_id", "!=", "STS-0002") // Filtrar por estado diferente a "STS-0002"
            ->get()
            ->map(function ($contract) {
                return [
                    "contract_num" => $contract->contract_num,
                    "contract_id" => $contract->contract_id,
                    "client_id" => $contract->client->client_id,
                    "client_name" => $contract->client->client_name,

                    "status_id" => $contract->status_id,
                    "status_name" => $contract->statu->status_name,

                    "discount_id" => $contract->discount_id,
                    "discount_name" => $contract->discount->discount_name,

                    "ip_address" => $contract->ipaddress->ip_address,
                    "plan_id" => $contract->plan->plan_id,
                    "plan_name" => $contract->plan->plan_name,
                ];
            });
    }
    public static function getContractsAnnulment() {
        return self::with("client", "statu", "plan", "ipaddress") // Incluir relaciones
            ->where("status_id", "=", "STS-0002") // Filtrar por estado diferente a "STS-0002"
            ->get()
            ->map(function ($contract) {
                return [
                    "contract_num" => $contract->contract_num,
                    "contract_id" => $contract->contract_id,
                    "client_id" => $contract->client->client_id,
                    "client_name" => $contract->client->client_name,

                    "status_id" => $contract->status_id,
                    "status_name" => $contract->statu->status_name,

                    "discount_id" => $contract->discount_id,
                    "discount_name" => $contract->discount->discount_name,

                    "ip_address" => $contract->ipaddress->ip_address,
                    "plan_id" => $contract->plan->plan_id,
                    "plan_name" => $contract->plan->plan_name,
                ];
            });
    }
    /*
    public function order() {
        return $this->belongsTo(
            SupWorkOrders::class,
            "work_order_id",
            "work_order_id"
        );
    }*/

    public function client() {
        return $this->belongsTo(ConClient::class, "client_id", "client_id");
    }
    public function ipaddress() {
        return $this->belongsTo(Ips::class, "ip_address", "ip_address");
    }
    public function plan() {
        return $this->belongsTo(Plans::class, "plan_id", "plan_id");
    }
    public function statu() {
        return $this->belongsTo(ConStatus::class, "status_id", "status_id");
    }
    public function discount() {
        return $this->belongsTo(
            ConDiscount::class,
            "discount_id",
            "discount_id"
        );
    }
}
