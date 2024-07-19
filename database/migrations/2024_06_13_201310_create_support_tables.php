<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create("sup_type_order", function (Blueprint $table) {
            $table->string("type_order_id", 8)->primary();
            $table->string("name_type_order", 50);
            $table->string("description_type_order", 150);
        });

        Schema::create("sup_type_report", function (Blueprint $table) {
            $table->string("type_report_id", 8)->primary();
            $table->string("type_order_id", 8);
            $table->string("name_type_report", 50);
            $table->string("description_type_report", 150);
            $table
                ->foreign("type_order_id")
                ->references("type_order_id")
                ->on("sup_type_order")
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists("sup_type_report");
        Schema::dropIfExists("sup_type_order");
    }
};
