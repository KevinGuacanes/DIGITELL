<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConClientController;
use App\Http\Controllers\ConCantonController;
use App\Http\Controllers\ConParishController;
use App\Http\Controllers\ConSectorController;
use App\Http\Controllers\ConPhoneController;
use App\Http\Controllers\IpOltsController;
use App\Http\Controllers\IpDistributionController;
use App\Http\Controllers\IpLastMileController;
use App\Http\Controllers\IpsController;
use App\Http\Controllers\ConContractController;
use Inertia\Inertia;

Route::prefix("manage-customers")
    ->middleware(["auth", "verified", "role:vendedor"])
    ->group(function () {
        Route::resource("/clients", ConClientController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage clients");

        Route::delete("/clients", [
            ConClientController::class,
            "destroyMultiple",
        ])
            ->name("clients.multiple.destroy")
            ->middleware("permission:manage clients");

        Route::resource("phones", ConPhoneController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage phones");

        Route::delete("/phones", [ConPhoneController::class, "destroyMultiple"])
            ->name("phones.multiple.destroy")
            ->middleware("permission:manage phones");

        Route::resource("/sectors", ConSectorController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage sectors");

        Route::delete("/sectors", [
            ConSectorController::class,
            "destroyMultiple",
        ])
            ->name("sectors.multiple.destroy")
            ->middleware("permission:manage sectors");

        Route::resource("parishes", ConParishController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage parishes");

        Route::delete("/parishes", [
            ConParishController::class,
            "destroyMultiple",
        ])
            ->name("parishes.multiple.destroy")
            ->middleware("permission:manage parishes");

        Route::resource("cantons", ConCantonController::class)
            ->except(["create", "show", "edit"])
            ->middleware("permission:manage cantons");

        Route::delete("/cantons", [
            ConCantonController::class,
            "destroyMultiple",
        ])
            ->name("cantons.multiple.destroy")
            ->middleware("permission:manage cantons");
    });

Route::prefix("manage-contracts")
    ->middleware(["auth", "verified", "role:vendedor"])
    ->group(function () {
        Route::resource("contracts", ConContractController::class)->except([
            "create",
            "show",
            "edit",
        ]);
    });
Route::prefix("annulments-contracts")
    ->middleware(["auth", "verified", "role:admin"])
    ->group(function () {
        // Ruta para listar anulaciones de contratos (index2)
        Route::get("/contracts2", [
            ConContractController::class,
            "index2",
        ])->name("contracts2.index");

        // Ruta para listar anulaciones de contratos (index3)
        Route::get("/contracts3", [
            ConContractController::class,
            "index3",
        ])->name("contracts3.index");

        // Ruta para eliminar múltiples contratos anulados
        Route::delete("/", [
            ConContractController::class,
            "destroyMultiple",
        ])->name("contracts.multiple.destroy");
    });

Route::prefix("manage-ips")
    ->middleware(["auth", "verified", "role:admin"])
    ->group(function () {
        Route::resource("olts", IpOltsController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/olts", [
            IpOltsController::class,
            "destroyMultiple",
        ])->name("olts.multiple.destroy");

        Route::resource(
            "distributionNaps",
            IpDistributionController::class
        )->except(["create", "show", "edit"]);

        Route::get("/distributionNaps/{oltId}/available-ports", [
            IpDistributionController::class,
            "getAvailablePorts",
        ]);

        Route::delete("/distributionNaps", [
            IpDistributionController::class,
            "destroyMultiple",
        ])->name("distributionNaps.multiple.destroy");

        Route::resource("lastmileNaps", IpLastMileController::class)->except([
            "create",
            "show",
            "edit",
        ]);

        Route::delete("/lastmileNaps", [
            IpLastMileController::class,
            "destroyMultiple",
        ])->name("lastmileNaps.multiple.destroy");

        Route::resource("ips", IpsController::class)->except(["show", "edit"]);
    });
