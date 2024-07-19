<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\SectorRequest;
use App\Models\ConParish;
use App\Models\ConSector;
use Inertia\Inertia;

class ConSectorController extends Controller {
    public function index() {
        return Inertia::render("Customers/Sector", [
            "Parishes" => ConParish::all(),
            "Sectors" => ConSector::getSectors(),
        ]);
    }

    public function store(SectorRequest $sectorRequest) {
        ConSector::create($sectorRequest->validated());
        return to_route("sectors.index");
    }

    public function update(SectorRequest $sectorRequest, $id) {
        $sector = ConSector::findOrFail($id);
        $sector->update($sectorRequest->validated());
        return to_route("sectors.index");
    }

    public function destroy($id) {
        ConSector::find($id)->delete();
        return to_route("sectors.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");

        $sectors = ConSector::whereIn("sector_id", $ids)->get();

        foreach ($sectors as $sector) {
            $sector->delete();
        }

        return to_route("sectors.index");
    }
}
