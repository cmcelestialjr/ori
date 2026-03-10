<?php

namespace App\Enums;

enum LegendEnum: string
{
    case PER_HOUR = 'per hour';
    case PER_DAY = 'per day';
    case PER_PROJECT = 'per project';
    case PER_PRESENTATION = 'per presentation';
}