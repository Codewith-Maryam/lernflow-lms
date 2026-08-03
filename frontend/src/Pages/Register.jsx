import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { MdBook, MdPerson4, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLogout, MdPeopleAlt, MdLockClock, MdPerson3, MdAssignmentTurnedIn, MdSchool, MdPermCameraMic, MdSubtitles } from 'react-icons/md';


function Register() {
    const navigate = useNavigate();

    // Form data state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student', // default role is student
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
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // -----------------------------------------------
    // HANDLE FORM SUBMIT
    // Sends register request to Laravel API
    // -----------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setError('');
        setSuccess('');

        // Simple frontend validation
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // Send POST request to /api/register
            const response = await api.post('/register', formData);

            // Show success message from Laravel
            setSuccess(response.data.message);

            // Clear the form
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: 'student',
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            // Show error message from Laravel
            if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.response && err.response.data.errors) {
                // Laravel validation errors come as an object
                // Get the first error message
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>

            {/* Register Card */}
            <div style={styles.card}>
              

                {/* Logo */}
                <div style={styles.logo}>LearnFlow<MdSchool size={33} color="#ffffff"/></div>

                {/* Title */}
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Register to join LearnFlow</p>

                {/* Error Message */}
                {error && <div style={styles.errorBox}>{error}</div>}

                {/* Success Message */}
                {success && <div style={styles.successBox}>{success}</div>}

                {/* Register Form */}
                <form onSubmit={handleSubmit}>

                    {/* Full Name */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* Email */}
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

                    {/* Role Selection */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Register As</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                        </select>
                    </div>

                    {/* Password */}
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

                    {/* Confirm Password */}
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="Confirm your password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    

                   

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>

                </form>

                {/* Login Link */}
                <p style={styles.loginText}>
                    Already have an account?{' '}
                    <span
                        style={styles.loginLink}
                        onClick={() => navigate('/login')}
                    >
                        Login here
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
        maxWidth: '440px',
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
    infoBox: {
        backgroundColor: '#1e3a5f',
        border: '1px solid #3b82f6',
        color: '#93c5fd',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
        lineHeight: '1.5',
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
    loginText: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#94a3b8',
        marginTop: '20px',
    },
    loginLink: {
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

export default Register;