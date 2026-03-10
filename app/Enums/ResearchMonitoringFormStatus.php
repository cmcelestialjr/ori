<?php

namespace App\Enums;

enum ResearchMonitoringFormStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case EVALUATED = 'evaluated';
}