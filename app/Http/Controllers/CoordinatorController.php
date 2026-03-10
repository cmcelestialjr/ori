<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Requests\AddFacultyRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\ResearchMonitoringForm;
use App\Enums\RoleEnum;
use App\Enums\ResearchMonitoringFormStatus;
use App\Traits\HttpResponses;
use App\Traits\useFileHandler;
use Spatie\Permission\Models\Role;

class CoordinatorController extends Controller
{
    use HttpResponses;
    use useFileHandler;

    public function index()
    {

        $coordinators = User::query()
                        ->select(['id', 'email', 'academic_rank', 'unit', 'college', 'fname', 'lname', 'mi', 'suffix'])
                        ->role(RoleEnum::RESEARCH_COORDINATOR)
                        ->latest()
                        ->get();

        $coordinators = $coordinators->map(function($user) {

            $user->coordinator = $user->hasRole(RoleEnum::RESEARCH_COORDINATOR);

            return $user;
        });


        return $this->success(['users' => $coordinators], 'Research Coordinator Retrieved Successfully');
    }
    public function show(User $coordinator)
    {
        return $this->success(
            $coordinator
        );
    }
    public function approved()
    {
        $user = auth()->user();

        $fullname = "$user->fname $user->lname";

        $coordinator = ResearchMonitoringForm::where('status', ResearchMonitoringFormStatus::APPROVED)
            ->where('reviewed_by', $fullname)
            ->get();

        $coordinator->load('users', 'points', 'researchinvolvement');

        return $this->success($coordinator, 'Data retrieved successfully');
    }
    public function store(AddFacultyRequest $req)
    {
        $imagePath = '';

        if ($req->image_path) {
            // $imagePath = Storage::disk('public')->put('/', $req->file('image_path'));
            $imagePath = $this->moveToStorage($req->image_path);
        }

        $req->validated($req->all());

        $user = User::create([
            'fname' => $req->fname,
            'lname' => $req->lname,
            'mi' => $req->mi,
            'suffix' => $req->suffix,
            'college' => $req->college,
            'image_path' => $req->image_path ? $imagePath : null,
            'unit' => $req->unit,
            'academic_rank' => $req->academic_rank,
            'email' => $req->email,
            'password' => Hash::make($req->password)
        ])->syncRoles(RoleEnum::RESEARCH_COORDINATOR);

        return $this->success($user, 'Research Coordinator Added Successfully');
    }

    public function update(User $coordinator, UpdateUserRequest $request)
    {
        $updatedImage = '';

        // 1. Clean the path (remove the domain URL if it exists)
        // If config is missing, this defaults to stripping '/storage/'
        $cleanPath = Str::after($request->image_path, config('myconfig.app_url') . '/storage/');

        // 2. Get the old image path from the database
        $oldPath = $coordinator->getRawOriginal('image_path');

        // 3. Check if the image has changed
        // If the clean path is different from the old path, it's a new upload!
        if ($cleanPath !== $oldPath) {
            $updatedImage = $cleanPath; // Use the new path (e.g., temp/image.png)

            // Optional: Delete the old image to save space
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        } else {
            // If it hasn't changed, keep the old path
            $updatedImage = $oldPath;
        }

        $coordinator->update([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'mi' => $request->mi,
            'suffix' => $request->suffix,
            'academic_rank' => $request->academic_rank,
            'image_path' => $updatedImage,
            'college' => $request->college,
            'unit' => $request->unit,
            'email' => $request->email
        ]);

        $coordinator->load('roles:id,name');

        return $this->success($coordinator, 'Faculty Updated Successfully');
    }

    public function destroy(User $coordinator)
    {

        if ($coordinator->image_path) {
            Storage::disk('public')->delete($coordinator->image_path);
        }

        $faculty = Role::all();
        $faculty = User::where('fname', $coordinator->fname)->where('lname', $coordinator->lname)->whereRelation('roles', 'name', RoleEnum::FACULTY)->first();

        $faculty->removeRole(RoleEnum::RESEARCH_COORDINATOR);

        $coordinator->delete();

        return $this->success('', 'Research Coordinator Deleted Successfully');
    }
}
