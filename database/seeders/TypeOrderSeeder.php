<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SupTypeOrder;
class TypeOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'type_order_id' => 'TOR-001',
                'name_type_order' => 'Instalación de Servicio',
                'description_type_order' => 'Solicitud para la instalación de servicios de Internet.'
            ],
            [
                'type_order_id' => 'TOR-002',
                'name_type_order' => 'Soporte Técnico',
                'description_type_order' => 'Solicitud de soporte técnico para resolver problemas de conexión o configuración.'
            ],
            [
                'type_order_id' => 'TOR-003',
                'name_type_order' => 'Mantenimiento Programado',
                'description_type_order' => 'Solicitud para programar mantenimiento preventivo de la red.'
            ],
            [
                'type_order_id' => 'TOR-004',
                'name_type_order' => 'Cambio de Plan',
                'description_type_order' => 'Solicitud para cambiar el plan de servicio de Internet.'
            ],
            [
                'type_order_id' => 'TOR-005',
                'name_type_order' => 'Reporte de Interrupción del Servicio',
                'description_type_order' => 'Solicitud para reportar una interrupción del servicio de Internet.'
            ],
            [
                'type_order_id' => 'TOR-006',
                'name_type_order' => 'Consulta de Facturación',
                'description_type_order' => 'Solicitud para consultar problemas o dudas relacionadas con la facturación.'
            ],
        ];
        SupTypeOrder::insert($types);
    }
}
