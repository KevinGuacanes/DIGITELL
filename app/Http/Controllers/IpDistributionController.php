<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\DistributionNapsRequest;
use App\Models\IpDistribution;
use App\Models\IpOlts;

class IpDistributionController extends Controller {
    public function index() {
        //dd($this-> getAvailablePorts('OLT-01') );
        return Inertia::render("Ips/DistributionNaps", [
            "Olts" => IpOlts::all(),
            "DistributionNaps" => IpDistribution::getDistributionNaps(),
        ]);
      
    }

    public function store(DistributionNapsRequest $request) {
        IpDistribution::create($request->validated());
        return redirect()->route("distributionNaps.index");
    }

    public function update(DistributionNapsRequest $request, $id) {
        $distributionNap = IpDistribution::findOrFail($id);
        $distributionNap->update($request->validated());
        return redirect()->route("distributionNaps.index");
    }

    public function destroy($id) {
        IpDistribution::find($id)->delete();
        return to_route("distributionNaps.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $distribu = IpDistribution::whereIn("distribution_nap_id", $ids)->get();

        foreach ($distribu as $dist) {
            $dist->delete();
        }
        return to_route("distributionNaps.index");
    
    }

    public function getAvailablePorts($oltId) {
        $olt = IpOlts::findOrFail($oltId);
        $totalPorts = $olt->olt_ports;

        $usedPorts = IpDistribution::where("olt_id", $oltId)
            ->pluck("olt_ports")
            ->toArray();

        $availablePorts = range(1, $totalPorts);
        $availablePorts = array_diff($availablePorts, $usedPorts);

        return $availablePorts;
    }
}
