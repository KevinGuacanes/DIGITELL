<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller {
    /**
     * Display the login view.
     */
    public function create(): Response {
        return Inertia::render("Auth/Login", [
            "canResetPassword" => Route::has("password.request"),
            "status" => session("status"),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse {
        $request->authenticate();

        $user = Auth::user();
        if ($user instanceof User) {
            $user->disableAuditing();
        }

        if ($user && $this->isTwoFactorAuthenticationEnabled($user)) {
            Auth::logout();

            $request->session()->put([
                "login.id" => $user->id,
                "login.remember" => $request->boolean("remember"),
            ]);

            return redirect()->route("two-factor.login");
        }

        $request->session()->regenerate();

        if ($user->roles->isEmpty()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->route("login")
                ->with(
                    "message",
                    "Tu cuenta está pendiente de aprobación. El administrador te asignará un rol pronto."
                )
                ->with("type", "warning");
        }
        return redirect()->intended(route("dashboard"));
    }

    private function isTwoFactorAuthenticationEnabled($user): bool {
        return $user->two_factor_secret &&
            $user->two_factor_confirmed_at &&
            in_array(
                \Laravel\Fortify\TwoFactorAuthenticatable::class,
                class_uses_recursive($user)
            );
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse {
        $user = Auth::user();

        if ($user instanceof User) {
            $user->disableAuditing();
        }

        Auth::guard("web")->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if ($user instanceof User) {
            $user->enableAuditing();
        }

        return redirect("/");
    }
}
