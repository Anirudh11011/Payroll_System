<?php

namespace App\Http\Controllers;
use App\Models\Employee;    
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function count()
    {
        return response()->json([
            'totalEmployees' => Employee::count(),
        ]);
    }

    // Employees tab: list employees (with simple search + pagination)
    public function index(Request $request)
    {
        $query = Employee::query();

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(function ($w) use ($q) {
                $w->where('first_name', 'like', "%$q%")
                  ->orWhere('last_name', 'like', "%$q%")
                  ->orWhere('employee_code', 'like', "%$q%")
                  ->orWhere('email', 'like', "%$q%");
            });
        }

        return $query->orderByDesc('id')->paginate($request->integer('per_page', 20));
        
    }

    public function store(Request $request)
{
    $data = $request->validate([
        'first_name'       => 'required|string|max:100',
        'last_name'        => 'required|string|max:100',
        'email'            => 'required|email|unique:employees,email',
        'gender'           => 'nullable|in:male,female,other',
        'date_of_birth'    => 'nullable|date',
        'role_id'          => 'nullable|exists:roles,id',
        'department_id'    => 'nullable|exists:departments,id',
        'job_title_id'     => 'nullable|exists:job_titles,id',
        'leaves_remaining' => 'nullable|integer|min:0',
        'active'           => 'boolean',
    ]);

    if (empty($data['employee_code'])) {
        $latestId = Employee::max('id') + 1;
        $data['employee_code'] = 'EMP' . str_pad($latestId, 4, '0', STR_PAD_LEFT);
    }

    $employee = Employee::create($data);

    // eager load relationships for React
    $employee->load(['role', 'department', 'jobTitle']);

    return response()->json($employee, 201);
}

}
