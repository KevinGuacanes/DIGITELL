<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConContract;
use App\Models\ConClient;

use App\Models\User;
use App\Models\SupTypeReport;
use App\Models\SupWorkOrder;
use App\Http\Requests\SupWorkOrderRequest;
use App\Models\ConPhone;
use App\Models\ConSector;
use App\Models\Plans;

use App\Models\Ips;
use App\Models\IpOlts;
use App\Models\IpLastMile;
use App\Models\SupTypeOrder;
use App\Models\IpDistribution;
use Inertia\Inertia;

use Illuminate\Support\Facades\Log;

class SupWorkOrderController extends Controller {
    public function index() {
        return Inertia::render("Support/WorkOrder", $this->getCommonData());
    }

    public function orderTecnicoIndex() {
        return Inertia::render(
            "orderTecnico/orderTecnico",
            $this->getCommonData()
        );
    }
    private function getCommonData() {
        $user = auth()->user();
        //dd('User ID: ' . $user->id);
        // dd('User role: ' , $user->roles);

        $data = [
            "Employees" => User::whereHas('roles', function($query) {
                $query->where('name', 'tecnico');
            })->get(),
            "Clients" => ConClient::all(),
            "Plans" => Plans::all(),
            "Olts" => IpOlts::all(),
            "Distributions" => IpDistribution::all(),
            "LastMiles" => IpLastMile::all(),
            "Ips" => Ips::all(),
            "Sector" => ConSector::all(),
            "TypeReports" => SupTypeReport::all(),
            "TypeOrders" => SupTypeOrder::all(),
            "Contracts" => ConContract::all(),
            "Phones" => ConPhone::all(),
        ];

        $isTecnico = $user->roles->pluck('name')->contains('tecnico');
        $isSuperUser = $user->username == 'superuser'; 
    if ($isTecnico && !$isSuperUser) {
        $data["WorkOrders"] = SupWorkOrder::where("employee_id", $user->id)->with(["typeReport", "employee", "contract"])->get()->map(function ($workOrder) {
            return [
                "work_order_id" => $workOrder->work_order_id,
                "employee_id" => $workOrder->employee_id,
                "employee_name" => $workOrder->employee->name,
                "type_report_id" => $workOrder->type_report_id,
                "name_type_report" => $workOrder->typeReport->name_type_report,
                "contract_num" => $workOrder->contract_num,
                "contract_client" => $workOrder->contract->client->client_name,
                "order_channel" => $workOrder->order_channel,
                "issue_date" => $workOrder->issue_date,
                "order_precedents" => $workOrder->order_precedents,
                "order_status" => $workOrder->order_status,
                "order_abclaim" => $workOrder->order_abclaim,
                "solution_date" => $workOrder->solution_date,
                "order_initial_abis" => $workOrder->order_initial_abis,
                "order_initial_potency" => $workOrder->order_initial_potency,
                "order_final_abis" => $workOrder->order_final_abis,
                "order_initial_diagnosis" => $workOrder->order_initial_diagnosis,
                "order_solution" => $workOrder->order_solution,
                "order_final_potency" => $workOrder->order_final_potency,
                "order_final_diagnosis" => $workOrder->order_final_diagnosis,
                "value_due" => $workOrder->value_due,
            ];
        });
    } else {
        $data["WorkOrders"] = SupWorkOrder::getWorkOrders();
    }

        return $data;
    }

    public function store(SupWorkOrderRequest $request) {
        SupWorkOrder::create($request->validated());
        return to_route("workorder.index");
    }

    public function update(SupWorkOrderRequest $request, $id) {
        $workOrder = SupWorkOrder::findOrFail($id);
        $workOrder->update($request->validated());
        return to_route("workorder.index");
    }
    public function updateT(SupWorkOrderRequest $request, $id) {
        $workOrder = SupWorkOrder::findOrFail($id);
        $workOrder->update($request->validated());
        return to_route("orderTecnico.index");
    }

    public function destroy($id) {
        SupWorkOrder::find($id)->delete();
        return to_route("workorder.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $work = SupWorkOrder::whereIn("work_order_id", $ids)->get();

        foreach ($work as $order) {
            $order->delete();
        }
        return to_route("workorder.index");
    }
    public function updateStatus(Request $request) {
        try {
            $workOrderIds = $request->input("workOrderIds");
            $newStatus = $request->input("newStatus");

            $updated = SupWorkOrder::whereIn(
                "work_order_id",
                $workOrderIds
            )->update(["order_status" => $newStatus]);

            Log::info("Órdenes actualizadas: " . $updated);

            return redirect()
                ->route("workorder.index")
                ->with(
                    "success",
                    "Órdenes de trabajo actualizadas correctamente."
                );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()
                ->route("workorder.index")
                ->with(
                    "error",
                    "Error al actualizar las órdenes de trabajo: " .
                        $e->getMessage()
                );
        }
    }
    
    public function updateStatus2(Request $request) {
        try {
            $workOrderIds = $request->input("workOrderIds");
            $newStatus = $request->input("newStatus");

            $updated = SupWorkOrder::whereIn(
                "work_order_id",
                $workOrderIds
            )->update(["order_status" => $newStatus]);

            Log::info("Órdenes actualizadas: " . $updated);

            return redirect()
                ->route("orderTecnico.index")
                ->with(
                    "success",
                    "Órdenes de trabajo actualizadas correctamente."
                );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return redirect()
                ->route("orderTecnico.index")
                ->with(
                    "error",
                    "Error al actualizar las órdenes de trabajo: " .
                        $e->getMessage()
                );
        }
    }
}
