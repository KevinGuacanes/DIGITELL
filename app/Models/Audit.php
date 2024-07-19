<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Models\Audit as AuditModel;

class Audit extends AuditModel {
    use HasFactory;
    public static function getAll() {
        return static::with("user")
            ->latest()
            ->get()
            ->map(function ($audit) {
                $data = $audit->toArray();

                unset($data["url"], $data["user_agent"]);

                $data["user_roles"] = $audit->getUserRoles();
                $data["modified_table"] = $audit->getModifiedTable();

                return $data;
            });
    }

    public function getUserRoles() {
        if ($this->user_id) {
            $user = User::find($this->user_id);
            return $user ? $user->roles->pluck("name") : [];
        }
        return [];
    }

    public function getModifiedTable() {
        if ($this->auditable_type && $this->auditable_id) {
            $model = app($this->auditable_type);
            $table = $model->getTable();

            $record = $model->find($this->auditable_id);
            return [
                "table_name" => $table,
                "record_exists" => !is_null($record),
                "record_id" => $this->auditable_id,
            ];
        }
        return null;
    }
}
