<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ProductRequest;
use App\Models\InvProduct;
use Inertia\Inertia;

class InvProductController extends Controller {
    public function index() {
        return Inertia::render("Inventory/Product", [
            "Products" => InvProduct::all(),
        ]);
    }
    public function store(ProductRequest $productRequest) {
        InvProduct::create($productRequest->validated());
        return to_route("products.index");
    }
    public function update(ProductRequest $productRequest, $id) {
        $product = InvProduct::findOrFail($id);
        $product->update($productRequest->validated());
        return to_route("products.index");
    }
    public function destroy($id) {
        InvProduct::find($id)->delete();
        return to_route("products.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        InvProduct::whereIn("product_id", $ids)->delete();
        return to_route("products.index");
    }
}
