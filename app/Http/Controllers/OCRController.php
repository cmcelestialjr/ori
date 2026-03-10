<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\ResearchMonitoringForm;
use App\Traits\useOCRservice;
use App\Traits\EntitiesExtractor;

class OCRController extends Controller
{
    use useOCRservice;
    use EntitiesExtractor;

    public function OCR(ResearchMonitoringForm $form)
    {
        $originalPaths = [];
        $paths = [];

        $form->load('researchdocuments');

        foreach ($form->researchdocuments as $file) {
            $originalPaths[] = $file->getRawOriginal('file_path');
        }

        $involvementType = $form->research_involvement_type_id;


        foreach($originalPaths as $file){

            $paths[] = Storage::disk('local')->path($file);

        }

        switch ($involvementType) {

            case 1:

                break;
            case 2:
                if(mime_content_type($paths[0]) === 'application/pdf'){

                    $path = $this->convertPDFtoImage($paths[0]);

                    $data =  $this->getPresentedEntities($path);

                    Storage::delete('researchdocuments/'.basename($path));

                } else {

                    $data =  $this->getPresentedEntities($paths[0]);
                }

                break;
            case 3:


                break;
            case 4:
                break;
            case 5:
                if(mime_content_type($paths[0]) === 'application/pdf'){

                    $path = $this->convertPDFtoImage($paths[0]);

                    $data =  $this->getResearchAttendanceEntities($path);

                    Storage::delete('researchdocuments/'.basename($path));

                } else {

                    $data =  $this->getResearchAttendanceEntities($paths[0]);
                }
                break;
            case 6:
                if(mime_content_type($paths[0]) === 'application/pdf'){

                    $path = $this->convertPDFtoImage($paths[0]);

                    $data =  $this->getIntellectualPropertyEntities($path);

                    Storage::delete('researchdocuments/'.basename($path));

                } else {

                    $data =  $this->getIntellectualPropertyEntities($paths[0]);
                }
                break;
            case 7:
                if(mime_content_type($paths[0]) === 'application/pdf'){

                    $path = $this->convertPDFtoImage($paths[0]);

                    $data =  $this->getPeerReviewEntities($path);

                    Storage::delete('researchdocuments/'.basename($path));

                } else {

                    $data =  $this->getPeerReviewEntities($paths[0]);
                }
                break;
            case 8:
            if(mime_content_type($paths[0]) === 'application/pdf'){

                $path = $this->convertPDFtoImage($paths[0]);

                $data =  $this->getOtherResearchEntities($path);

                Storage::delete('researchdocuments/'.basename($path));

            } else {

                $data =  $this->getOtherResearchEntities($paths[0]);
            }
            break;
            default:
                return $this->error('','Involvement Type not found', 500);
        }
        return $this->success($data, 'Data extracted succesfully');
    }
}
