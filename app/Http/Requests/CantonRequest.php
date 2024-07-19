<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CantonRequest extends FormRequest {
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
                    "canton_id" => "string|max:7|unique:con_cantons,canton_id",
                    "province_id" =>
                        "required|string|max:7|exists:con_provinces,province_id",
                    "canton_name" => "required|string|max:50",
                ];
            case "PATCH":
                return [
                    "province_id" =>
                        "required|string|max:7|exists:con_provinces,province_id",
                    "canton_name" => "required|string|max:50",
                ];
            case "DELETE":
                return [
                    "id" => "required|string|exists:con_cantons,canton_id",
                ];
            default:
                return [];
        }
    }
}
