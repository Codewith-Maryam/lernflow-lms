import { useNavigate } from 'react-router-dom';
import { MdBook, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLogout, MdPeopleAlt, MdLockClock, MdSaveAs, MdSafetyCheck, MdSignalWifiStatusbarConnectedNoInternet1, MdTextRotationAngledown, MdOutlineTextRotationAngledown, MdOutlineTextRotationAngleup, MdAdUnits, MdAddBusiness, MdPendingActions } from 'react-icons/md';
import { MdPictureAsPdf, MdNotes, MdVideoLibrary, MdLock, MdCheckCircle, 
    MdPhoneAndroid, MdCancel, MdSchool, MdMenuBook, MdPerson, MdCelebration, MdAdminPanelSettings, MdCastForEducation, 
    MdLaptop,
    MdOutlinePlaylistAddCheckCircle,
    MdMan3,
    MdOutlineMan2} from 'react-icons/md';
export default function AboutUs() {
    const navigate = useNavigate();

    const team = [
        {
            name: 'Maryam Ameen',
            role: 'Full Stack Developer',
            desc: 'Designed and developed the entire LearnFlow system using React.js and Laravel.',
            avatar: 'M',
            color: '#7c3aed',
        },
    ];

    const values = [
        { ititle: 'Our Mission', desc: 'To make quality education accessible to every student by providing a simple, modern and secure learning platform.' },
        {  title: 'Our Vision', desc: 'A world where every student can access their learning materials anytime, anywhere without any barriers.' },
        { title: 'Our Goal', desc: 'To bridge the gap between lecturers and students through technology, making education more organized and efficient.' },
    ];

    const techStack = [
        { name: 'React.js', desc: 'Frontend UI', color: '#38bdf8' },
        { name: 'Laravel', desc: 'Backend API', color: '#ef4444' },
        { name: 'MySQL', desc: 'Database', color: '#f59e0b' },
        { name: 'PHP',  desc: 'Server Language', color: '#a78bfa' },
        { name: 'Sanctum',  desc: 'Authentication', color: '#34d399' },
        { name: 'XAMPP',  desc: 'Local Server', color: '#fb923c' },
    ];

    const stats = [
        { value: '10+', label: 'Courses Available' },
        { value: '3', label: 'User Roles' },
        { value: '100%', label: 'Free to Use' },
        { value: '2026', label: 'Year Built' },
    ];

    const features = [
        {  title: 'Admin Management', desc: 'Admins can approve users, manage courses and assign lecturers easily.' },
        {  title: 'Lecturer Tools', desc: 'Lecturers can upload PDFs, notes and video links for their assigned courses.' },
        {  title: 'Student Access', desc: 'Students can browse courses, view materials and download resources.' },
        {  title: 'Secure System', desc: 'Role-based authentication using Laravel Sanctum tokens.' },
        {  title: 'Guest Mode', desc: 'Visitors can explore courses without registering.' },
        {  title: 'Email Notifications', desc: 'Users receive email when their account is approved by Admin.' },
    ];

    return (
        <div style={s.page}>

            {/* Background blobs */}
            <div style={{ ...s.blob, top: -100, left: -100, background: 'rgba(124,58,237,0.12)' }} />
            <div style={{ ...s.blob, top: 400, right: -100, background: 'rgba(37,99,235,0.1)' }} />

            {/* ── Navbar ── */}
            <nav style={s.nav}>
                <div style={s.navLogo} onClick={() => navigate('/')}>
                    <div style={s.logoBox}>LF</div>
                    <span style={s.logoText}>LearnFlow</span>
                </div>
                <div style={s.navLinks}>
                    <span style={s.navItem} onClick={() => navigate('/')}>Home</span>
                    <span style={s.navItem} onClick={() => navigate('/guest-courses')}>Courses</span>
                    <span style={{ ...s.navItem, color: '#a78bfa' }}>About Us</span>
                    <button style={s.navBtnOutline} onClick={() => navigate('/login')}>Login</button>
                    <button style={s.navBtnPrimary} onClick={() => navigate('/register')}>Get Started</button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section style={s.hero}>
                <div style={s.heroInner}>
                    
                    <h1 style={s.heroTitle}>
                        About <span style={s.heroGrad}>LearnFlow<MdSchool size={33} color="#ffffff"/></span>
                    </h1>
                    <p style={s.heroSub}>
                        LearnFlow is a final year project developed as a Learning Management System
                        for students and lecturers. It is built with modern web technologies
                        to make education more accessible, organized and efficient.
                    </p>
                    <div style={s.heroBtns}>
                        <button style={s.btnGrad} onClick={() => navigate('/register')}>
                            Join LearnFlow →
                        </button>
                        <button style={s.btnGhost} onClick={() => navigate('/guest/courses')}>
                            Browse Courses
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
            <section style={s.statsBar}>
                {stats.map(st => (
                    <div key={st.label} style={s.statItem}>
                        <div style={s.statVal}>{st.value}</div>
                        <div style={s.statLbl}>{st.label}</div>
                    </div>
                ))}
            </section>

            {/* ── Mission Vision Goal ── */}
            <section style={s.section}>
                <div style={s.sectionHead}>
                    
                    <h2 style={s.sectionTitle}>Why LearnFlow Exists</h2>
                    <p style={s.sectionSub}>Our mission, vision and goal for building this system</p>
                </div>
                <div style={s.mvgGrid}>
                    {values.map(v => (
                        <div key={v.title} style={s.mvgCard}>
                            <div style={s.mvgIcon}>{v.icon}</div>
                            <h3 style={s.mvgTitle}>{v.title}</h3>
                            <p style={s.mvgDesc}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── What is LearnFlow ── */}
            <section style={{ ...s.section, background: '#080d14' }}>
                <div style={s.aboutInner}>
                    <div style={s.aboutLeft}>
                        
                        <h2 style={s.sectionTitle}>What is LearnFlow?</h2>
                        <p style={s.aboutText}>
                            LearnFlow is a <strong style={{ color: '#a78bfa' }}>Learning Management System (LMS)</strong> developed
                            as a final year project at SLIATE. It provides a complete platform
                            for managing educational content between administrators, lecturers and students.
                        </p>
                        <p style={s.aboutText}>
                            The system allows <strong style={{ color: '#38bdf8' }}>Admins</strong> to manage users and courses,
                            <strong style={{ color: '#34d399' }}> Lecturers</strong> to upload materials, and
                            <strong style={{ color: '#fb923c' }}> Students</strong> to access learning content securely.
                        </p>
                        <p style={s.aboutText}>
                            Built with <strong style={{ color: '#a78bfa' }}>React.js</strong> for the frontend and
                            <strong style={{ color: '#ef4444' }}> Laravel</strong> for the backend with
                            <strong style={{ color: '#f59e0b' }}> MySQL</strong> database and
                            <strong style={{ color: '#34d399' }}> Laravel Sanctum</strong> for secure authentication.
                        </p>
                        <div style={s.aboutTags}>
                            {['Final Year Project', 'SLIATE', '2026', 'Full Stack'].map(tag => (
                                <span key={tag} style={s.tag}>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div style={s.aboutRight}>
                        <div style={s.aboutCard}>
                            <div style={s.aboutCardIcon}>🎓</div>
                            <h3 style={s.aboutCardTitle}>LearnFlow LMS</h3>
                            <div style={s.aboutCardItems}>
                                {[
                                    ' Admin Dashboard',
                                    ' Lecturer Dashboard',
                                    ' Student Dashboard',
                                    ' Guest Mode',
                                    ' Course Management',
                                    ' Material Upload',
                                    ' Email Notifications',
                                    ' Secure Authentication',
                                ].map(item => (
                                    <div key={item} style={s.aboutCardItem}>{item}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section style={s.section}>
                <div style={s.sectionHead}>
                   
                    <h2 style={s.sectionTitle}>System Features</h2>
                    <p style={s.sectionSub}>Everything LearnFlow offers to its users</p>
                </div>
                <div style={s.featGrid}>
                    {features.map(f => (
                        <div key={f.title} style={s.featCard}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2d40'}
                        >
                            <div style={s.featIcon}>{f.icon}</div>
                            <h3 style={s.featTitle}>{f.title}</h3>
                            <p style={s.featDesc}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Tech Stack ── */}
            <section style={{ ...s.section, background: '#080d14' }}>
                <div style={s.sectionHead}>
                    
                    <h2 style={s.sectionTitle}>Tech Stack Used</h2>
                    <p style={s.sectionSub}>Technologies used to build LearnFlow</p>
                </div>
                <div style={s.techGrid}>
                    {techStack.map(t => (
                        <div key={t.name} style={s.techCard}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d40'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            <div style={{ fontSize: 36, marginBottom: 10 }}>{t.icon}</div>
                            <div style={{ ...s.techName, color: t.color }}>{t.name}</div>
                            <div style={s.techDesc}>{t.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Developer ── */}
            <section style={s.section}>
                <div style={s.sectionHead}>
                   
                    <h2 style={s.sectionTitle}>Meet the Developer</h2>
                    <p style={s.sectionSub}>The person behind LearnFlow</p>
                </div>
                <div style={s.teamGrid}>
                    {team.map(t => (
                        <div key={t.name} style={s.teamCard}>
                            <div style={{ ...s.teamAvatar, background: t.color + '33', border: `3px solid ${t.color}` }}>
                                <span style={{ fontSize: 36, fontWeight: 800, color: t.color }}>{t.avatar}</span>
                            </div>
                            <h3 style={s.teamName}>{t.name}</h3>
                            <div style={{ ...s.teamRole, color: t.color }}>{t.role}</div>
                            <p style={s.teamDesc}>{t.desc}</p>
                            <div style={s.teamTags}>
                                {['React.js', 'Laravel', 'MySQL', 'PHP'].map(skill => (
                                    <span key={skill} style={s.tag}>{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Project Info ── */}
            <section style={{ ...s.section, background: '#080d14' }}>
                <div style={s.sectionHead}>
                    <h2 style={s.sectionTitle}>Project Information</h2>
                </div>
                <div style={s.infoGrid}>
                    {[
                        { label: 'Project Name',    value: 'LearnFlow LMS' },
                        { label: 'Project Type',    value: 'Final Year Project' },
                        { label: 'Institution',     value: 'SLIATE (ATI Kegalle)' },
                        { label: 'Programme',       value: 'HND in Information Technology' },
                        { label: 'Academic Year',   value: '2023/2024' },
                        { label: 'Year Developed',  value: '2026' },
                        { label: 'Frontend',        value: 'React.js' },
                        { label: 'Backend',         value: 'Laravel 10 + MySQL' },
                    ].map(info => (
                        <div key={info.label} style={s.infoCard}>
                            <div style={s.infoLabel}>{info.label}</div>
                            <div style={s.infoValue}>{info.value}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={s.cta}>
                <div style={s.ctaBlob1} />
                <div style={s.ctaBlob2} />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h2 style={s.ctaTitle}>Ready to join LearnFlow? </h2>
                    <p style={s.ctaSub}>Create a free account and start learning today.</p>
                    <div style={s.ctaBtns}>
                        <button style={s.btnGrad} onClick={() => navigate('/register')}>Create Account</button>
                        <button style={s.btnGhost} onClick={() => navigate('/login')}>Login</button>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={s.footer}>
                <div style={s.footerInner}>
                    <div style={s.footerLogo} onClick={() => navigate('/')}>
                        <div style={s.logoBox}>LF</div>
                        <span style={s.logoText}>LearnFlow</span>
                    </div>
                    <span style={s.footerText}>© 2026 LearnFlow LMS · Built with React & Laravel · SLIATE Final Year Project</span>
                    <div style={s.footerLinks}>
                        <span style={s.footerLink} onClick={() => navigate('/')}>Home</span>
                        <span style={s.footerLink} onClick={() => navigate('/login')}>Login</span>
                        <span style={s.footerLink} onClick={() => navigate('/register')}>Register</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}

const s = {
    page: { fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#0a0f1a', color: '#e2e8f0', minHeight: '100vh', position: 'relative', overflow: 'hidden' },
    blob: { position: 'fixed', width: 400, height: 400, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 },

    // Navbar
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', background: 'rgba(10,15,26,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e2d40', position: 'sticky', top: 0, zIndex: 50 },
    navLogo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
    logoBox: { width: 34, height: 34, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 },
    logoText: { fontWeight: 700, fontSize: 18, color: '#f1f5f9' },
    navLinks: { display: 'flex', alignItems: 'center', gap: 20 },
    navItem: { fontSize: 13, color: '#94a3b8', cursor: 'pointer', fontWeight: 500 },
    navBtnOutline: { background: 'none', border: '1px solid #334155', borderRadius: 8, padding: '7px 18px', fontSize: 13, color: '#94a3b8', cursor: 'pointer' },
    navBtnPrimary: { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, color: '#fff', cursor: 'pointer', fontWeight: 600 },

    // Hero
    hero: { padding: '72px 48px', background: 'linear-gradient(160deg,#0a0f1a 0%,#0d1220 100%)', borderBottom: '1px solid #1e2d40', textAlign: 'center', position: 'relative', zIndex: 1 },
    heroInner: { maxWidth: 700, margin: '0 auto' },
    heroBadge: { display: 'inline-block', background: '#7c3aed22', color: '#a78bfa', border: '1px solid #7c3aed44', borderRadius: 99, padding: '5px 14px', fontSize: 12, fontWeight: 600, marginBottom: 20 },
    heroTitle: { fontSize: 46, fontWeight: 800, lineHeight: 1.15, color: '#f1f5f9', marginBottom: 18 },
    heroGrad: { background: 'linear-gradient(90deg,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    heroSub: { fontSize: 15, color: '#64748b', lineHeight: 1.8, marginBottom: 28, maxWidth: 560, margin: '0 auto 28px' },
    heroBtns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },

    // Buttons
    btnGrad: { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    btnGhost: { background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },

    // Stats
    statsBar: { background: '#080d14', borderBottom: '1px solid #1e2d40', padding: '28px 48px', display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap', position: 'relative', zIndex: 1 },
    statItem: { textAlign: 'center' },
    statVal: { fontSize: 26, fontWeight: 800, background: 'linear-gradient(90deg,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    statLbl: { fontSize: 12, color: '#475569', marginTop: 4 },

    // Section
    section: { padding: '72px 48px', background: '#0a0f1a', position: 'relative', zIndex: 1 },
    sectionHead: { textAlign: 'center', marginBottom: 44 },
    sectionTag: { display: 'inline-block', background: '#7c3aed22', color: '#a78bfa', border: '1px solid #7c3aed44', borderRadius: 99, padding: '4px 14px', fontSize: 12, fontWeight: 600, marginBottom: 12 },
    sectionTitle: { fontSize: 30, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 },
    sectionSub: { fontSize: 14, color: '#475569' },

    // Mission Vision Goal
    mvgGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' },
    mvgCard: { background: '#0d1220', border: '1px solid #1e2d40', borderRadius: 16, padding: '28px 24px', textAlign: 'center' },
    mvgIcon: { fontSize: 40, marginBottom: 14 },
    mvgTitle: { fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 10 },
    mvgDesc: { fontSize: 13, color: '#64748b', lineHeight: 1.7 },

    // About
    aboutInner: { maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-start', gap: 48, flexWrap: 'wrap' },
    aboutLeft: { flex: 1, minWidth: 300 },
    aboutText: { fontSize: 14, color: '#64748b', lineHeight: 1.8, marginBottom: 14 },
    aboutTags: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 },
    tag: { background: '#1e2d40', color: '#94a3b8', borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 600 },
    aboutRight: { flex: 1, minWidth: 260 },
    aboutCard: { background: '#0a0f1a', border: '1px solid #1e2d40', borderRadius: 16, padding: '28px 24px' },
    aboutCardIcon: { fontSize: 40, marginBottom: 12, textAlign: 'center' },
    aboutCardTitle: { fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16, textAlign: 'center' },
    aboutCardItems: { display: 'flex', flexDirection: 'column', gap: 8 },
    aboutCardItem: { fontSize: 13, color: '#64748b', padding: '6px 0', borderBottom: '1px solid #1e2d40' },

    // Features
    featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' },
    featCard: { background: '#0d1220', border: '1px solid #1e2d40', borderRadius: 14, padding: '24px 20px', transition: 'border-color 0.2s' },
    featIcon: { fontSize: 30, marginBottom: 12 },
    featTitle: { fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 },
    featDesc: { fontSize: 13, color: '#64748b', lineHeight: 1.6 },

    // Tech Stack
    techGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 16, maxWidth: 900, margin: '0 auto' },
    techCard: { background: '#0d1220', border: '1px solid #1e2d40', borderRadius: 14, padding: '24px 16px', textAlign: 'center', transition: 'border-color 0.2s, transform 0.2s', cursor: 'default' },
    techName: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
    techDesc: { fontSize: 12, color: '#475569' },

    // Team
    teamGrid: { display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' },
    teamCard: { background: '#0d1220', border: '1px solid #1e2d40', borderRadius: 20, padding: '32px 28px', textAlign: 'center', width: 320 },
    teamAvatar: { width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
    teamName: { fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 },
    teamRole: { fontSize: 13, fontWeight: 600, marginBottom: 12 },
    teamDesc: { fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 16 },
    teamTags: { display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' },

    // Project Info
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, maxWidth: 900, margin: '0 auto' },
    infoCard: { background: '#0d1220', border: '1px solid #1e2d40', borderRadius: 12, padding: '16px 20px' },
    infoLabel: { fontSize: 11, color: '#475569', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 },
    infoValue: { fontSize: 14, fontWeight: 700, color: '#f1f5f9' },

    // CTA
    cta: { position: 'relative', overflow: 'hidden', padding: '72px 48px', background: '#080d14', borderTop: '1px solid #1e2d40', textAlign: 'center', zIndex: 1 },
    ctaBlob1: { position: 'absolute', top: -60, left: '20%', width: 300, height: 300, background: '#7c3aed22', borderRadius: '50%', filter: 'blur(60px)' },
    ctaBlob2: { position: 'absolute', bottom: -60, right: '20%', width: 300, height: 300, background: '#2563eb22', borderRadius: '50%', filter: 'blur(60px)' },
    ctaTitle: { fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 },
    ctaSub: { fontSize: 14, color: '#475569', marginBottom: 28 },
    ctaBtns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },

    // Footer
    footer: { borderTop: '1px solid #1e2d40', padding: '20px 48px', background: '#080d14', position: 'relative', zIndex: 1 },
    footerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
    footerLogo: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' },
    footerText: { fontSize: 12, color: '#334155' },
    footerLinks: { display: 'flex', gap: 16 },
    footerLink: { fontSize: 13, color: '#475569', cursor: 'pointer' },
};