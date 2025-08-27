<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('employees', function (Blueprint $table) {
        $table->enum('gender', ['male', 'female', 'other'])->nullable()->after('email');
        $table->date('date_of_birth')->nullable()->after('gender');
        $table->integer('leaves_remaining')->default(0)->after('date_of_birth');

        $table->unsignedBigInteger('role_id')->nullable()->after('leaves_remaining');
        $table->unsignedBigInteger('department_id')->nullable()->after('role_id');
        $table->unsignedBigInteger('job_title_id')->nullable()->after('department_id');

        $table->foreign('role_id')->references('id')->on('roles')->nullOnDelete();
        $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
        $table->foreign('job_title_id')->references('id')->on('job_titles')->nullOnDelete();
    });
}

public function down(): void
{
    Schema::table('employees', function (Blueprint $table) {
        $table->dropForeign(['role_id']);
        $table->dropForeign(['department_id']);
        $table->dropForeign(['job_title_id']);

        $table->dropColumn(['gender', 'date_of_birth', 'leaves_remaining', 'role_id', 'department_id', 'job_title_id']);
    });
}
};
