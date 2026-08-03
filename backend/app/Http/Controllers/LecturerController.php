<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Material;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class LecturerController extends Controller
{
    // -----------------------------------------------
    // GET LECTURER'S COURSES
    // Only shows courses assigned to logged in lecturer
    // -----------------------------------------------
    public function getMyCourses()
    {
        // Get the currently logged in user's ID
        $lecturerId = Auth::id();

        // Get only courses assigned to this lecturer
        $courses = Course::where('lecturer_id', $lecturerId)->get();

        return response()->json($courses, 200);
    }

    // -----------------------------------------------
    // GET MATERIALS FOR A COURSE
    // Lecturer sees materials for a specific course
    // -----------------------------------------------
    public function getMaterials($courseId)
    {
        // Get the currently logged in user's ID
        $lecturerId = Auth::id();

        // Get materials that belong to this course AND this lecturer
        $materials = Material::where('course_id', $courseId)
                             ->where('lecturer_id', $lecturerId)
                             ->get();

        return response()->json($materials, 200);
    }

    // -----------------------------------------------
    // UPLOAD MATERIAL
    // Lecturer uploads note, PDF, or video link
    // -----------------------------------------------
    public function uploadMaterial(Request $request)
    {
        // Validate the incoming data
        $request->validate([
            'title'      => 'required|string|max:255',
            'type'       => 'required|in:note,pdf,video',
            'course_id'  => 'required|exists:courses,id',
            'file'       => 'nullable|file|mimes:pdf,doc,docx,txt|max:10240', // max 10MB
            'video_link' => 'nullable|string|url',
            'note_text'  => 'nullable|string',
        ]);

        $lecturerId = Auth::id();
        $filePath   = null;

        // If a file was uploaded (PDF or document)
        if ($request->hasFile('file')) {
            // Store the file in storage/app/public/materials folder
            $filePath = $request->file('file')->store('materials', 'public');
        }

        // If type is note, save the note text as a .txt file
        if ($request->type === 'note' && $request->note_text) {
            // Create a text file from the note content
            $fileName = 'materials/note_' . time() . '.txt';
            Storage::disk('public')->put($fileName, $request->note_text);
            $filePath = $fileName;
        }

        // Create the material record in database
        $material = Material::create([
            'title'       => $request->title,
            'type'        => $request->type,
            'file_path'   => $filePath,
            'video_link'  => $request->video_link,
            'course_id'   => $request->course_id,
            'lecturer_id' => $lecturerId,
        ]);

        return response()->json([
            'message'  => 'Material uploaded successfully.',
            'material' => $material,
        ], 201);
    }

    // -----------------------------------------------
    // EDIT MATERIAL
    // Lecturer updates material title or details
    // -----------------------------------------------
    public function editMaterial(Request $request, $id)
    {
        $lecturerId = Auth::id();

        // Find material that belongs to this lecturer
        $material = Material::where('id', $id)
                            ->where('lecturer_id', $lecturerId)
                            ->first();

        // If not found or not owned by this lecturer
        if (!$material) {
            return response()->json(['message' => 'Material not found.'], 404);
        }

        // Validate incoming data
        $request->validate([
            'title'      => 'required|string|max:255',
            'type'       => 'required|in:note,pdf,video',
            'video_link' => 'nullable|string|url',
            'file'       => 'nullable|file|mimes:pdf,doc,docx,txt|max:10240',
            'note_text'  => 'nullable|string',
        ]);

        // Update the material
        $filePath = $material->file_path;
        // If a new file uploaded, replace the old one
        if ($request->hasFile('file')) {
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
            }
            $filePath = $request->file('file')->store('materials', 'public');
        }

        // If type is note and note_text provided, save as text file
        if ($request->type === 'note' && $request->note_text) {
            if ($filePath) {
                Storage::disk('public')->delete($filePath);
            }
            $fileName = 'materials/note_' . time() . '.txt';
            Storage::disk('public')->put($fileName, $request->note_text);
            $filePath = $fileName;
        }

        $material->update([
            'title'      => $request->title,
            'type'       => $request->type,
            'video_link' => $request->video_link,
            'file_path'  => $filePath,
        ]);

        return response()->json([
            'message'  => 'Material updated successfully.',
            'material' => $material,
        ], 200);
    }

    // -----------------------------------------------
    // PREVIEW NOTE MATERIAL
    // -----------------------------------------------
    public function previewMaterial($id)
    {
        $lecturerId = Auth::id();

        $material = Material::where('id', $id)
                            ->where('lecturer_id', $lecturerId)
                            ->first();

        if (!$material) {
            return response()->json(['message' => 'Material not found.'], 404);
        }

        if ($material->type !== 'note') {
            return response()->json(['message' => 'Preview only available for note materials.'], 422);
        }

        if (!$material->file_path || !Storage::disk('public')->exists($material->file_path)) {
            return response()->json(['message' => 'Note file not available.'], 404);
        }

        $content = Storage::disk('public')->get($material->file_path);

        return response()->json([
            'content' => $content,
        ], 200);
    }

    // -----------------------------------------------
    // DELETE MATERIAL
    // Lecturer deletes their own material by ID
    // -----------------------------------------------
    public function deleteMaterial($id)
    {
        $lecturerId = Auth::id();

        // Find material that belongs to this lecturer
        $material = Material::where('id', $id)
                            ->where('lecturer_id', $lecturerId)
                            ->first();

        // If not found
        if (!$material) {
            return response()->json(['message' => 'Material not found.'], 404);
        }

        // Delete the file from storage if it exists
        if ($material->file_path) {
            Storage::disk('public')->delete($material->file_path);
        }

        // Delete the record from database
        $material->delete();

        return response()->json(['message' => 'Material deleted successfully.'], 200);
    }
    // GET ENROLLED STUDENTS FOR A COURSE
public function getCourseStudents($courseId)
{
    $lecturer = auth()->user();

    // Make sure this course belongs to this lecturer
    $course = Course::where('id', $courseId)
                    ->where('lecturer_id', $lecturer->id)
                    ->first();

    if (!$course) {
        return response()->json(['message' => 'Course not found.'], 404);
    }

    // Get enrolled students
    $students = \App\Models\Enrollment::where('course_id', $courseId)
                    ->with('student:id,name,email')
                    ->get()
                    ->map(function($e) {
                        return [
                            'id'         => $e->student->id,
                            'name'       => $e->student->name,
                            'email'      => $e->student->email,
                            'enrolled_at'=> $e->enrolled_at,
                        ];
                    });
                    

    return response()->json([
        'course'   => $course->course_name,
        'students' => $students,
        'total'    => $students->count(),
    ], 200);
}
}