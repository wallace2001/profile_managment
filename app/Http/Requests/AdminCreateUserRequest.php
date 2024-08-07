<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminCreateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Permitir todas as solicitações, você pode adicionar lógica aqui se necessário
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email'     => 'required|email|unique:users',
            'password'  => 'required|min:8',
            'name'      => 'required|min:2',
            'last_name' => 'required|min:2',
            'role'      => 'required|exists:roles,id',
        ];
    }
}
