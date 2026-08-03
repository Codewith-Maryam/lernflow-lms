<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Material;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    // -----------------------------------------------
    // GET ALL COURSES
    // Student can browse all available courses
    // -----------------------------------------------
    public function getCourses()
    {
        // Get all courses with lecturer name
        $courses = Course::with('lecturer:id,name')->get();

        return response()->json($courses, 200);
    }

    // -----------------------------------------------
    // GET SINGLE COURSE DETAILS
    // Student clicks a course to see its details
    // -----------------------------------------------
    public function getCourse($id)
    {
        // Find the course by ID with lecturer name
        $course = Course::with('lecturer:id,name')->find($id);

        // If course not found
        if (!$course) {
            return response()->json(['message' => 'Course not found.'], 404);
        }

        return response()->json($course, 200);
    }

    // -----------------------------------------------
    // GET MATERIALS FOR A COURSE
    // Student views all materials in a course
    // -----------------------------------------------
    public function getMaterials($courseId)
    {
        // Check if the course exists
        $course = Course::find($courseId);

        if (!$course) {
            return response()->json(['message' => 'Course not found.'], 404);
        }

        // Get all materials for this course
        // Include lecturer name with each material
        $materials = Material::where('course_id', $courseId)
                             ->with('lecturer:id,name')
                             ->get();

        // Add full file URL to each material
        $materials = $materials->map(function ($material) {
            // If material has a file, build the full URL
        if ($material->file_path) {
    $material->file_url = 'http://127.0.0.1:8000/storage/' . $material->file_path;
} else {
    $material->file_url = null;
}
            return $material;
        });

        return response()->json($materials, 200);
    }

    // GET NOTE CONTENT
public function getNoteContent($id)
{
    $material = Material::find($id);

    if (!$material || $material->type !== 'note') {
        return response()->json(['message' => 'Note not found.'], 404);
    }

    if (!$material->file_path) {
        return response()->json(['message' => 'Note file not found.'], 404);
    }

$content = Storage::disk('public')->get($material->file_path);
    return response()->json(['content' => $content], 200);
}
    // -----------------------------------------------
    // GET SINGLE MATERIAL
    // Student opens a specific material to view
    // -----------------------------------------------

    public function getMaterial($id)
    {
        // Find the material by ID
        $material = Material::with('lecturer:id,name')
                            ->with('course:id,course_name')
                            ->find($id);

        // If material not found
        if (!$material) {
            return response()->json(['message' => 'Material not found.'], 404);
        }

        // Add full file URL if file exists
        if ($material->file_path) {
            $material->file_url = 'http://127.0.0.1:8000/storage/' . $material->file_path;
        } else {
            $material->file_url = null;
        }

        return response()->json($material, 200);
    }
    // ENROLL IN A COURSE
public function enroll(Request $request, $courseId)
{
    $studentId = auth()->id();

    $course = Course::find($courseId);
    if (!$course) {
        return response()->json(['message' => 'Course not found.'], 404);
    }

    $already = \App\Models\Enrollment::where('student_id', $studentId)
                    ->where('course_id', $courseId)
                    ->first();

    if ($already) {
        return response()->json(['message' => 'Already enrolled in this course.'], 400);
    }

    $enrollment = \App\Models\Enrollment::create([
        'student_id' => $studentId,
        'course_id'  => $courseId,
        'enrolled_at' => now(),
    ]);

    return response()->json([
        'message' => 'Enrolled successfully.',
        'enrollment' => $enrollment,
    ], 201);
}

// GET MY ENROLLED COURSES
public function getMyEnrollments()
{
    $studentId = auth()->id();

    $enrollments = \App\Models\Enrollment::where('student_id', $studentId)
                        ->with('course.lecturer:id,name')
                        ->get();

    return response()->json($enrollments, 200);
}

// UNENROLL FROM A COURSE
public function unenroll($courseId)
{
    $studentId = auth()->id();

    $enrollment = \App\Models\Enrollment::where('student_id', $studentId)
                        ->where('course_id', $courseId)
                        ->first();

    if (!$enrollment) {
        return response()->json(['message' => 'Not enrolled in this course.'], 404);
    }

    $enrollment->delete();

    return response()->json(['message' => 'Unenrolled successfully.'], 200);
}

}