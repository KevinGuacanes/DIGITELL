<?php

namespace App\Http\Controllers;

use App\Http\Requests\CantonRequest;
use App\Models\ConCanton;
use App\Models\ConProvince;
use Illuminate\Http\Request;
use Inertia\Inertia;

//use App\Models\User;

class ConCantonController extends Controller {
    public function index() {
        // $rolePermissions = User::with("roles.permissions")->find(auth()->id());

        return Inertia::render("Customers/Canton", [
            "Provinces" => ConProvince::all(),
            "Cantons" => ConCanton::getCantons(),
        ]);
    }

    public function store(CantonRequest $cantonRequest) {
        ConCanton::create($cantonRequest->validated());
        return to_route("cantons.index");
    }

    public function update(CantonRequest $cantonRequest, $id) {
        $canton = ConCanton::findOrFail($id);
        $canton->update($cantonRequest->validated());
        return to_route("cantons.index");
    }

    public function destroy($id) {
        ConCanton::find($id)->delete();
        return to_route("cantons.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $cantons = ConCanton::whereIn("canton_id", $ids)->get();

        foreach ($cantons as $canton) {
            $canton->delete();
        }
        return to_route("cantons.index");
    }
}
