<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller {
    public function index() {
        return Inertia::render("Employee", [
            "employees" => User::getAllUserRoles(),
            "roles" => Role::all(),
        ]);
    }

    public function update(Request $request, string $userId) {
        $request->validate([
            "role_id" => "nullable|array",
            "role_id.*" => "integer|exists:roles,id",
        ]);

        $user = User::findOrFail($userId);

        $newRoles = Role::whereIn("id", $request->role_id)
            ->pluck("name")
            ->toArray();

        $user->auditRoleChange($newRoles);
        return to_route("employees.index");
    }

    public function destroy(string $userId) {
        User::findOrFail($userId)->delete();
        return to_route("employees.index");
    }

    public function destroyMultiple(Request $request) {
        $ids = $request->input("ids");

        $users = User::whereIn("id", $ids)->get();

        foreach ($users as $user) {
            $user->delete();
        }

        return to_route("employees.index");
    }
}
