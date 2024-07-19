<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create("con_provinces", function (Blueprint $table) {
            $table->string("province_id", length: 7)->primary();
            $table->string("province_name", length: 50);
        });

        Schema::create("con_cantons", function (Blueprint $table) {
            $table->string("canton_id", 7)->primary();
            $table->string("province_id", 7);
            $table->string("canton_name", 50);

            $table
                ->foreign("province_id")
                ->references("province_id")
                ->on("con_provinces")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });

        Schema::create("con_parishes", function (Blueprint $table) {
            $table->string("parish_id", 7)->primary();
            $table->string("canton_id", 7);
            $table->string("parish_name", 50);

            $table
                ->foreign("canton_id")
                ->references("canton_id")
                ->on("con_cantons")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });

        Schema::create("con_sector", function (Blueprint $table) {
            $table->string("sector_id", 7)->primary();
            $table->string("parish_id", 7);
            $table->string("sector_name", 100);
            $table->string("description", 250);

            $table
                ->foreign("parish_id")
                ->references("parish_id")
                ->on("con_parishes")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });

        Schema::create("con_clients", function (Blueprint $table) {
            $table->string("client_id", 10)->primary();
            $table->string("sector_id", 7);
            $table->string("client_name", 150);
            $table->string("client_email", 250);
            $table->string("address", 100);
            $table->string("reference", 250);

            $table
                ->foreign("sector_id")
                ->references("sector_id")
                ->on("con_sector")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });

        Schema::create("con_phones", function (Blueprint $table) {
            $table->string("phone_number", 10)->primary();
            $table->string("client_id", 10);
            $table->timestamp("created_at")->useCurrent();
            $table
                ->foreign("client_id")
                ->references("client_id")
                ->on("con_clients")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists("con_phones");
        Schema::dropIfExists("con_clients");
        Schema::dropIfExists("con_sector");
        Schema::dropIfExists("con_parishes");
        Schema::dropIfExists("con_cantons");
        Schema::dropIfExists("con_provinces");
    }
};
