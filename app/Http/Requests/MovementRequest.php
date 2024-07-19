<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MovementRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        switch ($this->method()) {
            case "POST":
                return [
                    "product_id" =>
                        "required|string|max:8|exists:inv_products,product_id",
                    "work_order_id" =>
                        "nullable|string|max:8|exists:sup_work_orders,work_order_id",
                    "movement_date" => "required|date",
                    "movement_quantity" => "required|numeric|min:0",
                    "movement_total" => "required|numeric|between:0,100.00",
                    "movement_type" => "required|in:Entrada,Salida",
                ];
            case "PATCH":
                return [
                    "product_id" =>
                        "sometimes|required|string|max:8|exists:inv_products,product_id",
                    "work_order_id" =>
                        "sometimes|nullable|string|max:8|exists:sup_work_orders,work_order_id",
                    "movement_date" => "sometimes|required|date",
                    "movement_quantity" => "sometimes|required|numeric|min:0",
                    "movement_total" =>
                        "sometimes|required|numeric|between:0,100.00",
                    "movement_type" => "sometimes|required|in:Entrada,Salida",
                ];
            case "DELETE":
                return [
                    "id" => "required|string|exists:inv_movements,movement_id",
                ];
            default:
                return [];
        }
    }
}
