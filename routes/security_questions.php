<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SecurityQuestionVerificationController;


Route::middleware("guest")->group(function () {
    Route::get("/security-questions/verify", [
        SecurityQuestionVerificationController::class,
        "create",
    ])->name("password.security-questions");

    Route::post("/security-questions/verify", [
        SecurityQuestionVerificationController::class,
        "verify",
    ])->name("password.security-questions.verify");
});
