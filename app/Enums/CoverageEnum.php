<?php

namespace App\Enums;

enum CoverageEnum: string
{
    case UNIT_DEPARTMENT = 'unit/department';
    case COLLEGE_WIDE = 'college-wide';
    case UNIVERSITY_WIDE = 'university-wide';
    case REGIONAL_NATIONAL = 'regional/national';
    case INTERNATIONAL = 'international';
}