<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InvMovementTypeController;
use App\Http\Controllers\InvMovementController;
use App\Http\Controllers\InvProductController;

Route::prefix("manage-inventory")
->middleware(["auth", "verified", "role:admin"])
    ->group(function () {
        Route::resource("products", InvProductController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/products", [
            InvProductController::class,
            "destroyMultiple",
        ])->name("products.multiple.destroy");

        Route::resource("types", InvMovementTypeController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/types", [
            InvMovementTypeController::class,
            "destroyMultiple",
        ])->name("types.multiple.destroy");

        Route::resource("movements", InvMovementController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/movements", [
            InvMovementController::class,
            "destroyMultiple",
        ])->name("movements.multiple.destroy");
    });
   