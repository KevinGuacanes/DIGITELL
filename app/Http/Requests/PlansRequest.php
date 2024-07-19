<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlansRequest extends FormRequest
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
                    'plan_name' => 'required|string|max:50',
                    'plan_value' => 'required|numeric|min:0',
                    'plan_megas' => 'required|integer|min:0',
                    'plan_description' => 'required|string|max:250',
                ];
            case "PATCH":
                return [
                    'plan_name' => 'sometimes|required|string|max:50',
                    'plan_value' => 'sometimes|required|numeric|min:0',
                    'plan_megas' => 'sometimes|required|integer|min:0',
                    'plan_description' => 'sometimes|required|string|max:250',
                ];
            case "DELETE":
                return [
                    'id' => 'required|string|exists:pla_plans,plan_id',
                ];
            default:
                return [];
        }
    }
}
