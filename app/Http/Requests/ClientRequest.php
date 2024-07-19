<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\ValidCedula;
use Illuminate\Validation\Rule;

class ClientRequest extends FormRequest {
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
                    "client_id" => [
                        "required",
                        "string",
                        "size:10",
                        new ValidCedula(),
                        "unique:con_clients,client_id",
                    ],
                    "sector_id" => [
                        "required",
                        "string",
                        "max:7",
                        "exists:con_sector,sector_id",
                    ],
                    "client_name" => "required|string|max:150",
                    "client_email" => "required|string|email|max:250",
                    "address" => "required|string|max:100",
                    "reference" => "required|string|max:250",
                ];
            case "PATCH":
                return [
                    "client_id" => [
                        "sometimes",
                        "required",
                        "string",
                        "size:10",
                        new ValidCedula(),
                        Rule::unique("con_clients", "client_id")->ignore(
                            $this->route("client"),
                            "client_id"
                        ),
                    ],
                    "sector_id" => [
                        "sometimes",
                        "required",
                        "string",
                        "max:7",
                        "exists:con_sector,sector_id",
                    ],
                    "client_name" => "sometimes|required|string|max:150",
                    "client_email" => "sometimes|required|string|email|max:250",
                    "address" => "sometimes|required|string|max:100",
                    "reference" => "sometimes|required|string|max:250",
                ];
            case "DELETE":
                return [
                    "client_id" =>
                        "required|string|size:10|exists:con_clients,client_id",
                ];
            default:
                return [];
        }
    }
}
