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
        // If you truly want *all* rows without pagination, use:
        // return $query->orderByDesc('id')->get();
    }
}
