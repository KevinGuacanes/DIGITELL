<?php

namespace App\Http\Controllers;

use App\Models\User;
use Bluecloud\SecurityQuestionHelpers\SecurityQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Bluecloud\SecurityQuestionHelpers\SecurityQuestionEntry;
use Illuminate\Support\Facades\Crypt;

class SecurityQuestionVerificationController extends Controller {
    public function create() {
        $securityQuestions = SecurityQuestion::all();
        return inertia("Auth/SecurityQuestionVerification", [
            "securityQuestions" => $securityQuestions,
        ]);
    }

    public function verify(Request $request) {
        $request->validate([
            "email" => "required|email",
            "security_question_id" => "required|exists:security_questions,id",
            "answer" => "required|string",
        ]);

        $user = User::where("email", $request->email)->first();
        if (!$user) {
            return back()->withErrors([
                "email" =>
                    "No se encontró un usuario con ese correo electrónico.",
            ]);
        }

        $securityQuestionEntry = SecurityQuestionEntry::where(
            "user_id",
            $user->id
        )
            ->where("security_question_id", $request->security_question_id)
            ->first();

        $decryptedAnswer = Crypt::decryptString($securityQuestionEntry->answer);
        if (preg_match('/^s:\d+:"(.+)";$/', $decryptedAnswer, $matches)) {
            $decryptedAnswer = $matches[1];
        }

        if ($decryptedAnswer !== $request->answer) {
            return back()->withErrors([
                "answer" =>
                    "La respuesta a la pregunta de seguridad es incorrecta.",
            ]);
        }

        $token = Password::createToken($user);

        return redirect()->route("password.reset", [
            "token" => $token,
            "email" => $user->email,
        ]);
    }
}
