<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    public function handleQuery(Request $request)
    {
        $question = $request->input('question');

        if (!$question) {
            return response()->json(['error' => 'No question provided'], 400);
        }

        try {
            // Step 1: Convert natural language to SQL using Groq
            $sqlPayload = [
                'model' => 'llama-3.1-8b-instant', // ✅ Correct Groq model name
                'messages' => [
                    [
                        'role' => 'system',
                        'content' =>  'You only write SQL SELECT queries for a SQLite database. Do NOT include any other text, explanations, or markdown. Only output the SQL query itself. The database schema is as follows:
- employees(id, employee_code, first_name, last_name, email, gender, date_of_birth, leaves_remaining, role_id, department_id, job_title_id, active)
- roles(id, name)
- departments(id, name)
- job_titles(id, title)',
                    ],
                    [
                        'role' => 'user',
                        'content' => "Convert this question to a SELECT SQL query for SQLite:\n\n\"$question\"",
                    ],
                ],
                'temperature' => 0,
            ];

            Log::info('Groq API SQL Payload', ['payload' => $sqlPayload]);

            $sqlResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
                'Content-Type' => 'application/json',
            ])
            ->withoutVerifying()
            ->post('https://api.groq.com/openai/v1/chat/completions', $sqlPayload);

            $sqlResponse->throw(); // ❌ This is a crucial addition to throw exceptions on client errors (4xx) and server errors (5xx)

            $sqlText = trim($sqlResponse['choices'][0]['message']['content'] ?? '');
            Log::info('Generated SQL from Groq', ['sql' => $sqlText]);

            // Security check: Ensure the query is a SELECT statement
            if (!preg_match('/^select/i', $sqlText)) {
                return response()->json(['error' => 'Only SELECT queries are allowed.', 'sql' => $sqlText], 400);
            }

            // Step 2: Execute the SQL query on the database
            $results = DB::select($sqlText);

            // Step 3: Send SQL results + question to Groq for natural language answer
            $jsonResults = json_encode($results);

            $answerPrompt = "The user asked: \"$question\"\n\nThe SQL result is:\n$jsonResults\n\nAnswer the user's question in clear natural language based on the data above. You must use the provided data to formulate your response.";

            $answerPayload = [
                'model' => 'llama-3.1-8b-instant', // Using the same consistent model
                'messages' => [
                    ['role' => 'system', 'content' => 'You convert SQL results into clear natural language answers.'],
                    ['role' => 'user', 'content' => $answerPrompt],
                ],
                'temperature' => 0.5,
            ];

            Log::info('Groq API Answer Payload', ['payload' => $answerPayload]);

            $answerResponse = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
                'Content-Type' => 'application/json',
            ])
            ->withoutVerifying()
            ->post('https://api.groq.com/openai/v1/chat/completions', $answerPayload);

            $answerResponse->throw(); // ❌ Another crucial addition to catch API errors

            $naturalAnswer = trim($answerResponse['choices'][0]['message']['content'] ?? '');

            return response()->json([
                'sql' => $sqlText,
                'data' => $results,
                'answer' => $naturalAnswer,
            ]);

        } catch (\Illuminate\Http\Client\RequestException $e) {
            // Handle HTTP client errors from Groq API (e.g., 400, 401, 500)
            Log::error('Groq API Request Failed', [
                'error' => $e->getMessage(),
                'status_code' => $e->response->status(),
                'response_body' => $e->response->body(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => '❌ API error: ' . $e->getMessage()], 500);

        } catch (\Exception $e) {
            // Handle other general errors
            Log::error('Chatbot error', ['exception' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => '❌ An unexpected error occurred. Please check the logs.'], 500);
        }
    }
}