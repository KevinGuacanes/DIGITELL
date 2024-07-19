<?php

namespace App\Http\Controllers;

use App\Models\Audit;
use App\Services\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller {
    protected $dashboardService;

    public function __construct(DashboardService $dashboardService) {
        $this->dashboardService = $dashboardService;
    }

    public function index() {
        $audits = Audit::getAll();
        return Inertia::render("Dashboard", [
            "audits" => $audits,
            "salesFunnelData" => $this->dashboardService->getSalesFunnelData(),
            "clientsByPlanData" => $this->dashboardService->getClientsByPlanData(),
            "monthlySalesData" => $this->dashboardService->getMonthlySalesData(),
            "clientsByParishData" => $this->dashboardService->getClientsByParishData(),
            "discountsAppliedData" => $this->dashboardService->getDiscountsAppliedData(),
            "totalContractsCount" => $this->dashboardService->getTotalContractsCount(),
            "totalPlansCount" => $this->dashboardService->getTotalPlansCount(),
            "totalEmployees" => $this->dashboardService->getTotalEmployees(),
            "managedOrders" => $this->dashboardService->getManagedOrders(),
            "managedOrdersPending" => $this->dashboardService->getManagedOrdersPending(),
            "mostUsedPlan" => $this->dashboardService->getMostUsedPlan(),
            "ordersByType" => $this->dashboardService->getOrdersByType(),
            "averageResolutionTime" => $this->dashboardService->getAverageResolutionTime(),
        ]);
    }
}
