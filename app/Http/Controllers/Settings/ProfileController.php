<?php

namespace App\Http\Controllers\Settings;

use App\Helpers\Formatter;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $payload['birth_date'] = $payload['birth_date'] ? date('Y-m-d', strtotime($payload['birth_date'])) : null;
        $payload['joined_at'] = $payload['joined_at'] ? date('Y-m-d', strtotime($payload['joined_at'])) : null;
        $formattedPhone = Formatter::formatPhoneNumber($payload['phone']);
        $payload['phone'] = $formattedPhone ? $formattedPhone : null;
        $payload['married'] = $payload['married'] ? true : false;

        $request->user()->fill($payload);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
