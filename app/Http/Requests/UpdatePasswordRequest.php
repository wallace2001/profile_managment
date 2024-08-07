<?php

namespace App\Http\Requests;

use App\Rules\CheckPasswordRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'old_password' => ['required', 'min:8', new CheckPasswordRule],
            'password'     => 'required|min:8|confirmed',
        ];
    }
}
