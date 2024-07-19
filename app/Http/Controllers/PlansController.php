<?php

namespace App\Http\Controllers;
use App\Http\Requests\PlansRequest;
use Illuminate\Http\Request;
use App\Models\Plans;
use Inertia\Inertia;
class PlansController extends Controller
{
    public function index()
    {
        return Inertia::render("plans/Plans", [
            "Plans" => Plans::all(),
        ]);
    }

    public function store(PlansRequest $request)
    {
        $validatedData = $request->validated();
        Plans::create($validatedData);
        return to_route("plans.index");
    }

    public function update(PlansRequest $request, $id)
    {
        $plans = Plans::findOrFail($id);
        $validatedData = $request->validated();
        $plans->update($validatedData);
        return to_route("plans.index");
    }

    public function destroy($id)
    {
        Plans::findOrFail($id)->delete();
        return to_route("plans.index");
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input("ids");
        $plans = Plans::whereIn("plan_id", $ids)->get();

        foreach ($plans as $pla) {
            $pla->delete();
        }
        return to_route("plans.index");

        
    }
}
