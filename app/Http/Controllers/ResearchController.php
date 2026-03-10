<?php

namespace App\Http\Controllers;

use App\Models\Research;
use App\Models\ResearchType;
use App\Models\ResearchField;
use App\Models\SocioEconomicObjective;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreResearchRequest;
use App\Traits\HttpResponses;
use App\Traits\useFileHandler;

class ResearchController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    use HttpResponses;
    use useFileHandler;

    public function index(Request $request)
    {
        $search = $request->input('search');

        $query = Research::query()->where('user_id', auth()->id())->with('completed', 'published', 'presented');
                                  
        if($search) {

            $query->where(function ($query) use ($search) {

                $query->where('title', 'LIKE', "%$search%")
                      ->orWhere('authors', 'LIKE', "%$search%")
                      ->orWhere('authorship_nature', 'LIKE', "%$search%");
            });
        };                  
        
        $research = $query->paginate(5);

        return $this->success($research, 'Research Retrieved Successfully');
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResearchRequest $request)
    {
        $user = auth()->user();

        $attributes = Arr::add($request->validated(), 'user_id', $user->id);
        
        $research = Research::create($attributes);
        
        return $this->success($research);
    }

    public function get()
    {
        $researchType = ResearchType::get()->select('id','type');
        $researchField = ResearchField::get()->select('id','field');
        $socioeconomic = SocioEconomicObjective::get()->select('id','type');


        return $this->success([
            'research_type' => $researchType,
            'research_field' => $researchField,
            'socio_economic_objective' => $socioeconomic
        ], 'Data retrieved succesfull');
    }
    /**
     * Display the specified resource.
     */
    public function show(Research $research)
    {
        $research->load('completed', 'published', 'researchField', 'researchType' , 'socioEconomicObjective');

        return $this->success($research, 'Research Retrieved Successfully');
    }

    public function update(Research $research, Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'authors' => 'required|string',
            'authorship_nature' => 'required|string',
        ]);

        $research->update($request->all());

        return $this->success('', 'Update succesfull');
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Research $research)
    {
        $file = $research->getRawOriginal('file_path');

        if(Storage::exists($file)) {

            Storage::delete($file);
        };

        $research->delete();

        return response()->noContent();
    }
}
