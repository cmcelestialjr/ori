<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PublishedResearchProductionRequest extends FormRequest
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
            'agenda_mappings.*' => ['integer'],

            'published.title' => 'required|string|max:255',
            'published.authorship_nature' => 'required|string|max:255',
            'published.authors' => 'required|string',
            'published.research_field_id' => 'required|exists:research_fields,id',
            'published.research_type_id' => 'required|exists:research_types,id',
            'published.socio_economic_objective_id' => 'required|exists:socio_economic_objectives,id',
            'published.date' => 'required|date',
            'published.coverage' => 'required|string|max:255',
            'published.indexing' => 'required|string|max:255',
            'published.journal_name' => 'required|string|max:255',
            'published.issno_vol_pages' => 'required|string|max:255',
            'published.editor_publisher' => 'required|string|max:255',
            'published.article_link' => 'required|url|max:2048',
            'published.num_citations_date' => 'required|integer',
            'published.scopus_link' => 'nullable|url|max:2048',
            'published.points' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages()
    {
        return [
            'published.indexing.required' => 'Indexing is required'
        ];
    }
}
