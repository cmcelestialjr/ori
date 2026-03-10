<?php

namespace App\Enums;

enum PointsRatingEnum: string
{
    case POOR = 'poor';
    case BELOW_SATISFACTORY = 'below satisfactory';
    case SATISFACTORY = 'satisfactory';
    case ABOVE_SATISFACTORY = 'above satisfactory';
    case EXCELLENT = 'excellent';   
}