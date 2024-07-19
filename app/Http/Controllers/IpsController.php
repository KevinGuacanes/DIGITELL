<?php

namespace App\Http\Controllers;

use App\Http\Requests\IpsRequest;
use App\Models\IpLastMile;
use App\Models\Ips;
use Inertia\Inertia;

class IpsController extends Controller
{
    public function index()
    {
        return Inertia::render("Ips/Ip", [
            "Ips" => Ips::getIps(),
            "lastMileNaps"=> IpLastMile::all(),
        ]);
    }

    public function store(IpsRequest $request)
    {
        Ips::create($request->all());
        return redirect()->route('ips.index');
    }
    
    public function update(IpsRequest $request, $id)
    {
        $ip = Ips::find($id);
        $ip->update($request->all());
        return redirect()->route('ips.index');
    }
}
