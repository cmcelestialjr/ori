<?php

namespace App\Http\Controllers;

use App\Traits\HttpResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class FindPublishedResearch extends Controller
{
    use HttpResponses;
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {

        $response = Http::withQueryParameters([
            'query.bibliographic' => $request->research_title,
            'query.author' => $request->author,
            'rows' => 1,
        ])->get('https://api.crossref.org/works');

        if ($response->ok() && !empty($response['message']['items'])) {
            $firstItem = $response['message']['items'][0];

            similar_text(strtolower($firstItem['title'][0]), strtolower($request->research_title), $p);

            if($p < 80) {
                return $this->error('', 'Unfortunately we could not found your research, please enter your published research details manually.', 404);
            };

            return $this->success([
                'title' => $firstItem['title'][0],
                'editor_publisher' => $firstItem['publisher'],
                'article_link' => $firstItem['URL'],
                'issno_vol_pages' => $firstItem['ISSN'],
                'date' => $firstItem['created']['date-time'],
                'doi' => $firstItem['DOI'],
                'journal_name' => $firstItem['container-title'][0],
                'title' => $firstItem['title'],
                'num_citations_date' => $firstItem['is-referenced-by-count']
            ]);
        }

        return $this->error($response, 'Network error. Please try again.', 500);
    }
}
