<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;

Route::get('/stats/employees/count', [EmployeeController::class, 'count']);
Route::get('/employees', [EmployeeController::class, 'index']);
