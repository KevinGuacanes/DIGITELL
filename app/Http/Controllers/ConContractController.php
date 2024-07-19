<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ContractRequest;
use App\Models\ConContract;
use App\Models\ConClient;
use App\Models\Plans;
use App\Models\Ips;
use App\Models\IpOlts;
use App\Models\IpLastMile;
use App\Models\IpDistribution;
use App\Models\ConDiscount;
use App\Models\ConStatus;
use App\Models\ConPhone;
use App\Models\User;
use App\Models\SupWorkOrder;
use App\Models\SupTypeReport;
use App\Models\SupTypeOrder;
use Inertia\Inertia;

class ConContractController extends Controller {
    public function index() {
        return Inertia::render("Contracts/contract", [
            "Clients" => ConClient::getClientAllInfo(),
            "Plans" => Plans::all(),
            "Olts" => IpOlts::all(),
            "LastMiles" => IpLastMile::all(),
            "Distributions" => IpDistribution::all(),
            "Ips" => Ips::all(),
            "Status" => ConStatus::all(),
            "Discounts" => ConDiscount::all(),
            "Phones" => ConPhone::all(),
            "Contracts" => ConContract::getContracts(),
            "Employees" => User::whereHas('roles', function($query) {
                $query->where('name', 'tecnico');  })->get(),
            "WorkOrders" => SupWorkOrder::getOrderID(),
            "TypeReports" => SupTypeReport::all(),
            "TypeOrders" => SupTypeOrder::all(),
        ]);
    }
    public function index2() {
        return Inertia::render("AnnulmentContract/annulment", [
            "Contracts" => ConContract::getContractsNotAnnulment(),
        ]);
    }
    public function index3() {
        return Inertia::render("AnnulmentContract/report", [
            "Contracts" => ConContract::getContractsAnnulment(),
        ]);
    }

    public function store(ContractRequest $contractRequest) {
        $validatedData = $contractRequest->validated();

        // Encontrar la IP y actualizarla si existe
        $ip = Ips::find($validatedData["ip_address"]);
        if ($ip) {
            $ip->ip_status = "1";
            $ip->last_mile_nap_id = $validatedData["last_mile_nap_id"];
        }

        // Crear el contrato
        $contract = ConContract::create($validatedData);
        $ip->save();

        // Redirigir a la página de contratos
        return to_route("contracts.index");
    }
    public function update(ContractRequest $contractRequest, $id) {
        // Encontrar el contrato existente
        $contract = ConContract::findOrFail($id);

        // Validar y obtener los datos del request
        $validatedData = $contractRequest->validated();

        // Encontrar la IP anterior y actualizarla si existe
        $oldIp = Ips::find($contract->ip_address);
        if ($oldIp) {
            $oldIp->ip_status = "0"; // Cambiar estado de la IP anterior a 0
            $oldIp->last_mile_nap_id = null; // Resetear last_mile_id de la IP anterior
        }

        // Encontrar la nueva IP y actualizarla si existe
        $newIp = Ips::find($validatedData["ip_address"]);
        if ($newIp) {
            $newIp->ip_status = "1"; // Cambiar estado de la nueva IP a 1
            $newIp->last_mile_nap_id = $validatedData["last_mile_nap_id"]; // Actualizar last_mile_id de la nueva IP
        }

        $contract->ip_address = $validatedData["ip_address"];

        // Actualizar el contrato con los datos validados
        $contract->update($validatedData);
        $oldIp->save();
        $newIp->save();
        // Redirigir a la página de contratos
        return to_route("contracts.index");
    }

    public function destroy($id) {
        $contract = ConContract::find($id);

        if ($contract) {
            $ip = Ips::find($contract->ip_address);

            if ($ip && $ip->ip_status !== "0") {
                $ip->ip_status = "0";
                $ip->last_mile_nap_id = null;
                $ip->save();
            }

            $contract->status_id = "STS-0002"; // Por ejemplo, cambia "STS-0002" por el estado que necesites

            $contract->save();

            return to_route("contracts.index2");
        }

        // Manejar el caso donde el contrato no se encuentre
        return redirect()
            ->route("contracts2.index")
            ->with("error", "Contract not found.");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");

        // Encuentra los contratos con los IDs dados
        $contracts = ConContract::whereIn("contract_num", $ids)->get();

        // Cambia el estado de cada contrato y su dirección IP asociada
        foreach ($contracts as $contract) {
            // Cambiar el estado de la dirección IP asociada al contrato
            $ip = Ips::find($contract->ip_address);
            if ($ip && $ip->ip_status !== "0") {
                $ip->ip_status = "0";
                $ip->last_mile_nap_id = null;
                $ip->save();
            }

            // Cambiar el estado del contrato a inactivo u otro estado deseado
            $contract->status_id = "STS-0002"; // Cambia "STS-0002" por el estado que necesites
            $contract->save();
        }

        return to_route("contracts2.index");
    }
}
