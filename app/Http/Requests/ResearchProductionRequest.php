<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ResearchProductionRequest extends FormRequest
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
            'research_title' => ['required', 'string', 'max:255'],
            'types_of_research' => ['required', 'string', 'max:255'],
            'field_of_randb' => ['required', 'string', 'max:255'],
            'socioeconomic_objective' => ['required', 'string', 'max:255'],
            'authorship_nature' => ['required', 'string', 'max:255']
        ];
    }
}
