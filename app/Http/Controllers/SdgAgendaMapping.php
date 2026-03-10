<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SdgMapping;
use App\Models\AgendaMapping;
use App\Traits\HttpResponses;
use App\Traits\useFileHandler;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SdgAgendaMapping extends Controller
{
    use HttpResponses;
    use useFileHandler;

    public function agenda_mapping_store(Request $req)
    {
        if ($req->hasFile('image_path')) {
            $req->image_path = Storage::disk('public')->put('/images', $req->file('image_path'));
        }

        $validated = $req->validate([
            'name' => ['string', 'required'],
            'image_path' => ['string', 'nullable']
        ]);

        AgendaMapping::create($validated);

        return $this->success($validated, 'Agenda Map Added');
    }

    public function getAgenda()
    {
        $agenda = AgendaMapping::select('id', 'name', 'image_path')->get();
        $sdg = SdgMapping::select('id', 'name', 'description', 'image_path')->get();

        return $this->success(['agenda' => $agenda, 'sdg' => $sdg], 'Agenda Mapped Successfully');
    }

    /**
     * Show a single agenda for editing.
     */
    public function agenda_mapping_show($id)
    {
        $agenda = AgendaMapping::find($id);

        if (!$agenda) {
            return response()->json(['message' => 'Agenda not found'], 404);
        }

        return response()->json(['data' => $agenda], 200);
    }

    /**
     * Update an existing agenda.
     */
    public function agenda_mapping_update(Request $request, $id)
    {
        $agenda = AgendaMapping::find($id);

        if (!$agenda) {
            return response()->json(['message' => 'Agenda not found'], 404);
        }

        $input = $request->all();

        // Fix image path if it contains the full URL from the frontend
        if ($request->has('image_path')) {
            if (Str::contains($request->image_path, '/storage/')) {
                $input['image_path'] = Str::after($request->image_path, '/storage/');
            }
        }

        $agenda->update($input);

        return response()->json([
            'status' => 'success',
            'message' => 'Agenda updated successfully',
            'data' => $agenda
        ], 200);
    }

    /**
     * Delete an agenda mapping.
     */
    public function agenda_mapping_destroy($id)
    {
        $agenda = AgendaMapping::find($id);

        if (!$agenda) {
            return response()->json(['message' => 'Agenda not found'], 404);
        }

        if ($agenda->image_path && Storage::disk('public')->exists($agenda->image_path)) {
            Storage::disk('public')->delete($agenda->image_path);
        }

        $agenda->delete();

        return $this->success($agenda, 'Agenda Map deleted successfully');
    }

    public function sdg_mapping_store(Request $req)
    {
        if ($req->hasFile('image_path')) {
            $req->image_path = Storage::disk('public')->put('/images', $req->file('image_path'));
        }
        $validated = $req->validate([
            'name' => ['string', 'required'],
            'description' => ['string', 'required'],
            'image_path' => ['string', 'nullable']
        ]);

        SdgMapping::create($validated);

        return $this->success($validated, 'SDG Map Added');
    }

    public function sdg_mapping_show($id)
    {
        $sdg = SdgMapping::find($id);

        if (!$sdg) {
            return response()->json(['message' => 'SDG not found'], 404);
        }
        return response()->json(['data' => $sdg], 200);
    }

    public function sdg_mapping_update(Request $request, $id)
    {
        $sdg = SdgMapping::find($id);

        if (!$sdg) {
            return response()->json(['message' => 'SDG not found'], 404);
        }

        $input = $request->all();

        // Clean up image path if a new one was uploaded
        if ($request->has('image_path')) {
            if (Str::contains($request->image_path, '/storage/')) {
                $input['image_path'] = Str::after($request->image_path, '/storage/');
            }
        }

        $sdg->update($input);

        return response()->json(['message' => 'SDG Updated Successfully', 'data' => $sdg], 200);
    }

    public function sdg_mapping_destroy($id)
    {
        $sdg = SdgMapping::find($id);

        if (!$sdg) {
            return response()->json(['message' => 'SDG not found'], 404);
        }

        if ($sdg->image_path && Storage::disk('public')->exists($sdg->image_path)) {
            Storage::disk('public')->delete($sdg->image_path);
        }

        $sdg->delete();

        return response()->json(['message' => 'SDG Deleted Successfully'], 200);
    }
}
