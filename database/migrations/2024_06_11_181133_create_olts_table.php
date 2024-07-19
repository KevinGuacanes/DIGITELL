<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create("ip_olts", function (Blueprint $table) {
            $table->string("olt_id", length: 8)->primary();
            $table->string("olt_name", length: 50);
            $table->string("olt_address", length: 100);
            $table->string("olt_coordx", length: 25);
            $table->string("olt_coordy", length: 25);
            $table->integer("olt_ports");
        });

        Schema::create("ip_distribution_naps", function (Blueprint $table) {
            $table->string("distribution_nap_id", length: 8)->primary();
            $table->string("olt_id", 8);
            $table->string("distribution_nap_name", length: 50);
            $table->string("distribution_nap_address", length: 100);
            $table->string("distribution_nap_coordx", length: 25);
            $table->string("distribution_nap_coordy", length: 25);
            $table->integer("distribution_nap_splitter");
            $table->integer("olt_ports");
            
            $table
                ->foreign("olt_id")
                ->references("olt_id")
                ->on("ip_olts")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
                $table->unique(["olt_id", "olt_ports"]);
        });
        
        Schema::create('ip_last_mile_naps', function (Blueprint $table) {
            $table->string("last_mile_nap_id", length: 8)->primary();
            $table->string("distribution_nap_id", length: 8);
            $table->string("last_mile_nap_name", length: 50);
            $table->string("last_mile_nap_address", length: 100);
            $table->string("last_mile_nap_coordx", length: 25);
            $table->string("last_mile_nap_coordy", length: 25);
            $table->integer("last_mile_nap_splitter");
            
            $table
                ->foreign("distribution_nap_id")
                ->references("distribution_nap_id")
                ->on("ip_distribution_naps")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });

        Schema::create('ip_ip', function (Blueprint $table) {
            $table->string("ip_address", 15)->primary();
            $table->string("distribution_nap_id", 8);
            $table->string("last_mile_nap_id", 8)->nullable(); // Campo opcional
            $table->boolean('ip_status');

            $table
                ->foreign("distribution_nap_id")
                ->references("distribution_nap_id")
                ->on("ip_distribution_naps")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table
                ->foreign("last_mile_nap_id")
                ->references("last_mile_nap_id")
                ->on("ip_last_mile_naps")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists("ip_ip");
        Schema::dropIfExists("ip_last_mile_naps");
        Schema::dropIfExists("ip_distribution_naps");
        Schema::dropIfExists("ip_olts");
    }
};
