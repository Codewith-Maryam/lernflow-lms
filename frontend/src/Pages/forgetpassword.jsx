import { useState } from 'react';
import { MdKeyOff} from 'react-icons/md';
import { MdKey} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
                setEmail('');
            } else {
                setError(data.message || 'Something went wrong.');
            }
        } catch (err) {
            setError('Connection failed. Make sure the server is running.');
        }

        setLoading(false);
    };

    return (
        <div style={s.page}>

            {/* Background blobs */}
            <div style={{ ...s.blob, top: -80, left: -80, background: 'rgba(124,58,237,0.15)' }} />
            <div style={{ ...s.blob, bottom: -60, right: -60, background: 'rgba(37,99,235,0.12)' }} />

            <div style={s.card}>

                {/* Logo */}
                <div style={s.logoWrap}>
                    <div style={s.logoBox}>LF</div>
                    <span style={s.logoText}>LearnFlow</span>
                </div>

                {/* Icon */}
                <div style={s.iconWrap}><MdKey/></div>

                {/* Title */}
                <h2 style={s.title}>Forgot Password?</h2>
                <p style={s.sub}>
                    No worries! Enter your email address below and we'll
                    send you a link to reset your password.
                </p>

                {/* Success message */}
                {success && (
                    <div style={s.successBox}>
                        <span style={{ fontSize: 18, marginRight: 8 }}>✅</span>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: 2 }}>Email Sent!</div>
                            <div style={{ fontSize: 13 }}>{success}</div>
                            <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>
                                Check your inbox and click the reset link.
                            </div>
                        </div>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div style={s.errorBox}>
                        <span style={{ fontSize: 18, marginRight: 8 }}>❌</span>
                        <div>{error}</div>
                    </div>
                )}

                {/* Form */}
                {!success && (
                    <form onSubmit={handleSubmit} style={s.form}>
                        <div style={s.fieldWrap}>
                            <label style={s.label}>Email Address</label>
                            <div style={s.inputWrap}>
                                <span style={s.inputIcon}>📧</span>
                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    style={s.input}
                                    onFocus={e => e.target.style.borderColor = '#7c3aed'}
                                    onBlur={e => e.target.style.borderColor = '#1e2d40'}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...s.btn,
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {loading ? '⏳ Sending...' : '📨 Send Reset Link'}
                        </button>
                    </form>
                )}

                {/* Try again button */}
                {success && (
                    <button style={s.tryAgain} onClick={() => { setSuccess(''); setError(''); }}>
                        Send again to a different email
                    </button>
                )}

                {/* Divider */}
                <div style={s.divider}>
                    <div style={s.dividerLine} />
                    <span style={s.dividerText}>or</span>
                    <div style={s.dividerLine} />
                </div>

                {/* Links */}
                <div style={s.links}>
                    <button style={s.linkBtn} onClick={() => navigate('/login')}>
                        ← Back to Login
                    </button>
                    <button style={s.linkBtn} onClick={() => navigate('/register')}>
                        Create Account
                    </button>
                </div>

            </div>

            {/* Help text */}
            <p style={s.helpText}>
                Didn't receive the email? Check your spam folder or contact your Admin.
            </p>

        </div>
    );
}

const s = {
    page: {
        minHeight: '100vh',
        background: '#0a0f1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        position: 'relative',
        overflow: 'hidden',
    },
    blob: {
        position: 'fixed',
        width: 350,
        height: 350,
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
    },
    card: {
        background: '#0d1220',
        border: '1px solid #1e2d40',
        borderRadius: 20,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 420,
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
    },
    logoWrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 24,
    },
    logoBox: {
        width: 34,
        height: 34,
        background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 800,
        fontSize: 14,
    },
    logoText: {
        fontWeight: 700,
        fontSize: 18,
        color: '#f1f5f9',
    },
    iconWrap: {
        fontSize: 44,
        textAlign: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 800,
        color: '#f1f5f9',
        textAlign: 'center',
        marginBottom: 8,
    },
    sub: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 1.7,
        marginBottom: 24,
    },
    successBox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        background: '#052e16',
        border: '1px solid #166534',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 20,
        color: '#86efac',
        fontSize: 13,
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#450a0a',
        border: '1px solid #991b1b',
        borderRadius: 10,
        padding: '12px 16px',
        marginBottom: 20,
        color: '#fca5a5',
        fontSize: 13,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
    },
    fieldWrap: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    label: {
        fontSize: 12,
        fontWeight: 600,
        color: '#94a3b8',
        letterSpacing: 0.3,
    },
    inputWrap: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 12,
        fontSize: 16,
        pointerEvents: 'none',
    },
    input: {
        width: '100%',
        padding: '12px 14px 12px 40px',
        background: '#0a0f1a',
        border: '1px solid #1e2d40',
        borderRadius: 10,
        color: '#f1f5f9',
        fontSize: 14,
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    btn: {
        width: '100%',
        padding: '13px',
        background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
        color: '#fff',
        border: 'none',
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        marginTop: 4,
    },
    tryAgain: {
        width: '100%',
        padding: '10px',
        background: 'transparent',
        color: '#7c3aed',
        border: '1px solid #7c3aed44',
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 8,
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        margin: '24px 0 16px',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        background: '#1e2d40',
    },
    dividerText: {
        fontSize: 12,
        color: '#475569',
    },
    links: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    linkBtn: {
        background: 'none',
        border: 'none',
        color: '#64748b',
        fontSize: 13,
        cursor: 'pointer',
        fontWeight: 500,
        padding: 0,
    },
    helpText: {
        fontSize: 12,
        color: '#334155',
        textAlign: 'center',
        marginTop: 20,
        position: 'relative',
        zIndex: 1,
    },
};