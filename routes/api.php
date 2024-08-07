<?php

use Illuminate\Support\Facades\Route;

Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'login']);
Route::put('/password', [\App\Http\Controllers\Auth\UpdatePasswordController::class, 'update']);
Route::post('/reset-password', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'send']);
Route::put('/reset-password', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'resetPassword']);

Route::middleware('auth:api')->group(function () {

    Route::middleware('role:' . \App\Enums\Roles::ADMIN->value)
         ->apiResource('admin', \App\Http\Controllers\Auth\AdminController::class);

    Route::middleware('role:' . \App\Enums\Roles::ADMIN->value)
        ->apiResource('roles', \App\Http\Controllers\Auth\RolesController::class);
});
