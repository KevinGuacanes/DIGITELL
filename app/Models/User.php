<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;
use Laravel\Fortify\TwoFactorAuthenticatable;
use OwenIt\Auditing\Contracts\Auditable;
use Bluecloud\SecurityQuestionHelpers\HasSecurityQuestions;

class User extends Authenticatable implements MustVerifyEmail, Auditable {
    use HasFactory,
        Notifiable,
        HasRoles,
        TwoFactorAuthenticatable,
        HasSecurityQuestions;
    use \OwenIt\Auditing\Auditable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "name",
        "email",
        "username",
        "password",
        "two_factor_secret",
        "two_factor_recovery_codes",
        "two_factor_confirmed_at",
    ];

    /**
     * Attributes to exclude from the Audit.
     *
     * @var array
     */
    protected $auditExclude = ["remember_token"];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ["password", "remember_token"];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array {
        return [
            "email_verified_at" => "datetime",
            "password" => "hashed",
        ];
    }

    public $timestamps = false;

    public static function getAllUserRoles() {
        return self::with("roles.permissions")
            ->get()
            ->map(function ($user) {
                return [
                    "user_id" => $user->id,
                    "user_name" => $user->name,
                    "roles" => $user->roles->map(function ($role) {
                        return [
                            "role_id" => $role->id,
                            "role_name" => $role->name,
                        ];
                    }),
                ];
            });
    }

    public static function getPermissionsByRole() {
        return Role::with("permissions")
            ->get()
            ->map(function ($role) {
                return [
                    "role_id" => $role->id,
                    "role_name" => $role->name,
                    "permissions" => $role->permissions->map(function (
                        $permission
                    ) {
                        return [
                            "permission_id" => $permission->id,
                            "permission_name" => $permission->name,
                        ];
                    }),
                ];
            });
    }

    public function auditRoleChange($newRoles) {
        $oldRoles = $this->roles->pluck("name")->toArray();

        $this->syncRoles($newRoles);
        $user = Auth::user();

        $auditData = [
            "event" => "role_change",
            "old_values" => ["roles" => $oldRoles],
            "new_values" => [
                "roles" => is_array($newRoles) ? $newRoles : [$newRoles],
            ],
            "auditable_id" => $this->id,
            "auditable_type" => get_class($this),
            "user_type" => get_class($user),
            "user_id" => $user->id,
        ];

        Audit::create($auditData);
    }
}
