<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller
{
    public function index()
    {
        $id = Auth::id();
        $employees = User::where('id', '!=', $id)->get(); // Exclude the current user from the list

        // Logic to list employees
        return Inertia::render('employees/ManageEmployeePage', [
            'employees' => $employees,
        ]);
    }

    public function create()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        // Logic to show the form for creating a new employee
        return Inertia::render('employees/CreateEmployeePage', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'married' => 'boolean',
            'joined_at' => 'required|date',
            'birth_date' => 'nullable|date',
            'password' => 'required|string|min:6|confirmed',
            'role_id' => 'required|exists:roles,id',
        ]);

        $employee = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'address' => $data['address'],
            'married' => $data['married'],
            'joined_at' => Carbon::parse($data['joined_at'])->toDateString(),
            'birth_date' => Carbon::parse($data['birth_date'])->toDateString(),
            'password' => Hash::make($data['password']),
        ]);

        $employee->assignRole($data['role_id']);

        // Logic to store the new employee
        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }
}
