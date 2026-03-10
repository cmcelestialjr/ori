<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResearchMonitoringFormResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string)$this->id,
            'attributes' => [
                'sdgmapping' => $this->sdgmapping,
                'agendamapping' => $this->agendamapping,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at
            ]
            // ],
            // 'research type' => [
            //     'id' => (string)$this->research_involvement_type_id,
            //     'research involvement type' => $this->
            // ],
            // 'relationship' => [
            //     'user' => $this->user_id
            // ]
        ];
    }
}
