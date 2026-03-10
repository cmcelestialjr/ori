<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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

        $targetUser = $this->route('user') ?? $this->route('coordinator') ?? $this->route('faculty') ?? $this->route('id');

        $idToIgnore = is_object($targetUser) ? $targetUser->id : $targetUser;

        if (!$idToIgnore) {
            $idToIgnore = auth()->id();
        }

        return [
            "fname" => ['required', 'string', 'max:255'],
            "lname" => ['required', 'string', 'max:255'],
            "mi" => ['string', 'nullable', 'max:1'],
            "suffix" => ['string', 'nullable', 'max:10'],
            "image_path" => ['string', 'nullable'],
            "college" => ['required', 'string', 'max:255'],
            "unit" => ['required', 'string', 'max:100'],
            "academic_rank" => ['required', 'string', 'max:100'],


            "email" => ['required', 'string', 'unique:users,email,' . $idToIgnore],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'mi' => 'MI',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'mi.max' => 'The MI field must not be greater than 1 character.',
        ];
    }
}
