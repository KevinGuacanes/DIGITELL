<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create("con_status", function (Blueprint $table) {
            $table->string("status_id", 8)->primary();
            $table->string("status_name", 50);
            $table->string("status_description", 100);
        });

        Schema::create("pla_plans", function (Blueprint $table) {
            $table->string("plan_id", 8)->primary();
            $table->string("plan_name", 50);
            $table->double("plan_value");
            $table->integer("plan_megas");
            $table->string("plan_description", 250);
        });

        Schema::create("con_discounts", function (Blueprint $table) {
            $table->string("discount_id", 8)->primary();
            $table->string("discount_name", 50);
            $table->string("discount_description", 100);
        });
        
        Schema::create("con_contracts", function (Blueprint $table) {
            $table->string("contract_num", 13)->primary();
            $table->string("contract_id", 8);
            $table->string("client_id", 10);
            $table->string("ip_address", 15);
            $table->string("plan_id", 8);
            $table->string("discount_id", 8);
            $table->string("status_id", 8);
            $table->date("installation_date");
            $table->string("maximum_date", 2);
            $table
                ->foreign("client_id")
                ->references("client_id")
                ->on("con_clients")
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table
                ->foreign("plan_id")
                ->references("plan_id")
                ->on("pla_plans")
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table
                ->foreign("discount_id")
                ->references("discount_id")
                ->on("con_discounts")
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table
                ->foreign("status_id")
                ->references("status_id")
                ->on("con_status")
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table
                ->foreign("ip_address")
                ->references("ip_address")
                ->on("ip_ip")
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
        });
        
        Schema::create("sup_work_orders", function (Blueprint $table) {
            $table->string("work_order_id", 8)->primary();
            $table->unsignedBigInteger("employee_id");
            $table->string("type_report_id", 8);
            $table->string("contract_num", 13);
            $table->string("order_channel", 150);
            $table->dateTime("issue_date");
            $table->boolean("order_precedents");
            $table->string("order_status", 50);
            $table->string("order_abclaim", 250)->nullable();
            $table->dateTime("solution_date")->nullable();
            $table->string("order_initial_abis", 150)->nullable();
            $table->string("order_initial_potency", 150)->nullable();
            $table->string("order_final_abis", 150)->nullable();
            $table->string("order_initial_diagnosis", 250)->nullable();
            $table->string("order_solution", 250)->nullable();
            $table->string("order_final_potency", 150)->nullable();
            $table->string("order_final_diagnosis", 250)->nullable();
            $table->double("value_due")->nullable();

            $table
                ->foreign("type_report_id")
                ->references("type_report_id")
                ->on("sup_type_report")
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table
                ->foreign("employee_id")
                ->references("id")
                ->on("users")
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table
                ->foreign("contract_num")
                ->references("contract_num")
                ->on("con_contracts")
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists("sup_work_orders");
        Schema::dropIfExists("con_contracts");
        Schema::dropIfExists("con_discounts");
        Schema::dropIfExists("pla_plans");
        Schema::dropIfExists("con_status");
    }
};
