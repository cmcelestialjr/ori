<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Enums\RoleEnum;
use Illuminate\Support\Facades\Hash;
use App\Traits\useFileHandler;
use App\Http\Requests\LoginRequest;
use App\Models\College;
use App\Models\Unit;
use App\Traits\HttpResponses;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class AuthController extends Controller
{
    use HttpResponses;
    use useFileHandler;

    public function accessGateway(Request $request)
    {
        $token = $request->query('token');
        $username = $request->query('username'); // Assuming this is 'id_no'
        // You can also capture $college and $unit if you need to save them to the user session
        
        if (!$token || !$username) {
            return redirect('/login?error=missing_params');
        }

        // Security check: Find user by ID and matching the token provided by the central system
        $user = User::where('id_no', $username)
                    ->where('remember_token', $token) // Ensure the central system sets this token
                    ->with('roles:id,name')
                    ->first();

        if (!$user) {
            return redirect('/login?error=invalid_gateway_auth');
        }

        if($user->college == '' || $user->college == NULL){
            $college = College::find($request->college);
            if($college){
                $user->college = $college->college;
                $user->save();
            }
        }

        if($user->unit == '' || $user->unit == NULL){
            $unit = Unit::find($request->unit);
            if($unit){
                $user->unit = $unit->unit;
                $user->save();
            }
        }


        // Log the user into the 'web' guard (Sanctum uses this session)
        Auth::login($user);
        $request->session()->regenerate();

        // Optionally store the college/unit in the session for the SPA to read later via an API
        session(['active_college' => $request->query('college'), 'active_unit' => $request->query('unit')]);
        
        // Redirect to the frontend root
        return redirect('/');
    }

    public function login(LoginRequest $req)
    {
      $req->validated($req->all());

      if(!Auth::attempt(['email' => $req->email, 'password' => $req->password])){
        return $this->error('', 'Login failed. Invalid email or password.', 500);
      }

      $user = User::where('email', $req->email)->with('roles:id,name')->first();

      Auth::login($user);

      $req->session()->regenerate();

      return $this->success($user, 'Login Successful');
    }
    public function logout(Request $request){

      Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

      return $this->success('', 'Logged out successfully');
    }

    /**
     * Send OTP to the user's email for verification before registration.
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users,email',
        ]);

        // Generate 6-digit OTP
        $otp = rand(100000, 999999);

        // Delete any existing OTP for this email
        DB::table('otp_codes')->where('email', $request->email)->delete();

        // Store new OTP with 10-minute expiry
        DB::table('otp_codes')->insert([
            'email' => $request->email,
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Send OTP via email
        Mail::raw("Your OTP verification code is: {$otp}\n\nThis code will expire in 10 minutes.", function ($message) use ($request) {
            $message->to($request->email)
                    ->subject('LNU ORI - Email Verification Code');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'OTP has been sent to your email.',
        ]);
    }

    /**
     * Register a new user after verifying the OTP.
     */
    public function register(Request $request)
    {
        $request->validate([
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'mi' => 'nullable|string|max:1',
            'suffix' => 'nullable|string|max:30',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'college' => 'required|string',
            'unit' => 'required|string',
            'academic_rank' => 'required|string',
            'image_path' => 'nullable|string',
            'otp' => 'required|string',
        ]);

        // Verify OTP
        $otpRecord = DB::table('otp_codes')
            ->where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired OTP. Please request a new one.',
            ], 422);
        }

        $imagePath = null;
        if ($request->has('image_path') && $request->image_path) {
            $imagePath = $this->moveToStorage($request->image_path);
        }

        $user = User::create([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'mi' => $request->mi,
            'suffix' => $request->suffix,
            'college' => $request->college,
            'unit' => $request->unit,
            'academic_rank' => $request->academic_rank,
            'email' => $request->email,
            'image_path' => $imagePath,
            'password' => Hash::make($request->password),
        ]);
        $user->assignRole(RoleEnum::FACULTY);

        // Clean up the OTP record
        DB::table('otp_codes')->where('email', $request->email)->delete();

        return response()->json([
            'status' => 'Request was successfull',
            'message' => 'Registration successful! You can now log in.',
            'user' => $user
        ], 201);
    }
}
