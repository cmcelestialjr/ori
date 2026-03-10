<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PointsNotification extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $message;
    public $url;
    public $image_path;
    public $name;

    /**
     * Create a new notification instance.
     */
    public function __construct($message, $url, $image_path, $name)
    {
        $this->message = $message;
        $this->url = $url;
        $this->image_path = $image_path;
        $this->name= $name;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'url' => $this->url,
            'image_path' => $this->image_path ?? '',
            'name' => $this->name ?? '',
            'created_at' => now(),
            'read_at' => null,
        ];
    }
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->message,
            'url' => $this->url,
            'image_path' => $this->image_path ?? '',
            'name' => $this->name ?? '',
            'created_at' => now(),
            'read_at' => null,
        ]);
    }
}
