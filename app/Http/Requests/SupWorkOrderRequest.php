<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupWorkOrderRequest extends FormRequest {
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
                    "work_order_id" => "required| string| size:8",
                    "employee_id" => "required|integer|exists:users,id",
                    "type_report_id" =>
                        "required|string|max:8|exists:sup_type_report,type_report_id",
                    "contract_num" =>
                        "required|string|max:13|exists:con_contracts,contract_num",
                    "order_channel" => "required|string|max:150",
                    "issue_date" => "required|date_format:Y-m-d\TH:i",
                    "order_precedents" => "required|boolean",
                    "order_status" => "required|string|max:50",
                    "order_abclaim" => "nullable|string|max:250",
                    "solution_date" =>
                        "nullable|date_format:Y-m-d\TH:i|after:issue_date",
                    "order_initial_abis" => "nullable|string|max:150",
                    "order_initial_potency" => "nullable|string|max:150",
                    "order_final_abis" => "nullable|string|max:150",
                    "order_initial_diagnosis" => "nullable|string|max:250",
                    "order_solution" => "nullable|string|max:250",
                    "order_final_potency" => "nullable|string|max:150",
                    "order_final_diagnosis" => "nullable|string|max:250",
                    "value_due" => "nullable|numeric",
                ];
            case "PATCH":
                return [
                    "employee_id" =>
                        "sometimes|required|integer|exists:users,id",
                    "type_report_id" =>
                        "sometimes|required|string|max:8|exists:sup_type_report,type_report_id",
                    "contract_num" =>
                        "sometimes|required|string|max:13|exists:con_contracts,contract_num",
                    "order_channel" => "sometimes|required|string|max:150",
                    "issue_date" => "sometimes|required|date_format:Y-m-d\TH:i",
                    "order_precedents" => "sometimes|required|boolean",
                    "order_status" => "sometimes|required|string|max:50",
                    "order_abclaim" => "nullable|string|max:250",
                    "solution_date" =>
                        "nullable|date_format:Y-m-d\TH:i|after:issue_date",
                    "order_initial_abis" => "nullable|string|max:150",
                    "order_initial_potency" => "nullable|string|max:150",
                    "order_final_abis" => "nullable|string|max:150",
                    "order_initial_diagnosis" => "nullable|string|max:250",
                    "order_solution" => "nullable|string|max:250",
                    "order_final_potency" => "nullable|string|max:150",
                    "order_final_diagnosis" => "nullable|string|max:250",
                    "value_due" => "nullable|numeric",
                ];
            case "DELETE":
                return [
                    "work_order_id" =>
                        "required|string|exists:sup_work_orders,work_order_id",
                ];
            default:
                return [];
        }
    }

    public function messages() {
        return [
            "solution_date.after" =>
                "La fecha de solución debe ser mayor que la fecha del problema.",
        ];
    }
}
