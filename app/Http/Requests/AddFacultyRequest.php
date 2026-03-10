<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class AddFacultyRequest extends FormRequest
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
            'fname' => ['required', 'string', 'max:255'],
            'lname' => ['required', 'string', 'max:255'],
            'mi' => ['string', 'nullable', 'max:1'],
            'suffix' => ['string', 'nullable', 'max:50'],
            'image_path' => ['string', 'nullable', 'max:2048'],
            'college' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:100'],
            'academic_rank' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'unique:users'],
            'password' => ['required', 'string', Password::defaults()]
        ];
    }
}
