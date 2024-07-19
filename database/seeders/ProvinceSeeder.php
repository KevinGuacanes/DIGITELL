<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ConProvince;

class ProvinceSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $provinces = [
            ["province_id" => "PRO-01", "province_name" => "Azuay"],
            ["province_id" => "PRO-02", "province_name" => "Bolívar"],
            ["province_id" => "PRO-03", "province_name" => "Cañar"],
            ["province_id" => "PRO-04", "province_name" => "Carchi"],
            ["province_id" => "PRO-05", "province_name" => "Cotopaxi"],
            ["province_id" => "PRO-06", "province_name" => "Chimborazo"],
            ["province_id" => "PRO-07", "province_name" => "El Oro"],
            ["province_id" => "PRO-08", "province_name" => "Esmeraldas"],
            ["province_id" => "PRO-09", "province_name" => "Guayas"],
            ["province_id" => "PRO-10", "province_name" => "Imbabura"],
            ["province_id" => "PRO-11", "province_name" => "Loja"],
            ["province_id" => "PRO-12", "province_name" => "Los Ríos"],
            ["province_id" => "PRO-13", "province_name" => "Manabí"],
            ["province_id" => "PRO-14", "province_name" => "Morona Santiago"],
            ["province_id" => "PRO-15", "province_name" => "Napo"],
            ["province_id" => "PRO-16", "province_name" => "Pastaza"],
            ["province_id" => "PRO-17", "province_name" => "Pichincha"],
            ["province_id" => "PRO-18", "province_name" => "Tungurahua"],
            ["province_id" => "PRO-19", "province_name" => "Zamora Chinchipe"],
            ["province_id" => "PRO-20", "province_name" => "Galápagos"],
            ["province_id" => "PRO-21", "province_name" => "Sucumbíos"],
            ["province_id" => "PRO-22", "province_name" => "Orellana"],
            ["province_id" => "PRO-23", "province_name" => "Santo Domingo de los Tsáchilas"],
            ["province_id" => "PRO-24", "province_name" => "Santa Elena"],
        ];

        ConProvince::insert($provinces);
    }
}
