<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\MovementRequest;
use App\Models\InvMovement;
use App\Models\InvProduct;
use App\Models\SupWorkOrder;
use Inertia\Inertia;

class InvMovementController extends Controller {
    public function index() {
        return Inertia::render("Inventory/Movement", [
            "Products" => InvProduct::all(),
            "Movements" => InvMovement::getMovements(),
            "Orders" => SupWorkOrder::getOrderType(),
        ]);
    }
    public function store(MovementRequest $movementRequest) {
        // Crear el movimiento y obtener la instancia creada
        $movement = InvMovement::create($movementRequest->validated());

        // Encontrar el producto correspondiente
        $product = InvProduct::findOrFail($movement->product_id);

        // Actualizar la cantidad del producto dependiendo del tipo de movimiento
        if ($movement->movement_type === "Entrada") {
            $product->product_quantity += $movement->movement_quantity;
        } elseif ($movement->movement_type === "Salida") {
            // Verificar que la cantidad no se vuelva negativa
            if ($product->product_quantity < $movement->movement_quantity) {
                return redirect()
                    ->back()
                    ->withErrors(
                        "La cantidad del producto no puede ser negativa."
                    );
            }
            $product->product_quantity -= $movement->movement_quantity;
        }

        // Guardar los cambios en el producto
        $product->save();
        return to_route("movements.index");
    }
    public function update(MovementRequest $movementRequest, $id) {
        $movement = InvMovement::findOrFail($id);
        $movement->update($movementRequest->validated());
        $product = InvProduct::findOrFail($movement->product_id);

        if ($movement->movement_type === "Entrada") {
            $product->product_quantity += $movement->movement_quantity;
        } elseif ($movement->movement_type === "Salida") {
            if ($product->product_quantity < $movement->movement_quantity) {
                return redirect()
                    ->back()
                    ->withErrors(
                        "La cantidad del producto no puede ser negativa."
                    );
            }
            $product->product_quantity -= $movement->movement_quantity;
        }

        // Guardar los cambios en el producto
        $product->save();
        return to_route("movements.index");
    }
    public function destroy($id) {
        InvMovement::find($id)->delete();
        return to_route("movements.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");
        $movements=InvMovement::whereIn("movement_id", $ids)->delete();
        foreach ($movements as $movement) {
            $movement->delete();
        }
        return to_route("movements.index");
    }
}
