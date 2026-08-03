<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Course;
use App\Mail\AccountApproved;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class AdminController extends Controller
{
    // -----------------------------------------------
    // GET ALL PENDING USERS
    // Admin sees users who are waiting for approval
    // -----------------------------------------------
    public function pendingUsers()
    {
        $users = User::where('status', 'pending')->get();

        return response()->json($users, 200);
    }

    // -----------------------------------------------
    // APPROVE A USER
    // Admin approves a pending user by ID
    // -----------------------------------------------
    public function approveUser($id)
    {
        // Find the user by ID
        $user = User::find($id);

        // If user not found
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Set status to approved
        $user->status = 'approved';
        $user->save();
          // Send approval email
   try {
    Mail::to($user->email)->send(new AccountApproved($user));
} catch (\Exception $e) {
    Log::error('Email failed: ' . $e->getMessage());
}

        return response()->json(['message' => 'User approved successfully.'], 200);
    }

    // -----------------------------------------------
    // REJECT A USER
    // Admin rejects a pending user by ID
    // -----------------------------------------------
    public function rejectUser($id)
    {
        // Find the user by ID
        $user = User::find($id);

        // If user not found
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Set status to rejected
        $user->status = 'rejected';
        $user->save();

        return response()->json(['message' => 'User rejected successfully.'], 200);
    }

    // -----------------------------------------------
    // GET ALL STUDENTS
    // Admin views all approved students
    // -----------------------------------------------
    public function getStudents()
    {
        $students = User::where('role', 'student')
                        ->where('status', 'approved')
                        ->get();

        return response()->json($students, 200);
    }

    // -----------------------------------------------
    // GET ALL LECTURERS
    // Admin views all approved lecturers
    // -----------------------------------------------
    public function getLecturers()
    {
        $lecturers = User::where('role', 'lecturer')
                         ->where('status', 'approved')
                         ->get();

        return response()->json($lecturers, 200);
    }

    // -----------------------------------------------
    // GET ALL COURSES
    // Admin views all courses with lecturer name
    // -----------------------------------------------
    public function getCourses()
    {
        // Load courses with their lecturer's name
        $courses = Course::with('lecturer:id,name')->get();

        return response()->json($courses, 200);
    }

    // -----------------------------------------------
    // ADD A COURSE
    // Admin creates a new course
    // -----------------------------------------------
    public function addCourse(Request $request)
    {
        // Validate the incoming data
        $request->validate([
            'course_name' => 'required|string|max:255',
            'course_code' => 'required|string|unique:courses,course_code',
            'description' => 'nullable|string',
            'lecturer_id' => 'nullable|exists:users,id',
            'image' => 'nullable|image|mimes:jpeg,jpg|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('courses', 'public');
        }

        // Create the course
        $course = Course::create([
            'course_name' => $request->course_name,
            'course_code' => $request->course_code,
            'description' => $request->description,
            'lecturer_id' => $request->lecturer_id,
            'image' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Course created successfully.',
            'course'  => $course,
        ], 201);
    }

    // -----------------------------------------------
    // EDIT A COURSE
    // Admin updates an existing course by ID
    // -----------------------------------------------
    public function editCourse(Request $request, $id)
    {
        // Find the course
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found.'], 404);
        }

        // Validate incoming data
        $request->validate([
            'course_name' => 'required|string|max:255',
            'course_code' => 'required|string|unique:courses,course_code,' . $id,
            'description' => 'nullable|string',
            'lecturer_id' => 'nullable|exists:users,id',
            'image' => 'nullable|image|mimes:jpeg,jpg|max:2048',
        ]);

        $imagePath = $course->image;
        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
            $imagePath = $request->file('image')->store('courses', 'public');
        }

        // Update the course
        $course->update([
            'course_name' => $request->course_name,
            'course_code' => $request->course_code,
            'description' => $request->description,
            'lecturer_id' => $request->lecturer_id,
            'image' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Course updated successfully.',
            'course'  => $course,
        ], 200);
    }

    // -----------------------------------------------
    // DELETE A COURSE
    // Admin deletes a course by ID
    // -----------------------------------------------
    public function deleteCourse($id)
    {
        // Find the course
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['message' => 'Course not found.'], 404);
        }

        // Delete the course
        $course->delete();

        return response()->json(['message' => 'Course deleted successfully.'], 200);
    }
}