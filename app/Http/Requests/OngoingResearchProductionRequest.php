<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OngoingResearchProductionRequest extends FormRequest
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
        return [
            'stage_research_production' => ['required', 'string'],
            'target_date_completion' => ['required', 'date_format:m/d/Y'],
            'nature_fund_source' => ['required', 'string']
        ];
    }
}
