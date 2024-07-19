<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TypeRequest extends FormRequest {
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
                    "movement_type_description" =>
                        "required|string|max:150|min:2",
                ];
            case "PATCH":
                return [
                    "movement_type_description" =>
                        "sometimes|required|string|max:150|min:2",
                ];
            case "DELETE":
                return [
                    "id" =>
                        "required|string|exists:inv_movement_types,movement_type_id",
                ];
            default:
                return [];
        }
    }
}
