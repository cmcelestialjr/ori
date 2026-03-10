<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Enums\RoleEnum;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CoordinatorController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\SdgAgendaMapping;
use App\Http\Controllers\ResearchAttendanceController;
use App\Http\Controllers\ResearchMonitoringFormController;
use App\Http\Controllers\OngoingResearchProductionController;
use App\Http\Controllers\CompletedResearchProductionController;
use App\Http\Controllers\PresentedResearchProductionController;
use App\Http\Controllers\PublishedResearchProductionController;
use App\Http\Controllers\OtherResearchInvolvementController;
use App\Http\Controllers\CitationsController;
use App\Http\Controllers\CreativeWorksDesignController;
use App\Http\Controllers\CreativeWorksExhibitionController;
use App\Http\Controllers\CreativeWorksLiteraryController;
use App\Http\Controllers\CreativeWorksPerformingArtsController;
use App\Http\Controllers\OCRController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ResearchController;
use App\Http\Controllers\PointController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AwardsManagementController;
use App\Http\Controllers\ChangePasswordController;
use App\Http\Controllers\CitationPointController;
use App\Http\Controllers\CollegeController;
use App\Http\Controllers\CompletedResearchPointsController;
use App\Http\Controllers\CompletedStudentThesesInvolvementPointController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\FindPublishedResearch;
use App\Http\Controllers\IntellectualPropertyController;
use App\Http\Controllers\InternalExternalResearchPointController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ParticipationToResearchController;
use App\Http\Controllers\PeerReviewController;
use App\Http\Controllers\PeerReviewPointsController;
use App\Http\Controllers\PublishedResearchPointController;
use App\Http\Controllers\ScopusJournalCheckerController;
use App\Http\Controllers\SystemBackupController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UtilityPatentCopywriteController;
use Symfony\Component\Process\Process;

Route::get('/test-sqlite', function () {
    $process = new Process(['sqlite3', '--version']);
    $process->run();

    return $process->getOutput() ?: $process->getErrorOutput();
});

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {

    $user = $request->user();

    return response()->json($user->load(['roles']));
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/send-otp', [AuthController::class, 'sendOtp']);

// Public routes for registration page (no auth required)
Route::get('/public/colleges', [CollegeController::class, 'index']);
Route::get('/public/units', [UnitController::class, 'index']);
Route::post('/public/file-upload-public', [FileUploadController::class, 'uploadPublic']);

Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/clear-all', [NotificationController::class, 'clearAll']);

    Route::post('/password-reset/{user}', ChangePasswordController::class);

    Route::post('/validate-document', [FacultyController::class, 'validateDocument']);
    Route::get('/faculty-archives', [FacultyController::class, 'archivedSubmission']);
    Route::get('faculty-dashboard', [FacultyController::class, 'index'])->middleware('role:faculty');
    Route::get('faculty-monitoring-forms', [FacultyController::class, 'monitoringForms'])->middleware('role:faculty');

    Route::get('/backup-list', [SystemBackupController::class, 'index'])->middleware('role:admin');
    Route::get('/backup', [SystemBackupController::class, 'backup'])->middleware('role:admin');
    Route::delete('/backup/{backup}', [SystemBackupController::class, 'destroy'])->middleware('role:admin');
    Route::get('/download-backup/{backup}', [SystemBackupController::class, 'download'])->middleware('role:admin');
    Route::post('/restore-backup', [SystemBackupController::class, 'restore'])->middleware('role:admin');

    Route::get('/research-details', [ResearchController::class, 'get'])->middleware('role:admin|faculty');

    Route::get('/academic-years', [AcademicYearController::class, 'index']);
    Route::post('/academic-years', [AcademicYearController::class, 'store'])->middleware('role:admin');
    Route::get('/archives', [AcademicYearController::class, 'getArchived'])->middleware('role:admin');
    Route::put('/academic-years/{academic}', [AcademicYearController::class, 'update'])->middleware('role:admin');
    Route::put('/academic-years/{academic}/status', [AcademicYearController::class, 'updateStatus']);
    Route::put('/archive-research', [AcademicYearController::class, 'archiveSubmissions'])->middleware('role:admin');

    Route::get('/semester-points', [PointController::class, 'semesterPoints']);
    Route::get('/points', [PointController::class, 'index']);

    Route::post('file-upload-private', [FileUploadController::class, 'uploadPrivate'])->middleware('role:faculty|admin');
    Route::get('certificate/{involvement}/temp/{certificate}', [FileUploadController::class, 'certificate'])->middleware('role:faculty|admin');

    Route::post('file-upload-public', [FileUploadController::class, 'uploadPublic']);

    Route::post('check-scopus', ScopusJournalCheckerController::class);

    Route::get('/monitoring-form/{form}/ocr', [OCRController::class, 'OCR']);

    Route::patch('/roles/{user}', [RoleController::class, 'update'])->middleware('permission:assign-role');

    Route::post('/crossref/api/published-research', FindPublishedResearch::class);

    Route::get('/completed/points', [CompletedResearchPointsController::class, 'index']);
    Route::put('/completed/update-points', [CompletedResearchPointsController::class, 'update'])->middleware('role:admin');

    Route::get('/published/points', [PublishedResearchPointController::class, 'index'])->middleware('role:admin');
    Route::put('/published/{points}/update-points', [PublishedResearchPointController::class, 'update'])->middleware('role:admin');
    Route::post('/published/points', [PublishedResearchPointController::class, 'getPoints']);

    Route::get('/peer-review/points', [PeerReviewPointsController::class, 'index'])->middleware('role:admin');
    Route::post('/peer-review/points', [PeerReviewController::class, 'getPoints']);
    Route::put('/peer-review/{points}/update-points', [PeerReviewPointsController::class, 'update'])->middleware('role:admin');

    Route::post('/peerjournal', [PeerReviewController::class, 'store'])->middleware('permission:research-monitoring-form-store');
    Route::post('/peer-review/validate', [PeerReviewController::class, 'validatePeerReviewCertificate']);

    Route::get('/student-theses/points', [CompletedStudentThesesInvolvementPointController::class, 'index'])->middleware('role:admin');
    Route::put('/student-theses/{points}/update-points', [CompletedStudentThesesInvolvementPointController::class, 'update'])->middleware('role:admin');

    Route::get('/internal-external-points', [InternalExternalResearchPointController::class, 'index'])->middleware('role:admin');
    Route::get('/internal-external-points/{points}', [InternalExternalResearchPointController::class, 'show'])->middleware('role:admin');
    Route::put('/internal-external-points/{points}', [InternalExternalResearchPointController::class, 'update'])->middleware('role:admin');

    Route::get('/utility-patent/points', [UtilityPatentCopywriteController::class, 'index']);
    Route::post('/intellectual-property/points', [UtilityPatentCopywriteController::class, 'getPoints']);
    Route::put('/utlity-patent/points/{points}', [UtilityPatentCopywriteController::class, 'update'])->middleware('role:admin');

    Route::get('/awards', [AwardsManagementController::class, 'index'])->middleware('role:admin');
    Route::get('/awards/{awards}', [AwardsManagementController::class, 'show'])->middleware('role:admin');
    Route::put('/awards/{awards}', [AwardsManagementController::class, 'update'])->middleware('role:admin');

    Route::get('/citation/points', [CitationPointController::class, 'index'])->middleware('role:admin');
    Route::get('/points/citation', [CitationPointController::class, 'getPoints']);
    Route::put('/citation/points/{points}', [CitationPointController::class, 'update'])->middleware('role:admin');

    Route::get('/participation-to-research', [ParticipationToResearchController::class, 'index'])->middleware('role:admin');
    Route::post('/participation-to-research/points', [ParticipationToResearchController::class, 'getPoints']);
    Route::put('/participation-to-research/{point}/update', [ParticipationToResearchController::class, 'update'])->middleware('role:admin');

    Route::post('/faculty/{user}/update-role', [UserController::class, 'assignCoordinatorRole'])->middleware('role:admin');
    Route::delete('/faculty/{user}/remove-role', [UserController::class, 'revokeCoordinatorRole'])->middleware('role:admin');

    //college and unit
    Route::get('/colleges', [CollegeController::class, 'index'])->middleware('permission:manage-college');
    Route::post('/college', [CollegeController::class, 'store'])->middleware('permission:manage-college');
    Route::delete('/college/{college}', [CollegeController::class, 'destroy'])->middleware('permission:manage-college');

    Route::get('/units', [UnitController::class, 'index'])->middleware('permission:manage-unit');
    Route::post('/unit', [UnitController::class, 'store'])->middleware('permission:manage-unit');
    Route::delete('/unit/{unit}', [UnitController::class, 'destroy'])->middleware('permission:manage-unit');

    //sdg and agenda
    // SDG and Agenda Mapping Routes
    Route::post('/agendamapping', [SdgAgendaMapping::class, 'agenda_mapping_store'])->middleware('permission:sdg-agenda-create');
    Route::post('/sdgmapping', [SdgAgendaMapping::class, 'sdg_mapping_store'])->middleware('permission:sdg-agenda-create');
    Route::get('/sdg-agenda', [SdgAgendaMapping::class, 'getAgenda'])->middleware('role:faculty|admin');

    // SDG Specific Actions
    Route::get('/sdgmapping/{id}', [SdgAgendaMapping::class, 'sdg_mapping_show']);
    Route::put('/sdgmapping/{id}', [SdgAgendaMapping::class, 'sdg_mapping_update']);
    Route::delete('/sdgmapping/{sdg}', [SdgAgendaMapping::class, 'sdg_mapping_destroy'])->middleware('permission:sdg-agenda-delete');

    // Agenda Specific Actions
    Route::get('/agendamapping/{id}', [SdgAgendaMapping::class, 'agenda_mapping_show']);
    Route::put('/agendamapping/{id}', [SdgAgendaMapping::class, 'agenda_mapping_update']);
    Route::delete('/agendamapping/{agenda}', [SdgAgendaMapping::class, 'agenda_mapping_destroy'])->middleware('permission:sdg-agenda-delete');


    Route::get('/research-involvement-types', [ResearchMonitoringFormController::class, 'researchInvolvementTypes']);

    //research monitoring form
    Route::get('/research-monitoring-forms', [ResearchMonitoringFormController::class, 'index']);

    Route::get('/research-monitoring-form/{researchMonitoringForm}', [ResearchMonitoringFormController::class, 'show'])->middleware(['can:view,researchMonitoringForm']);

    Route::post('/research-monitoring-form', [ResearchMonitoringFormController::class, 'store'])->middleware('permission:research-monitoring-form-store');

    Route::patch('/research-monitoring-form/{researchMonitoringForm}', [ResearchMonitoringFormController::class, 'update'])->middleware(['can:update,researchMonitoringForm']);

    Route::patch('/research-monitoring-form/{form}/update/coordinator', [ResearchMonitoringFormController::class, 'updateCoordinator'])->middleware('permission:research-monitoring-form-update-status');

    Route::put('/admin/research-monitoring-form/{form}/update', [ResearchMonitoringFormController::class, 'updateAdmin'])->middleware('permission:research-monitoring-form-update-status');

    Route::delete("/research-monitoring-form/{researchMonitoringForm}", [ResearchMonitoringFormController::class, 'destroy'])->middleware(['can:delete,researchMonitoringForm']);

    //research involvement type

    Route::post('/intellectual', [IntellectualPropertyController::class, 'store'])->middleware('permission:research-monitoring-form-store');
    Route::post('/intellectual-property/validate', [IntellectualPropertyController::class, 'validateIntellectualProperty'])->middleware('role:faculty|admin');

    Route::get('/participation', [ResearchAttendanceController::class, 'index'])->middleware('permission:research-monitoring-form-index');

    Route::get('/participation/{attendance}', [ResearchAttendanceController::class, 'show'])->middleware('can:view,attendance');

    Route::post('/participation', [ResearchAttendanceController::class, 'store'])->middleware('permission:research-monitoring-form-store');

    Route::patch('/participation/{attendance}', [ResearchAttendanceController::class, 'update'])->middleware('can:update,attendance');

    Route::delete('/participation/{attendance}', [ResearchAttendanceController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');


    Route::get('/citations', [CitationsController::class, 'index'])->middleware('permission:research-monitoring-form-index');

    Route::get('/citation/{citation}', [CitationsController::class, 'show'])->middleware('permission:research-monitoring-form-show');

    Route::post('/citations', [CitationsController::class, 'store'])->middleware('permission:research-monitoring-form-store');

    Route::patch('/citation/{citation}', [CitationsController::class, 'update'])->middleware('permission:research-monitoring-form-update');

    Route::delete('/citation/{citation}', [CitationsController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');


    Route::get('/otherresearch', [OtherResearchInvolvementController::class, 'index'])->middleware('permission:research-monitoring-form-index');

    Route::get('/otherresearch/{otherResearchInvolvement}', [OtherResearchInvolvementController::class, 'show'])->middleware('permission:research-monitoring-form-show');

    Route::post('/otherresearch', [OtherResearchInvolvementController::class, 'store'])->middleware('permission:research-monitoring-form-store');

    Route::post('/otherresearch/points', [OtherResearchInvolvementController::class, 'getPoints']);

    Route::patch('/otherresearch/{otherResearchInvolvement}', [OtherResearchInvolvementController::class, 'update'])->middleware('permission:research-monitoring-form-update');

    Route::delete('/otherresearch/{otherResearchInvolvement}', [OtherResearchInvolvementController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');

    Route::group(['prefix' => 'creative-works'], function () {

        Route::get('/performing-arts', [CreativeWorksPerformingArtsController::class, 'index'])->middleware('permission:research-monitoring-form-show');
        Route::get('/performing-arts/{performingArts}', [CreativeWorksPerformingArtsController::class, 'show'])->middleware('permission:research-monitoring-form-show');
        Route::post('/performing-arts', [CreativeWorksPerformingArtsController::class, 'store'])->middleware('permission:research-monitoring-form-store');
        Route::patch('/performing-arts/{performingArts}', [CreativeWorksPerformingArtsController::class, 'update'])->middleware('permission:research-monitoring-form-update');
        Route::delete('/performing-arts/{performingArts}', [CreativeWorksPerformingArtsController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');

        Route::get('/design', [CreativeWorksDesignController::class, 'index'])->middleware('permission:research-monitoring-form-show');
        Route::get('/design/{design}', [CreativeWorksDesignController::class, 'show'])->middleware('permission:research-monitoring-form-show');
        Route::post('/design', [CreativeWorksDesignController::class, 'store'])->middleware('permission:research-monitoring-form-store');
        Route::patch('/design/{design}', [CreativeWorksDesignController::class, 'update'])->middleware('permission:research-monitoring-form-update');
        Route::delete('/design/{design}', [CreativeWorksDesignController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');

        Route::get('/exhibition', [CreativeWorksExhibitionController::class, 'index'])->middleware('permission:research-monitoring-form-show');
        Route::get('/exhibition/{exhibition}', [CreativeWorksExhibitionController::class, 'show'])->middleware('permission:research-monitoring-form-show');
        Route::post('/exhibition', [CreativeWorksExhibitionController::class, 'store'])->middleware('permission:research-monitoring-form-store');
        Route::patch('/exhibition/{exhibition}', [CreativeWorksExhibitionController::class, 'update'])->middleware('permission:research-monitoring-form-update');
        Route::delete('/exhibition/{exhibition}', [CreativeWorksExhibitionController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');

        Route::get('/literary', [CreativeWorksLiteraryController::class, 'index'])->middleware('permission:research-monitoring-form-show');
        Route::get('/literary/{literary}', [CreativeWorksLiteraryController::class, 'show'])->middleware('permission:research-monitoring-form-show');
        Route::post('/literary', [CreativeWorksLiteraryController::class, 'store'])->middleware('permission:research-monitoring-form-store');
        Route::patch('/literary/{literary}', [CreativeWorksLiteraryController::class, 'update'])->middleware('permission:research-monitoring-form-update');
        Route::delete('/literary/{literary}', [CreativeWorksLiteraryController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');
    });

    Route::get('/ongoing', [OngoingResearchProductionController::class, 'index'])->middleware('permission:research-monitoring-form-show');
    Route::get('/ongoing/{ongoing}', [OngoingResearchProductionController::class, 'show'])->middleware('permission:research-monitoring-form-show');
    Route::post('/ongoing', [OngoingResearchProductionController::class, 'store'])->middleware('permission:research-monitoring-form-store');
    Route::patch('/ongoing/{ongoing}', [OngoingResearchProductionController::class, 'update'])->middleware('can:update,researchMonitoringForm');
    Route::delete('/ongoing/{ongoing}', [OngoingResearchProductionController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');

    Route::get('/completed', [CompletedResearchProductionController::class, 'index'])
        ->middleware('permission:research-monitoring-form-index');

    Route::get('/completed/{completed}', [CompletedResearchProductionController::class, 'show'])
        ->middleware('can:view,researchMonitoringForm');

    Route::post('/completed', [CompletedResearchProductionController::class, 'store'])
        ->middleware('permission:research-monitoring-form-store');

    Route::patch('/completed/{completed}', [CompletedResearchProductionController::class, 'update'])
        ->middleware('can:update,researchMonitoringForm');

    Route::delete('/completed/{completed}', [CompletedResearchProductionController::class, 'destroy'])
        ->middleware('permission:research-monitoring-form-delete');


    Route::post('/presented', [PresentedResearchProductionController::class, 'store'])
        ->middleware('permission:research-monitoring-form-store');

    Route::get('/presented', [PresentedResearchProductionController::class, 'index'])
        ->middleware('permission:research-monitoring-form-index');

    Route::get('/presented/{presented}', [PresentedResearchProductionController::class, 'show'])
        ->middleware('can:view,presented');

    Route::patch('/presented/{presented}', [PresentedResearchProductionController::class, 'update'])
        ->middleware('can:update,presented');

    Route::delete('/presented/{presented}', [PresentedResearchProductionController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');

    Route::get('/published', [PublishedResearchProductionController::class, 'index'])->middleware('permission:research-monitoring-form-index');
    Route::get('/published/{published}', [PublishedResearchProductionController::class, 'show'])->middleware('can:view,published');
    Route::post('/published', [PublishedResearchProductionController::class, 'store'])->middleware('permission:research-monitoring-form-store');
    Route::patch('/published/{published}', [PublishedResearchProductionController::class, 'update'])->middleware('can:update,published');
    Route::delete('/published/{published}', [PublishedResearchProductionController::class, 'destroy'])->middleware('permission:research-monitoring-form-delete');


    Route::apiResource(
        'users',
        UserController::class,
    )->middleware(['permission:manage-users'])->except([
        'update'
    ]);

    Route::put('/user/{user}', [UserController::class, 'update']);

    Route::apiResource(
        'coordinators',
        CoordinatorController::class
    )->middleware(['permission:manage-users'])->except([
        'update'
    ]);
    Route::put('/coordinators/{coordinator}', [CoordinatorController::class, 'update']);

    Route::get('/generate-report/{user}', [AdminController::class, "generateFPES"])->middleware('role:admin');
    Route::get('/admin-dashboard', [AdminController::class, "index"])->middleware('role:admin');
    Route::get('/admin-submissions', [AdminController::class, "submissions"])->middleware('role:admin');
});
