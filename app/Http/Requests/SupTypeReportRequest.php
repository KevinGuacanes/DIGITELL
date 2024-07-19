<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupTypeReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        switch ($this->method()) {
            case "POST":
                return [
                    "type_order_id" => "required|string|max:8|exists:sup_type_order,type_order_id",
                    "name_type_report" => "required|string|max:50",
                    "description_type_report" => "required|string|max:150",
                ];
            case "PATCH":
                return [
                    "type_order_id" => "sometimes|required|string|max:8|exists:sup_type_order,type_order_id",
                    "name_type_report" => "sometimes|required|string|max:50",
                    "description_type_report" => "sometimes|required|string|max:150",
                ];
            case "DELETE":
                return [
                    "type_report_id" => "required|string|exists:sup_type_report,type_report_id",
                ];
            default:
                return [];
        }

    }
}
