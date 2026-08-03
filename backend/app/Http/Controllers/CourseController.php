<?php

namespace App\Http\Controllers;

use App\models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Course::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $course = Course::create($request->all());
        return response()->json($course, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $course = Course::findorfail($id);
        return response()->json($course);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $course = Course::findorfail($id);
        return response()->json($course);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $course = Course::findOrFail($id);
        $course->update($request->all());
        return response()->json($course);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Course::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    /**
     * Display a listing of courses for guest users.
     */
    public function guestIndex()
    {
        $courses = Course::with('lecturer:id,name')
            ->select('id', 'course_name', 'course_code', 'description', 'lecturer_id', 'image')
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'course_name' => $course->course_name,
                    'course_code' => $course->course_code,
                    'description' => $course->description,
                    'lecturer' => $course->lecturer ? ['name' => $course->lecturer->name] : null,
                    'image' => $course->image ? asset('storage/' . $course->image) : null,
                ];
            });

        return response()->json($courses, 200);
    }

    /**
     * Return guest statistics.
     */
    public function guestStats()
    {
        return response()->json([
            'total_courses' => Course::count(),
            'total_students' => \App\Models\User::where('role', 'student')->where('status', 'approved')->count(),
            'total_lecturers' => \App\Models\User::where('role', 'lecturer')->where('status', 'approved')->count(),
        ], 200);
    }
}
