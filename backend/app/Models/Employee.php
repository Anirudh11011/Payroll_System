<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
    'employee_code',
    'first_name',
    'last_name',
    'email',
    'role',
    'department',
    'active',
];
}
