<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'     => 'required|email|unique:users',
            'password'  => 'required|min:8',
            'name'      => 'required|min:2',
            'last_name' => 'required|min:2',
        ];
    }
}
