<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

Route::group(["middleware" => ["auth", "verified", "role:admin"]], function () {
    Route::resource("employees", EmployeeController::class)->only([
        "index",
        "update",
        "destroy",
    ]);

    Route::delete("/employees", [
        EmployeeController::class,
        "destroyMultiple",
    ])->name("employees.destroyMultiple");
});
