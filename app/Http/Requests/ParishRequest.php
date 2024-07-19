<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ParishRequest extends FormRequest {
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
                    "parish_id" => "string|max:7|unique:con_parishes,parish_id",
                    "canton_id" =>
                        "required|string|max:7|exists:con_cantons,canton_id",
                    "parish_name" => "required|string|max:50",
                ];
            case "PATCH":
                return [
                    "parish_id" =>
                        "sometimes|required|string|max:7|unique:con_parishes,parish_id",
                    "canton_id" =>
                        "sometimes|required|string|max:7|exists:con_cantons,canton_id",
                    "parish_name" => "sometimes|required|string|max:50",
                ];
            case "DELETE":
                return [
                    "id" => "required|string|exists:con_parishes,parish_id",
                ];
            default:
                return [];
        }
    }
}
