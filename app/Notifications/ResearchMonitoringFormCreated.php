<?php

namespace App\Notifications;

use App\Models\ResearchMonitoringForm;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;


class ResearchMonitoringFormCreated extends Notification
{
    use Queueable;

    protected $form;
    /**
     * Create a new notification instance.
     */
    public function __construct(ResearchMonitoringForm $form)
    {
        $this->form = $form;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => 'Research monitoring form created!'
        ];
    }
}
