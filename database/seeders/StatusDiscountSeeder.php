<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ConDiscount;
use App\Models\ConStatus;

class StatusDiscountSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $status = [
            [
                "status_id" => "STS-0001",
                "status_name" => "Activo",
                "status_description" => "Contrato que está en uso",
            ],
            [
                "status_id" => "STS-0002",
                "status_name" => "Anulado",
                "status_description" => "Contrato que ha sido anulado",
            ],
            [
                "status_id" => "STS-0003",
                "status_name" => "Cortado",
                "status_description" => "Contrato que ha sido cortado",
            ],
            [
                "status_id" => "STS-0004",
                "status_name" => "Facturar",
                "status_description" => "Contrato pendiente de facturación",
            ],
        ];
        $discount = [
            [
                "discount_id" => "DST-0001",
                "discount_name" => "Ninguno",
                "discount_description" => "Sin descuento aplicado",
            ],
            [
                "discount_id" => "DST-0002",
                "discount_name" => "LOPAM",
                "discount_description" => "Descuento LOPAM",
            ],
            [
                "discount_id" => "DST-0003",
                "discount_name" => "CONADIS",
                "discount_description" =>
                    "Descuento por discapacidad (CONADIS)",
            ],
            [
                "discount_id" => "DST-0004",
                "discount_name" => "Retención",
                "discount_description" => "Descuento por retención de cliente",
            ],
            [
                "discount_id" => "DST-0005",
                "discount_name" => "Dos planes",
                "discount_description" =>
                    "Descuento por la contratación de dos planes",
            ],
        ];

        ConStatus::insert($status);
        ConDiscount::insert($discount);
    }
}
