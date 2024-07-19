<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create("inv_products", function (Blueprint $table) {
            $table->string("product_id", length: 8)->primary();
            $table->string("product_name", length: 50);
            $table->string("product_description", length: 150);
            $table->decimal("product_price", total: 8, places: 2);
            $table->bigInteger("product_quantity");
            $table->string("product_brand", length: 50);
            $table->decimal("product_vat", total: 8, places: 2);
        });

        Schema::create("inv_movements", function (Blueprint $table) {
            $table->string("movement_id", length: 8)->primary();
            $table->string("product_id", length: 8);
            $table->string("work_order_id", 8)->nullable();
            $table->date("movement_date");
            $table->bigInteger("movement_quantity");
            $table->decimal("movement_total", total: 8, places: 2);
            $table->enum("movement_type", ["Entrada", "Salida"]);

            $table
                ->foreign("product_id")
                ->references("product_id")
                ->on("inv_products")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table
                ->foreign("work_order_id")
                ->references("work_order_id")
                ->on("sup_work_orders")
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists("inv_movements");
        Schema::dropIfExists("inv_products");
    }
};
