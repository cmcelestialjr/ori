<?php

namespace App\Enums;

enum ResearchInvolvementTypes: string
{
    case RESEARCH_PRODUCTION = 'Research Production';
    case OTHER_RESEARCH_INVOLVEMENT = 'Other Research Involvement';
    case PRODUCTIONS = 'Productions';
    case CITATIONS = 'Citations';
    case ATTENDANCE_TO_RESEARCH = 'Attendance to Research/Activity/Seminar';
    case CREATIVE_WORKS_PERFORMING_ARTS = 'Creative Works Performing Arts';
    case CREATIVE_WORKS_EXHIBITION = 'Creative Works Exhibition';
    case CREATIVE_WORKS_DESIGN = 'Creative Works Design';
    case CREATIVE_WORKS_LITERARY = 'Creative Works Literary';
    case SCOPUS = 'Scopus';
}
