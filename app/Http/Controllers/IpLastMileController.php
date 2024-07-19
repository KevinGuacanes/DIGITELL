<?php

namespace App\Http\Controllers;

use App\Http\Requests\LastMileNapsRequest;
use Illuminate\Http\Request;
use App\Models\IpLastMile;
use App\Models\IpDistribution;
use App\Models\IpOlts;
use Inertia\Inertia;
class IpLastMileController extends Controller {
    public function index() {
        return Inertia::render("Ips/LastMileNaps", [
           "Olts" => IpOlts::all(),
            "DistributionNaps" => IpDistribution::getDistributionNaps(),
            "LastMileNaps" => IpLastMile::getLastMileNaps(),
        ]);
    }

    public function store(LastMileNapsRequest $request) {
       IpLastMile:: create($request->validated());
    
        return redirect()->route("lastmileNaps.index");
    }
  

    public function update(LastMileNapsRequest $request, $id) {
        $lastmileNap = IpLastMile::findOrFail($id);
        $lastmileNap->update($request->validated());
        return redirect()->route("lastmileNaps.index");
    }

    public function destroy($id) {
        IpLastMile::findOrFail($id)->delete();
        return redirect()->route("lastmileNaps.index");
    }

    public function destroyMultiple(Request $request) {

          $ids = $request->input("ids");
        $lastmi = IpLastMile::whereIn("last_mile_nap_id", $ids)->get();

        foreach ($lastmi as $las) {
            $las->delete();
        }
        return to_route("lastmileNaps.index");
    }

}
