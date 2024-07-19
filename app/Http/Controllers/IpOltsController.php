<?php
namespace App\Http\Controllers;
use App\Http\Requests\OltsRequest;
use Inertia\Inertia;
use App\Models\IpOlts;
use Illuminate\Http\Request;
class IpOltsController extends Controller
{
    public function index()
    {
        return Inertia::render("Ips/Olt", [
            "Olts" => IpOlts::all(),
        ]);
    }

    public function store(OltsRequest $request)
    {
        $validatedData = $request->validated();
        IpOlts::create($validatedData);
        return to_route("olts.index");
    }

    public function update(OltsRequest $request, $id)
    {
        $ipOlts = IpOlts::findOrFail($id);
        $validatedData = $request->validated();
        $ipOlts->update($validatedData);
        return to_route("olts.index");
    }

    public function destroy($id)
    {
        IpOlts::findOrFail($id)->delete();
        return to_route("olts.index");
    }

    public function destroyMultiple(Request $request)
    {
        $ids = $request->input("ids");
        $oltss = IpOlts::whereIn("olt_id", $ids)->get();

        foreach ($oltss as $olt) {
            $olt->delete();
        }
        return to_route("olts.index");
    }

}
