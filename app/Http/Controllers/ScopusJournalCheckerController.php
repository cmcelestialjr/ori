<?php

namespace App\Http\Controllers;

use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ScopusJournalCheckerController extends Controller
{
    use HttpResponses;
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $apiKey = config('services.scopus.api_key');
        $apiEndpoint = 'https://api.elsevier.com/content/search/scopus';
        
        try{
        if($request->authors) {
            $authorQueries = [];
            foreach ($request->authors as $author) {
            $lastName = trim($author['last_name'] ?? '');

            if ($lastName) {
             $authorQueries[] = 'AUTHLASTNAME('.$lastName.')';
            }
            }
            $authorsQueryPart = implode(' OR ', $authorQueries);

            $query = 'TITLE("'.$request->research_title.'") AND '.$authorsQueryPart.'';            
            
            $response = Http::withQueryParameters([
                'query' => $query,
                'apiKey' => $apiKey,
                'httpAccept' => 'application/json',
            ])->get($apiEndpoint);

        } else {
            $response = Http::withQueryParameters([
                'query' => 'TITLE("'.$request->research_title.'") AND SRCTITLE("'.$request->journal_name.'")',
                'start' => 0,
                'count' => 1,
                'apiKey' => $apiKey,
                'httpAccept' => 'application/json',
            ])->get($apiEndpoint);

        }

        $response->throwIf(!$response->successful()); 
        
        $data = $response->json();

            if (isset($data['search-results']['entry']) && isset($data['search-results']['entry'][0]['error'])) {
                return $this->success(['exists' => false], 'Journal not found on Scopus database');
            } else {
                return $this->success(['exists' => true, 'data' => $data['search-results']['entry']]);
            }

        } catch (\Throwable $e) {
            return $this->error(null, "Error checking journal: ".$e->getMessage(), 500); 
        }
    }
}
