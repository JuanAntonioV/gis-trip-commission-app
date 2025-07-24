<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function canRegister()
    {
        $alreadyRegistered = User::role('super admin')->exists();

        if (!$alreadyRegistered) {
            return redirect()->route('register');
        }

        return redirect()->route('login');
    }
}
