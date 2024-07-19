<?php

namespace App\Http\Controllers;

use App\Http\Requests\ParishRequest;
use App\Models\ConCanton;
use App\Models\ConParish;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConParishController extends Controller {
    public function index() {
        return Inertia::render("Customers/Parish", [
            "Cantons" => ConCanton::all(),
            "Parishes" => ConParish::getParishes(),
        ]);
    }

    public function store(ParishRequest $parishRequest) {
        ConParish::create($parishRequest->validated());
        return to_route("parishes.index");
    }

    public function update(ParishRequest $parishRequest, $id) {
        $parish = ConParish::findOrFail($id);
        $parish->update($parishRequest->validated());
        return to_route("parishes.index");
    }

    public function destroy($id) {
        ConParish::find($id)->delete();
        return to_route("parishes.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");

        $parishes = ConParish::whereIn("parish_id", $ids)->get();

        foreach ($parishes as $parish) {
            $parish->delete();
        }

        return to_route("parishes.index");
    }
}
