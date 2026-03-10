<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IntellectualPropertyStoreRequest extends FormRequest
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

            'intellectual.type' => ['string','required'],
            'intellectual.title' => ['string','required'],
            'intellectual.owner_name' => ['string','required'],
            'intellectual.processor_name' => ['string','required'],
            'intellectual.document_id' => ['string','required'],
            'intellectual.registration_date' => ['date','required'],
            'intellectual.expiry_date' => ['date','nullable'],
            'intellectual.acceptance_date' => ['date','nullable'],
            'intellectual.publication_date' => ['date','nullable'],
            'intellectual.grant_date' => ['date','nullable'],
            'intellectual.points' => ['integer','required'],

        ];
    }
}
