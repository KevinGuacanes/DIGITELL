<?php

namespace App\Services;

use App\Models\ConContract;
use App\Models\Plans;
use App\Models\SupWorkOrder;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardService {
    public function getSalesFunnelData() {
        return ConContract::join(
            "con_status",
            "con_contracts.status_id",
            "=",
            "con_status.status_id"
        )
            ->groupBy("con_status.status_name")
            ->selectRaw("con_status.status_name, count(*) as count")
            ->orderBy("count", "desc")
            ->get();
    }

    public function getClientsByPlanData() {
        return ConContract::join(
            "pla_plans",
            "con_contracts.plan_id",
            "=",
            "pla_plans.plan_id"
        )
            ->groupBy("pla_plans.plan_id", "pla_plans.plan_name")
            ->selectRaw("pla_plans.plan_name, count(*) as count")
            ->orderBy("count", "desc")
            ->get();
    }

    public function getMostUsedPlan() {
        $plans = $this->getClientsByPlanData();

        if ($plans->isEmpty()) {
            return "Ninguno";
        }

        $mostUsedPlan = $plans->first();

        if ($mostUsedPlan->count == 0) {
            return "Ninguno";
        }

        return $mostUsedPlan->plan_name;
    }

    public function getMonthlySalesData() {
        return ConContract::selectRaw(
            'DATE_FORMAT(installation_date, "%Y-%m") as month, count(*) as count'
        )
            ->groupBy("month")
            ->orderBy("month")
            ->get();
    }

    public function getClientsByParishData() {
        return ConContract::join(
            "con_clients",
            "con_contracts.client_id",
            "=",
            "con_clients.client_id"
        )
            ->join(
                "con_sector",
                "con_clients.sector_id",
                "=",
                "con_sector.sector_id"
            )
            ->join(
                "con_parishes",
                "con_sector.parish_id",
                "=",
                "con_parishes.parish_id"
            )
            ->groupBy("con_parishes.parish_name")
            ->selectRaw("con_parishes.parish_name, count(*) as count")
            ->orderBy("count", "desc")
            ->get();
    }

    public function getDiscountsAppliedData() {
        return ConContract::join(
            "con_discounts",
            "con_contracts.discount_id",
            "=",
            "con_discounts.discount_id"
        )
            ->groupBy(
                "con_discounts.discount_id",
                "con_discounts.discount_name"
            )
            ->selectRaw("con_discounts.discount_name, count(*) as count")
            ->orderBy("count", "desc")
            ->get();
    }

    public function getTotalContractsCount() {
        return ConContract::count();
    }

    public function getTotalPlansCount() {
        return Plans::count();
    }

    public function getTotalEmployees() {
        $count = User::whereHas("roles")
            ->whereNotNull("email_verified_at")
            ->count();

        return $count;
    }

    public function getManagedOrders() {
        return SupWorkOrder::where("order_status", "Realizado")->count();
    }

    public function getManagedOrdersPending() {
        return SupWorkOrder::where("order_status", "Pendiente")->count();
    }

    public function getOrdersByType() {
        return DB::table("sup_work_orders")
            ->join(
                "sup_type_report",
                "sup_work_orders.type_report_id",
                "=",
                "sup_type_report.type_report_id"
            )
            ->join(
                "sup_type_order",
                "sup_type_report.type_order_id",
                "=",
                "sup_type_order.type_order_id"
            )
            ->select(
                "sup_type_order.name_type_order",
                DB::raw("count(*) as total")
            )
            ->groupBy("sup_type_order.name_type_order")
            ->orderBy("total", "desc")
            ->get();
    }

    public function getAverageResolutionTime() {
        return SupWorkOrder::select(
            DB::raw("DATE(issue_date) as date"),
            DB::raw(
                "AVG(TIMESTAMPDIFF(HOUR, issue_date, solution_date)) as avg_resolution_time"
            )
        )
            ->whereNotNull("solution_date")
            ->where("order_status", "Realizado")
            ->groupBy("date")
            ->orderBy("date", "asc")
            ->get();
    }
}
