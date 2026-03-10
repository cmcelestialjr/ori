<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePresentedRequest extends FormRequest
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
            'date_presented' => ['required', 'date'],
            'activity_name' => ['required', 'string'],
            'conference_type' => ['required', 'string'],
            'presentation_nature' => ['required', 'string'],
            'conference_place' => ['required', 'string'],
            'conference_organization' => ['required', 'string'],
            'awards_received_ifany' => ['string'],
            'abstract_file_path' => ['required', 'string'],
            'opportunity_for_publication' => ['required', 'boolean'],
            'targe_date_publication' => ['date']
        ];
    }
}
