<?php
use App\Http\Controllers\SupTypeReportController;
use App\Http\Controllers\SupWorkOrderController;

use Illuminate\Support\Facades\Route;

Route::prefix("manage-orders")
    ->middleware(["auth", "verified", "role:admin|vendedor"])
    ->group(function () {
        Route::resource("typereport", SupTypeReportController::class)->except([
            "create",
            "show",
            "edit",
        ]);

        Route::delete("/typereport", [
            SupTypeReportController::class,
            "destroyMultiple",
        ])->name("typereport.multiple.destroy");

        Route::resource("workorder", SupWorkOrderController::class)->except([
            "create",
            "show",
            "edit",
        ]);

        Route::delete("/workorder", [
            SupWorkOrderController::class,
            "destroyMultiple",
        ])->name("workorder.multiple.destroy");
        Route::post("/work-orders/update-status", [
            SupWorkOrderController::class,
            "updateStatus",
        ])->name("work-orders.update-status");
    });

Route::prefix("manage-tecnico")
    ->middleware(["auth", "verified", "role:tecnico"])
    ->group(function () {
        Route::get('orderTecnico', [SupWorkOrderController::class, 'orderTecnicoIndex'])->name('orderTecnico.index');
        Route::patch('/{id}/updateT', [SupWorkOrderController::class, 'updateT'])->name('orderTecnico.updateT');

        Route::post("/manage-tecnico/update-status", [
            SupWorkOrderController::class,
            "updateStatus2",
        ])->name("manage-tecnico.update-status");
    });
