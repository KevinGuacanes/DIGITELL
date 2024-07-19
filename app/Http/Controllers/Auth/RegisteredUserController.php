<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller {
    /**
     * Display the registration view.
     */
    public function create(): Response {
        return Inertia::render("Auth/Register");
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request) {
        $request->validate([
            "name" => "required|string|max:255",
            "email" =>
                "required|string|lowercase|email|max:255|unique:" . User::class,
            "username" => [
                "required",
                "string",
                "min:5",
                "max:50",
                "unique:" . User::class,
                "regex:/^[a-zA-Z0-9_-]+$/",
                "not_in:admin,superuser,moderator,administrator,sysadmin,support,guest,anonymous,system,server,database,contact",
            ],
            "password" => ["required", "confirmed", Rules\Password::defaults()],
        ]);

        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "username" => $request->username,
            "password" => Hash::make($request->password),
        ]);

        event(new Registered($user));
        // Auth::login($user);

        // return redirect(route('dashboard', absolute: false));
        return redirect()
            ->route("login")
            ->with(
                "message",
                "Registro exitoso. Por favor, espere a que un administrador le asigne un rol."
            )
            ->with("type", "info");
    }
}
