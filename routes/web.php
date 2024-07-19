<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\InvProductController;
use App\Http\Controllers\PlansController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController;
use App\Models\Audit;
use App\Services\DashboardService;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\ConfirmedTwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController;
use Laravel\Fortify\Http\Controllers\ConfirmablePasswordController;
use Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController;
use Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController;
use Laravel\Fortify\Http\Controllers\RecoveryCodeController;

Route::get("/", function () {
    return Auth::check()
        ? redirect()->route("dashboard")
        : redirect()->route("login");
});

Route::get("/dashboard", [DashboardController::class, "index"])
    ->middleware(["auth", "verified", "role:admin|vendedor|tecnico|auditor"])
    ->name("dashboard");

Route::middleware([
    "auth",
    "verified",
    "role:admin|vendedor|tecnico|auditor",
])->group(function () {
    Route::get("/profile", [ProfileController::class, "edit"])->name(
        "profile.edit"
    );
    Route::patch("/profile", [ProfileController::class, "update"])->name(
        "profile.update"
    );
    Route::delete("/profile", [ProfileController::class, "destroy"])->name(
        "profile.destroy"
    );
    Route::post("/profile/security-question", [
        ProfileController::class,
        "storeSecurityQuestion",
    ])->name("profile.storeSecurityQuestion");
    Route::delete("/profile/security-question/{id}", [
        ProfileController::class,
        "destroySecurityQuestion",
    ])->name("profile.destroySecurityQuestion");
});



Route::prefix("manage-plans")
    ->middleware(["auth", "verified", "role:admin"])
    ->group(function () {
        Route::resource("plans", PlansController::class)->except([
            "create",
            "show",
            "edit",
        ]);
        Route::delete("/plans", [
            PlansController::class,
            "destroyMultiple",
        ])->name("plans.multiple.destroy");
    });

Route::get("/check-session", function (Request $request) {
    if (Auth::check()) {
        $lastActivity = $request->session()->get("last_activity");
        $sessionLifetime = config("session.lifetime") * 60;

        if ($lastActivity && time() - $lastActivity > $sessionLifetime) {
            Auth::logout();
            return response()->json(["authenticated" => false]);
        }

        $request->session()->put("last_activity", time());
        return response()->json(["authenticated" => true]);
    }

    return response()->json(["authenticated" => false]);
});

Route::group(
    ["middleware" => config("fortify.middleware", ["web"])],
    function () {
        Route::get("/user/confirmed-password-status", [
            ConfirmedPasswordStatusController::class,
            "show",
        ])
            ->middleware("auth")
            ->name("password.confirmation");

        Route::post("/user/confirm-password", [
            ConfirmablePasswordController::class,
            "store",
        ])
            ->middleware(["auth", "throttle:6,1"])
            ->name("password.confirm.2fa");

        Route::get("/two-factor-challenge", [
            TwoFactorAuthenticatedSessionController::class,
            "create",
        ])
            ->middleware("guest")
            ->name("two-factor.login");

        Route::post("/two-factor-challenge", [
            TwoFactorAuthenticatedSessionController::class,
            "store",
        ])
            ->middleware(["guest", "throttle:6,1"])
            ->name("two-factor.login.submit");

        Route::post("/user/two-factor-authentication", [
            TwoFactorAuthenticationController::class,
            "store",
        ])
            ->middleware(["auth", "password.confirm"])
            ->name("two-factor.enable");

        Route::post("/user/confirmed-two-factor-authentication", [
            ConfirmedTwoFactorAuthenticationController::class,
            "store",
        ])
            ->middleware(["auth", "password.confirm"])
            ->name("two-factor.confirm");

        Route::delete("/user/two-factor-authentication", [
            TwoFactorAuthenticationController::class,
            "destroy",
        ])
            ->middleware(["auth", "password.confirm"])
            ->name("two-factor.disable");

        Route::get("/user/two-factor-qr-code", [
            TwoFactorQrCodeController::class,
            "show",
        ])
            ->middleware(["auth", "password.confirm"])
            ->name("two-factor.qr-code");

        Route::get("/user/two-factor-secret-key", [
            TwoFactorSecretKeyController::class,
            "show",
        ])
            ->middleware(["auth", "password.confirm"])
            ->name("two-factor.secret-key");

        Route::get("/user/two-factor-recovery-codes", [
            RecoveryCodeController::class,
            "index",
        ])
            ->middleware(["auth", "password.confirm"])
            ->name("two-factor.recovery-codes");

        Route::post("/user/two-factor-recovery-codes", [
            RecoveryCodeController::class,
            "store",
        ])->middleware(["auth", "password.confirm"]);
    }
);

require __DIR__ . "/auth.php";
require __DIR__ . "/audit.php";
require __DIR__ . "/customer-management.php";
require __DIR__ . "/customer-support.php";
require __DIR__ . "/inventory-management.php";
require __DIR__ . "/securities.php";
require __DIR__ . "/security_questions.php";
