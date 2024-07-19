<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IpsRequest extends FormRequest
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
            case 'POST':
                return [
                    'ip_address' => 'required|string|unique:ip_ip,ip_address',
                    'distribution_nap_id' => 'nullable|exists:ip_distributions,distribution_nap_id',
                    'last_mile_nap_id' => 'nullable|exists:ip_last_miles,last_mile_nap_id',
                    'ip_status' => 'required|boolean',
                ];

            case 'PATCH':
                return [
                    'distribution_nap_id' => 'nullable|exists:ip_distributions,distribution_nap_id',
                    'last_mile_nap_id' => 'nullable|exists:ip_last_miles,last_mile_nap_id',
                    'ip_status' => 'required|boolean',
                ];

            default:
                return [];
        }
    }
}
