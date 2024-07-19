<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\TypeRequest;
use App\Models\InvMovementType;
use Inertia\Inertia;

class InvMovementTypeController extends Controller {
    public function index() {
        return Inertia::render("Inventory/Types", [
            "Types" => InvMovementType::all(),
        ]);
    }
    public function store(TypeRequest $typeRequest) {
        InvMovementType::create($typeRequest->validated());
        return to_route("types.index");
    }
    public function update(TypeRequest $typeRequest, $id) {
        $type = InvMovementType::findOrFail($id);
        $type->update($typeRequest->validated());
        return to_route("types.index");
    }
    public function destroy($id) {
        InvMovementType::find($id)->delete();
        return to_route("types.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        InvMovementType::whereIn("movement_type_id", $ids)->delete();
        return to_route("types.index");
    }
}
