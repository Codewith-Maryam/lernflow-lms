<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\LecturerController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\CourseController;

Route::get('/guest/courses', [CourseController::class, 'guestIndex']);
Route::get('/guest/stats', [CourseController::class, 'guestStats']);

// -----------------------------------------------
// PUBLIC ROUTES
// These routes do NOT need a login token
// -----------------------------------------------

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/student/courses/{id}/enroll', [StudentController::class, 'enroll']);
});
// Forgot Password - Send reset link
Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    
    $status = Password::sendResetLink(
        $request->only('email')
    );
    
    return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => 'Reset link sent to your email.'], 200)
        : response()->json(['message' => 'Email not found.'], 404);
});


// Reset Password
Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token'    => 'required',
        'email'    => 'required|email',
        'password' => 'required|min:6|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => 'Password reset successfully.'], 200)
        : response()->json(['message' => 'Invalid or expired token.'], 400);
});
// Register a new user (student or lecturer only)
Route::post('/register', [AuthController::class, 'register']);

// Login with email and password
Route::post('/login', [AuthController::class, 'login'])->name('login');
// -----------------------------------------------
// PROTECTED ROUTES
// These routes NEED a valid Sanctum token
// Add token in header: Authorization: Bearer {token}
// -----------------------------------------------
Route::middleware('auth:sanctum')->group(function () {



    //for enrollement
    Route::post('/student/courses/{id}/enroll', [StudentController::class, 'enroll']);
Route::get('/student/my-enrollments', [StudentController::class, 'getMyEnrollments']);
Route::delete('/student/courses/{id}/unenroll', [StudentController::class, 'unenroll']);
    


    // -------------------------------------------
    // AUTH ROUTES (all logged in users)
    // -------------------------------------------

    // Logout current user
    Route::post('/logout', [AuthController::class, 'logout']);


    // -------------------------------------------
    // ADMIN ROUTES
    // Only admin should call these
    // -------------------------------------------

    // Get all pending users waiting for approval
    Route::get('/admin/pending-users', [AdminController::class, 'pendingUsers']);

    // Approve a user by ID
    Route::put('/admin/approve-user/{id}', [AdminController::class, 'approveUser']);

    // Reject a user by ID
    Route::put('/admin/reject-user/{id}', [AdminController::class, 'rejectUser']);

    // Get all approved students
    Route::get('/admin/students', [AdminController::class, 'getStudents']);

    // Get all approved lecturers
    Route::get('/admin/lecturers', [AdminController::class, 'getLecturers']);

    // Get all courses (admin view)
    Route::get('/admin/courses', [AdminController::class, 'getCourses']);

    // Add a new course
    Route::post('/admin/courses', [AdminController::class, 'addCourse']);

    // Edit a course by ID
    Route::put('/admin/courses/{id}', [AdminController::class, 'editCourse']);

    // Delete a course by ID
    Route::delete('/admin/courses/{id}', [AdminController::class, 'deleteCourse']);


    // -------------------------------------------
    // LECTURER ROUTES
    // Only lecturer should call these
    // -------------------------------------------

    // Get courses assigned to logged in lecturer
    Route::get('/lecturer/courses', [LecturerController::class, 'getMyCourses']);

    // Get materials for a specific course
    Route::get('/lecturer/courses/{courseId}/materials', [LecturerController::class, 'getMaterials']);

    // Upload a new material
    Route::post('/lecturer/materials', [LecturerController::class, 'uploadMaterial']);

    // Edit a material by ID
    Route::put('/lecturer/materials/{id}', [LecturerController::class, 'editMaterial']);

    // Preview a note material
    Route::get('/lecturer/materials/{id}/preview', [LecturerController::class, 'previewMaterial']);

    // Delete a material by ID
    Route::delete('/lecturer/materials/{id}', [LecturerController::class, 'deleteMaterial']);


    // -------------------------------------------
    // STUDENT ROUTES
    // Only student should call these
    // -------------------------------------------

    // Get all courses (student view)
    Route::get('/student/courses', [StudentController::class, 'getCourses']);

    // Get a single course by ID
    Route::get('/student/courses/{id}', [StudentController::class, 'getCourse']);

    // Get all materials for a course
    Route::get('/student/courses/{courseId}/materials', [StudentController::class, 'getMaterials']);

    // Get a single material by ID
    Route::get('/student/materials/{id}', [StudentController::class, 'getMaterial']);

    Route::get('/student/materials/{id}/note', [StudentController::class, 'getNoteContent']);


Route::get('/lecturer/courses/{courseId}/students', [LecturerController::class, 'getCourseStudents']);

});