<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case FACULTY = 'faculty';
    case RESEARCH_COORDINATOR = 'research-coordinator';
}