<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreResearchRequest extends FormRequest
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
            'title' => ['required', 'string'],
            'authorship_nature' => ['required', 'string'],
            'authors' => ['required', 'string'],
            'research_type_id' => ['required'],
            'research_field_id' => ['required'],
            'socio_economic_objective_id' => ['required'],
            'file_path' => ['required', 'string'],
        ];
    }
}
