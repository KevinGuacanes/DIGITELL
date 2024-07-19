<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Spatie\Permission\Models\Permission;

class UserRoleSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $adminRole = Role::create(["name" => "admin"]);
        $vendedorRole = Role::create(["name" => "vendedor"]);
        $tecnicoRole = Role::create(["name" => "tecnico"]);
        $auditorRole = Role::create(["name" => "auditor"]);

        $super = User::factory()->create([
            "name" => "Super User",
            "username" => "superuser",
            "email" => "su@example.com",
        ]);
        $super->assignRole(
            $adminRole,
            $vendedorRole,
            $tecnicoRole,
            $auditorRole
        );

        //Permisos para vendedor
        $permissions = [
            "manage clients",
            "manage phones",
            "manage sectors",
            "manage parishes",
            "manage cantons",
        ];

        foreach ($permissions as $permission) {
            Permission::create(["name" => $permission]);
        }
        $vendedorRole->givePermissionTo($permissions);

        //Usuarios por defecto
        $adminUser = User::factory()->create([
            "name" => "Admin User",
            "username" => "admin",
            "email" => "admin@example.com",
        ]);
        $adminUser->assignRole($adminRole);

        $vendedorUser = User::factory()->create([
            "name" => "Vendedor User",
            "username" => "vender",
            "email" => "vendedor@example.com",
        ]);
        $vendedorUser->assignRole($vendedorRole);

        $tecnicoUser = User::factory()->create([
            "name" => "Tecnico User",
            "username" => "tecni",
            "email" => "tecnico@example.com",
        ]);
        $tecnicoUser->assignRole([$tecnicoRole]);

        $auditorUser = User::factory()->create([
            "name" => "Auditor User",
            "username" => "audi",
            "email" => "auditor@example.com",
        ]);
        $auditorUser->assignRole([$auditorRole]);
    }
}
