import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { MdBook, MdPerson4, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLogout, MdPeopleAlt, MdLockClock, MdPerson3, MdAssignmentTurnedIn, MdSchool, MdPermCameraMic, MdSubtitles } from 'react-icons/md';

function Login() {
    // useNavigate lets us redirect after login
    const navigate = useNavigate();

    // Form data state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Message states
    const [error, setError]     = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // -----------------------------------------------
    // HANDLE INPUT CHANGE
    // Updates formData when user types in any field
    // -----------------------------------------------
    const handleChange = (e) => {
        setFormData({
            ...formData,           // keep existing values
            [e.target.name]: e.target.value, // update changed field
        });
    };

    // -----------------------------------------------
    // HANDLE FORM SUBMIT
    // Sends login request to Laravel API
    // -----------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault(); // stop page from reloading

        // Reset messages
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            // Send POST request to /api/login
            const response = await api.post('/login', formData);

            // Get token and role from response
            const { token, role, user } = response.data;

            // Save token and role to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(user));

            setSuccess('Login successful! Redirecting...');

            // Redirect based on role after short delay
            setTimeout(() => {
                if (role === 'admin') {
                    navigate('/admin');
                } else if (role === 'lecturer') {
                    navigate('/lecturer');
                } else if (role === 'student') {
                    navigate('/student');
                }
            }, 1000);

        } catch (err) {
            // Show error message from Laravel
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div style={styles.container}>

            {/* Login Card */}
            <div style={styles.card}>
 
                {/* Logo */}
                <div style={styles.logo}>LearnFlow<MdSchool size={33} color="#ffffff"/></div>

                {/* Title */}
                <h2 style={styles.title}>Welcome Back!...</h2>
                <p style={styles.subtitle}>Login to your account to continue</p>

                {/* Error Message */}
                {error && <div style={styles.errorBox}>{error}</div>}

                {/* Success Message */}
                {success && <div style={styles.successBox}>{success}</div>}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>

                    {/* Email Field */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    {/* foegwt password*/}
                    <div style={{ textAlign: "right", marginTop: "8px" }}>
                        <a
                            href="/forgot-password"
                            style={{
                                color: "#3b82f6",
                                textDecoration: "none",
                                fontSize: "14px"
                            }}
                        >
                            Forgot Password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                </form>

                {/* Register Link */}
                <p style={styles.registerText}>
                    Don't have an account?{' '}
                    <span
                        style={styles.registerLink}
                        onClick={() => navigate('/register')}
                    >
                        Register here
                    </span>
                </p>

                {/* Back to Home */}
                <p style={styles.homeLink} onClick={() => navigate('/')}>
                    Back to Home
                </p>

            </div>
        </div>
    );
}

// -----------------------------------------------
// STYLES
// -----------------------------------------------
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0a0f1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    card: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
    },
    logo: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#3b82f6',
        textAlign: 'center',
        marginBottom: '24px',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#e2e8f0',
        textAlign: 'center',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: '24px',
    },
    errorBox: {
        backgroundColor: '#450a0a',
        border: '1px solid #ef4444',
        color: '#fca5a5',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
        textAlign: 'center',
    },
    successBox: {
        backgroundColor: '#052e16',
        border: '1px solid #22c55e',
        color: '#86efac',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
        textAlign: 'center',
    },
    fieldGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #334155',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        fontSize: '14px',
        outline: 'none',
        margin: '0',
    },
    submitBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '8px',
    },
    registerText: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#94a3b8',
        marginTop: '20px',
    },
    registerLink: {
        color: '#3b82f6',
        cursor: 'pointer',
        fontWeight: '600',
    },
    homeLink: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#475569',
        marginTop: '12px',
        cursor: 'pointer',
    },
};


export default Login;