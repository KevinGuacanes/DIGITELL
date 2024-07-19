<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConPhone;
use App\Http\Requests\PhoneRequest;
use App\Models\ConClient;
use Inertia\Inertia;

class ConPhoneController extends Controller {
    public function index() {
        return Inertia::render("Customers/Phone", [
            "Clients" => ConClient::getClientInfo(),
            "Phones" => ConPhone::getPhones(),
        ]);
    }

    public function store(PhoneRequest $phoneRequest) {
        ConPhone::create($phoneRequest->validated());
        return to_route("phones.index");
    }

    public function update(PhoneRequest $phoneRequest, $phone) {
        $phoneModel = ConPhone::findOrFail($phone);
        $phoneModel->update($phoneRequest->validated());
        return to_route("phones.index");
    }

    public function destroy($id) {
        ConPhone::find($id)->delete();
        return to_route("phones.index");
    }
    public function destroyMultiple(Request $request) {
        $phoneNumbers = $request->input("ids");

        $phones = ConPhone::whereIn("phone_number", $phoneNumbers)->get();

        foreach ($phones as $phone) {
            $phone->delete();
        }

        return to_route("phones.index");
    }
}
