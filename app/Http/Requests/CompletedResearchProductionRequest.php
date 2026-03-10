<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompletedResearchProductionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'research_involvement_type' => ['required', 'integer'],
            'research_documents' => ['required', 'array'],
            'research_documents.*' => ['string'], // Each document should be a string (file path)
            'sdg_mappings' => ['required', 'array'],
            'sdg_mappings.*' => ['integer'], // Each SDG mapping should be an integer
            'agenda_mappings' => ['required', 'array'],
            'agenda_mappings.*' => ['integer'], // Each agenda mapping should be an integer

            // Validation only if 'completed' is included
            'completed' => ['nullable', 'array'],
            'completed.title' => ['required_with:completed', 'string'],
            'completed.authorship_nature' => ['required_with:completed', 'string'],
            'completed.authors' => ['required_with:completed', 'string'],
            'completed.research_field_id' => ['required_with:completed', 'integer'],
            'completed.research_type_id' => ['required_with:completed', 'integer'],
            'completed.socio_economic_objective_id' => ['nullable', 'integer'],
            'completed.date_completed' => ['required_with:completed', 'date'],
            'completed.nature_fund_source' => ['required_with:completed', 'string'],
            'completed.target_date_publication' => ['required_with:completed', 'date'],
            'completed.points' => ['required_with:completed', 'numeric', 'min:0'],
        ];
    }
}
