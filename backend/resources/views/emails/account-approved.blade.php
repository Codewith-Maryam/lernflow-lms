<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background: #f1f5f9;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 560px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .header {
            background: linear-gradient(135deg, #1e40af, #2563eb);
            padding: 36px 32px;
            text-align: center;
        }
        .logo {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            color: #fff;
            font-size: 22px;
            font-weight: 800;
            padding: 10px 20px;
            border-radius: 10px;
            margin-bottom: 16px;
        }
        .header h1 {
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            margin: 0;
        }
        .body {
            padding: 36px 32px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 12px;
        }
        .message {
            font-size: 14px;
            color: #64748b;
            line-height: 1.7;
            margin-bottom: 24px;
        }
        .info-box {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 24px;
        }
        .info-box p {
            margin: 4px 0;
            font-size: 13px;
            color: #166534;
        }
        .info-box strong {
            color: #15803d;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #1e40af, #2563eb);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 24px;
        }
        .features {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
            flex-wrap: wrap;
        }
        .feature {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 12px;
            color: #1d4ed8;
            font-weight: 600;
        }
        .footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px 32px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">

        <!-- Header -->
        <div class="header">
            <div class="logo">LF LearnFlow</div>
            <h1>🎉 Account Approved!</h1>
        </div>

        <!-- Body -->
        <div class="body">
            <div class="greeting">Hello, {{ $user->name }}! 👋</div>
            <p class="message">
                Great news! Your LearnFlow account has been reviewed and
                <strong>approved by the Admin</strong>. You can now login
                and start accessing your courses and learning materials.
            </p>

            <!-- Account Info -->
            <div class="info-box">
                <p>📧 <strong>Email:</strong> {{ $user->email }}</p>
                <p>👤 <strong>Role:</strong> {{ ucfirst($user->role) }}</p>
                <p>✅ <strong>Status:</strong> Account Approved</p>
            </div>

            <!-- Login Button -->
            <a href="http://localhost:3000/login" class="btn">
                Login to LearnFlow →
            </a>

            <!-- Features -->
            <p style="font-size: 13px; color: #64748b; margin-bottom: 12px;">
                With your account you can:
            </p>
            <div class="features">
                @if($user->role === 'student')
                    <span class="feature">📚 Browse Courses</span>
                    <span class="feature">📄 Download PDFs</span>
                    <span class="feature">🎥 Watch Videos</span>
                    <span class="feature">📝 Read Notes</span>
                @elseif($user->role === 'lecturer')
                    <span class="feature">📤 Upload Materials</span>
                    <span class="feature">📚 Manage Courses</span>
                    <span class="feature">👥 View Students</span>
                @endif
            </div>

            <p class="message">
                If you have any questions, please contact your system administrator.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            © 2026 LearnFlow LMS · Built with React & Laravel<br>
            This is an automated email. Please do not reply.
        </div>

    </div>
</body>
</html>