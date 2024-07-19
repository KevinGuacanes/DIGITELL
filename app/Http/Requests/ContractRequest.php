<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContractRequest extends FormRequest {
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
                    "contract_num" => "required| string| size:13",
                    "contract_id" => "required| string| size:8",
                    "client_id" => "required| string| size:10",
                    "ip_address" => "required|string|max:15",
                    "plan_id" => "required|string|max:8",
                    "discount_id" => "required|string|max:8",
                    "status_id" => "required|string|max:8",
                    "installation_date" => "required|date",
                    "maximum_date" => "required|string|max:2",
                    "last_mile_nap_id" => "required|string|max:8",
                ];
            case "PATCH":
                return [
                    "client_id" => "sometimes|required| string| size:10",
                    "ip_address" => "sometimes|required|string|max:15",
                    "plan_id" => "sometimes|required|string|max:8",
                    "discount_id" => "sometimes|required|string|max:8",
                    "status_id" => "sometimes|required|string|max:8",
                    "installation_date" => "sometimes|required|date",
                    "maximum_date" => "sometimes|required|string|max:2",
                    "last_mile_nap_id" => "sometimes|required|string|max:8",
                ];
            case "DELETE":
                return [
                    "id" => "required|string|exists:con_contracts,contract_num",
                ];
            default:
                return [];
        }
    }
}
