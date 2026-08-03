<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    // Get all materials
    public function index()
    {
        return response()->json(Material::all());
    }

    // Upload new material
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title'     => 'required|string',
                'course_id' => 'required|integer',
                'type'      => 'required|in:pdf,video,note',
                'file'      => 'required|file|max:102400',
            ]);

            $path = $request->file('file')->store('materials', 'public');

            $material = Material::create([
                'title'     => $request->title,
                'course_id' => $request->course_id,
                'type'      => $request->type,
                'file_path' => $path,
            ]);

            return response()->json($material, 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete material
    public function destroy($id)
    {
        $material = Material::findOrFail($id);
        Storage::disk('public')->delete($material->file_path);
        $material->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}