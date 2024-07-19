<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Bluecloud\SecurityQuestionHelpers\SecurityQuestionEntry;
use Bluecloud\SecurityQuestionHelpers\SecurityQuestion;
use Illuminate\Support\Facades\Crypt;

class ProfileController extends Controller {
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response {
        $entries = SecurityQuestionEntry::where("user_id", $request->user()->id)
            ->with("question")
            ->get();
        $questions = SecurityQuestion::query()->get();
        return Inertia::render("Profile/Edit", [
            "mustVerifyEmail" => $request->user() instanceof MustVerifyEmail,
            "status" => session("status"),
            "entries" => $entries,
            "questions" => $questions,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty("email")) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route("profile.edit");
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse {
        $request->validate([
            "password" => ["required", "current_password"],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to("/");
    }

    /**
     * Store a security question entry.
     */
    public function storeSecurityQuestion(Request $request): RedirectResponse {
        $validated = $request->validate([
            "security_question_id" => "required|exists:security_questions,id",
            "answer" => "required|string",
        ]);

        SecurityQuestionEntry::create([
            "user_id" => Auth::id(),
            "security_question_id" => $validated["security_question_id"],
            "answer" => Crypt::encrypt($validated["answer"]),
        ]);
        return Redirect::route("profile.edit");
    }

    /**
     * Delete a security question entry.
     */
    public function destroySecurityQuestion($id): RedirectResponse {
        $entry = SecurityQuestionEntry::where(
            "user_id",
            Auth::id()
        )->findOrFail($id);
        $entry->delete();

        return Redirect::route("profile.edit");
    }
}
