<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SupTypeOrder;
use App\Models\SupTypeReport;
use App\Http\Requests\SupTypeReportRequest;

class SupTypeReportController extends Controller
{
    public function index() {
        return Inertia::render("Support/TypeReport", [
            "Orders" => SupTypeOrder::all(),
            "Reports" => SupTypeReport::getTypeReports(),
        ]);
    }


    public function store(SupTypeReportRequest $SupTypeReportRequest) {
        SupTypeReport::create($SupTypeReportRequest->validated());
        return to_route("typereport.index");
    }

    public function update(SupTypeReportRequest $SupTypeReportRequest, $id) {
        $typeReport = SupTypeReport::findOrFail($id);
        $typeReport->update($SupTypeReportRequest->validated());
        return to_route("typereport.index");
    }

    public function destroy($id) {
        SupTypeReport::find($id)->delete();
        return to_route("typereport.index");
    }

    public function destroyMultiple(Request $request) {

        $ids = $request->input("ids");
        $supty = SupTypeReport::whereIn("type_report_id", $ids)->get();

        foreach ($supty as $repor) {
            $repor->delete();
        }
        return to_route("typereport.index");
    }
}
