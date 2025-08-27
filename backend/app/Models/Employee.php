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
    'gender',
    'date_of_birth',
    'role_id',
    'department_id',
    'job_title_id',
    'leaves_remaining',
    'active',
];

public function role() { return $this->belongsTo(Role::class); }
public function department() { return $this->belongsTo(Department::class); }
public function jobTitle() { return $this->belongsTo(JobTitle::class); }


}
