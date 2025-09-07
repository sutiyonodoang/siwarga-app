<?php

namespace App\Http\Controllers;

use App\Models\Province;
use App\Models\Regency;
use App\Models\District;
use App\Models\Village;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function getProvinces(Request $request)
    {
        $search = $request->get('search', '');
        
        $provinces = Province::where('name', 'like', '%' . $search . '%')
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name']);
            
        return response()->json($provinces);
    }
    
    public function getRegencies(Request $request)
    {
        $search = $request->get('search', '');
        $provinceId = $request->get('province_id');
        
        $regencies = Regency::where('province_id', $provinceId)
            ->where('name', 'like', '%' . $search . '%')
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name']);
            
        return response()->json($regencies);
    }
    
    public function getDistricts(Request $request)
    {
        $search = $request->get('search', '');
        $regencyId = $request->get('regency_id');
        
        $districts = District::where('regency_id', $regencyId)
            ->where('name', 'like', '%' . $search . '%')
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name']);
            
        return response()->json($districts);
    }
    
    public function getVillages(Request $request)
    {
        $search = $request->get('search', '');
        $districtId = $request->get('district_id');
        
        $villages = Village::where('district_id', $districtId)
            ->where('name', 'like', '%' . $search . '%')
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name']);
            
        return response()->json($villages);
    }
}