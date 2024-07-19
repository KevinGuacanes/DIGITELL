<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OltsRequest extends FormRequest
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
                  
                    'olt_name' => 'required|string|max:50',
                    'olt_address' => 'required|string|max:100',
                    'olt_coordx' => 'required|string|max:25',
                    'olt_coordy' => 'required|string|max:25',
                    'olt_ports' => 'required|integer|between:0,24',
                ];
            case "PATCH":
                return [
                    'olt_name' => 'sometimes|required|string|max:50',
                    'olt_address' => 'sometimes|required|string|max:100',
                    'olt_coordx' => 'sometimes|required|string|max:25',
                    'olt_coordy' => 'sometimes|required|string|max:25',
                    'olt_ports' => 'sometimes|required|integer|between:0,24',
                ];
            case "DELETE":
                return [
                    'id' => 'required|string|exists:olts,olt_id',
                ];
            default:
                return [];
        }
    
    }
}
