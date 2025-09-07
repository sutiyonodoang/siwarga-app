<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Province;
use App\Models\Regency;
use App\Models\Village;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    public function provinces(Request $request)
    {
        $provinces = Province::query()
            ->when($request->input('search'), function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->get();

        return response()->json($provinces);
    }

    public function regencies(Request $request)
    {
        $request->validate([
            'province_id' => ['required', 'exists:reg_provinces,id'],
        ]);

        $regencies = Regency::query()
            ->where('province_id', $request->input('province_id'))
            ->when($request->input('search'), function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->get();

        return response()->json($regencies);
    }

    public function districts(Request $request)
    {
        $request->validate([
            'regency_id' => ['required', 'exists:reg_regencies,id'],
        ]);

        $districts = District::query()
            ->where('regency_id', $request->input('regency_id'))
            ->when($request->input('search'), function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->get();

        return response()->json($districts);
    }

    public function villages(Request $request)
    {
        $request->validate([
            'district_id' => ['required', 'exists:reg_districts,id'],
        ]);

        $villages = Village::query()
            ->where('district_id', $request->input('district_id'))
            ->when($request->input('search'), function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->get();

        return response()->json($villages);
    }
}