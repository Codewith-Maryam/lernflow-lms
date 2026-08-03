import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all pages
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ForgotPassword from './Pages/forgetpassword';
import AdminDashboard from './Pages/AdminDashboard';
import LecturerDashboard from './Pages/LecturerDashboard';
import StudentDashboard from './Pages/StudentDashboard';
import GuestCourses from './Pages/Guestcourses';
import AboutUs from './Pages/about';


function ProtectedRoute({ children, role }) {
    // Get user data from localStorage
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If role doesn't match, redirect to login
    if (role && userRole !== role) {
        return <Navigate to="/login" />;
    }

    // If all good, show the page
    return children;
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes - only for specific roles */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/lecturer"
                    element={
                        <ProtectedRoute role="lecturer">
                            <LecturerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute role="student">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/guest-courses" element={<GuestCourses />} />
            </Routes>
        </Router>
    );
    
}

export default App;