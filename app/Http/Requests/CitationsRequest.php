<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CitationsRequest extends FormRequest
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
            'research_involvement_type' => ['required', 'integer'],
            'research_documents' => ['required', 'array'],
            'research_documents.*' => ['string'],
            'sdg_mappings' => ['required', 'array'],
            'sdg_mappings.*' => ['integer'], 
            'agenda_mappings' => ['required', 'array'],
            'agenda_mappings.*' => ['integer'],

            'citations.authors' => ['required', 'string'],
            'citations.cited_authors' => ['required', 'string'],
            'citations.cited_article_title' => ['required', 'string'],
            'citations.research_title' => ['required', 'string'],
            'citations.journal_title' => ['required', 'string'],
            'citations.issno_vol_pages' => ['nullable', 'string'],
            'citations.date' => ['required', 'date'],
            'citations.publisher_name' => ['required', 'string'],
            'citations.url_link' => ['nullable', 'url'],
            'citations.scopus_link' => ['nullable', 'url'],
            'citations.points' => ['required', 'integer'],
        ];
    }
}
