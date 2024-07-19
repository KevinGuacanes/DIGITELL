<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest {
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
                    "product_name" => "required|string|max:50|min:2",
                    "product_description" => "required|string|max:150|min:5",
                    "product_price" => "required|numeric|between:0,9999.99",
                    "product_quantity" => "required|numeric|min:0",
                    "product_brand" => "required|string|min:2|max:50",
                    "product_vat" => "required|numeric|between:0,100.00",
                ];
            case "PATCH":
                return [
                    "product_name" => "sometimes|required|string|max:50|min:2",
                    "product_description" => "nullable|string|max:150|min:5",
                    "product_price" =>
                        "sometimes|required|numeric|between:0,9999.99",
                    "product_quantity" => "sometimes|required|numeric|min:0",
                    "product_brand" => "sometimes|required|string|min:2|max:50",
                    "product_vat" =>
                        "sometimes|required|numeric|between:0,100.00",
                ];
            case "DELETE":
                return [
                    "id" => "required|string|exists:inv_products,product_id",
                ];
            default:
                return [];
        }
    }
}
