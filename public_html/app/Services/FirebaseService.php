<?php

namespace App\Services;

use Kreait\Firebase\Factory; // Correct class name and namespace
use Kreait\Firebase\Messaging\CloudMessage;

final class FirebaseService
{
    protected $messaging;

    public function __construct()
    {
        $serviceAccountPath = storage_path('smart-pay-132f5-firebase-adminsdk-9ukbd-16eb5c10b9.json');

        $factory = (new Factory)->withServiceAccount($serviceAccountPath); // Correct usage of Factory
        $this->messaging = $factory->createMessaging();
    }

    public function sendNotification($token, $title, $body, $data = [])
    {
        // Check if the image URL is passed in the data array and set it in the notification
        $notification = [
            'title' => $title,
            'body' => $body,
            'image' => $data['image'] ?? null, // Include image URL if available
        ];

        $message = CloudMessage::withTarget('token', $token)
            ->withNotification($notification)
            ->withData($data);

        $this->messaging->send($message);    
    }
}


