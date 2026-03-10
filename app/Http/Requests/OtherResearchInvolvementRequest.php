<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OtherResearchInvolvementRequest extends FormRequest
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
            'research_documents.*' => ['string'],
            'sdg_mappings' => ['required', 'array'],
            'sdg_mappings.*' => ['integer'], 
            'agenda_mappings' => ['required', 'array'],
            'agenda_mappings.*' => ['integer'],

            
            'otherresearch.research_involvement' => ['required', 'string', 'max:255'],
            'otherresearch.research_title' => ['nullable', 'string', 'max:255'],
            'otherresearch.date'=> ['required'],
            'otherresearch.points' => ['integer','required'],
        ];
    }
}
