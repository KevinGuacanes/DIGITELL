<?php

namespace App\Http\Requests;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class PhoneRequest extends FormRequest {
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
                    "phone_number" => [
                        "required",
                        "string",
                        "size:10",
                        "unique:con_phones,phone_number",
                    ],
                    "client_id" => [
                        "required",
                        "string",
                        "size:10",
                        "exists:con_clients,client_id",
                    ],
                ];
            case "PATCH":
                return [
                    "phone_number" => [
                        "sometimes",
                        "required",
                        "string",
                        "size:10",
                        Rule::unique("con_phones", "phone_number")->ignore(
                            $this->route("phone"),
                            "phone_number"
                        ),
                    ],
                    "client_id" => [
                        "sometimes",
                        "required",
                        "string",
                        "size:10",
                        "exists:con_clients,client_id",
                    ],
                ];
            case "DELETE":
                return [
                    "phone_number" => [
                        "required",
                        "string",
                        "size:10",
                        "exists:con_phones,phone_number",
                    ],
                ];
            default:
                return [];
        }
    }
}
