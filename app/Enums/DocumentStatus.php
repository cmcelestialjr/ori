<?php

namespace App\Enums;

enum DocumentStatus: string
{
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}