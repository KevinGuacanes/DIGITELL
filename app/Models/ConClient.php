<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ConClient extends Model implements Auditable {
    use HasFactory;

    use \OwenIt\Auditing\Auditable;

    protected $table = "con_clients";

    protected $primaryKey = "client_id";
    public $incrementing = false;
    protected $keyType = "string";
    protected $fillable = [
        "client_id",
        "sector_id",
        "client_name",
        "client_email",
        "address",
        "reference",
    ];
    public $timestamps = false;

    public static function getClients() {
        return self::with("sector")
            ->get()
            ->map(function ($client) {
                return [
                    "client_id" => $client->client_id,
                    "sector_id" => $client->sector_id,
                    "sector_name" => $client->sector->sector_name,
                    "client_name" => $client->client_name,
                    "client_email" => $client->client_email,
                    "address" => $client->address,
                    "reference" => $client->reference,
                ];
            });
    }
    public static function getClientAllInfo(): array {
        // Cargar clientes con relaciones anidadas
        $clients = self::with("sector.parish.canton.province")->get();

        // Mapear los resultados para estructurar la salida deseada
        return $clients
            ->map(function ($client) {
                return [
                    "client_id" => $client->client_id,
                    "client_name" => $client->client_name,
                    "client_email" => $client->client_email,
                    "address" => $client->address,
                    "reference" => $client->reference,
                    "sector_id" => $client->sector_id,
                    "sector_name" => $client->sector->sector_name,
                    "parish_name" => $client->sector->parish->parish_name,
                    "canton_name" =>
                        $client->sector->parish->canton->canton_name,
                    "province_name" =>
                        $client->sector->parish->canton->province
                            ->province_name,
                ];
            })
            ->toArray(); // Convertir la colección a un array para retorno
    }

    public static function getClientInfo(): array {
        $clients = self::all();

        return $clients
            ->map(function ($client) {
                return (object) [
                    "client_id" => $client->client_id,
                    "client_name" => "{$client->client_id}, {$client->client_name}",
                ];
            })
            ->toArray();
    }

    public function sector() {
        return $this->belongsTo(ConSector::class, "sector_id", "sector_id");
    }

    public function phones() {
        return $this->hasMany(ConPhone::class, "client_id", "client_id");
    }
    public function contracts() {
        return $this->hasMany(ConContract::class, "client_id", "client_id");
    }
}
