<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PeerReviewStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
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

            'peerjournal.name' => ['string','required'],
            'peerjournal.article_title' => ['string'],
            'peerjournal.article_reviewed' => ['string'],
            'peerjournal.abstract_title' => ['string'],
            'peerjournal.abstract_reviewed' => ['string'],
            'peerjournal.coverage' => ['string','required'],
            'peerjournal.date_reviewed' => ['date','required'],
            'peerjournal.organization' => ['string','required'],
            'peerjournal.points' => ['integer','required'],
        ];
    }
}
