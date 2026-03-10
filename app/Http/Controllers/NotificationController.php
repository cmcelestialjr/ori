<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\HttpResponses;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use HttpResponses;
    public function index()
    {
        $user = auth()->user();

        $notifications = [];

        foreach($user->notifications as $notif) {
            $notifications[] = $notif;
        };


        return $this->success($notifications);
    }

    public function markAsRead(Request $request)
    {
        $user = auth()->user();
        
        $user->notifications()->where('id', $request->notificationId)->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function clearAll()
    {
        auth()->user()->notifications()->delete();
    }
}
