<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ChatbotController;

Route::get('/stats/employees/count', [EmployeeController::class, 'count']);
Route::get('/employees', [EmployeeController::class, 'index']);
Route::post('/employees/add', [EmployeeController::class, 'store']);
Route::post('/chatbot/query', [ChatbotController::class, 'handleQuery']);



// chatbot testing
// use Illuminate\Support\Facades\Http;
// use Illuminate\Support\Facades\DB;

// Route::get('/chatbot/test', function () {
//     $question = 'How many employees are there in total and list them?';

//     $schema = <<<SCHEMA
// Tables:
// - employees(id, employee_code, first_name, last_name, email, gender, date_of_birth, leaves_remaining, role_id, department_id, job_title_id, active)
// SCHEMA;

//     $prompt = "You are a SQL assistant. Use the schema below to write a SQLite-compatible SQL query for the user's question.

// $schema

// User question: \"$question\"
// SQL:";

//     $response = Http::withHeaders([
//         'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
//     ])->post('https://api.groq.com/openai/v1/chat/completions', [
//         'model' => 'mixtral-8x7b-32768',
//         'messages' => [
//             ['role' => 'user', 'content' => $prompt]
//         ],
//         'temperature' => 0.2,
//     ]);

//     $sql = $response['choices'][0]['message']['content'] ?? '';

//     if (!str_starts_with(strtolower(trim($sql)), 'select')) {
//         return ['error' => 'Only SELECT allowed'];
//     }

//     $result = DB::select(DB::raw($sql));

//     return [
//         'question' => $question,
//         'sql' => $sql,
//         'result' => $result
//     ];
// });
