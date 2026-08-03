import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdBookmarkAdded, MdBookOnline, MdEmail, MdLibraryBooks, MdLockOutline, MdRemoveRedEye } from 'react-icons/md';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { MdBook, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLogout, MdPeopleAlt, MdLockClock } from 'react-icons/md';
import { MdPictureAsPdf, MdStar ,MdNotes, MdVideoLibrary, MdLock, MdCheckCircle, 
    MdPhoneAndroid,MdPhone, MdSchool, MdMenuBook, MdPerson, MdCelebration, MdAdminPanelSettings, MdCastForEducation, 
    MdLaptop,
    MdOutlinePlaylistAddCheckCircle,
    MdMan3,
    MdOutlineMan2} from 'react-icons/md';
import { BiAlignMiddle } from 'react-icons/bi';
export default function Home() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);
    const [stats, setStats] = useState({ total_courses: 20, total_students: 180, total_lecturers: 15 });
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/guest/stats')
            .then(r => r.json())
            .then(data => setStats(data))
            .catch(() => {});

        fetch('http://127.0.0.1:8000/api/guest/courses')
            .then(r => r.json())
            .then(data => setCourses(data.slice(0, 3)))
            .catch(() => {});
    }, []);

    const faqs = [
        { q: 'What is LearnFlow?', a: 'LearnFlow is a modern Learning Management System built for students, lecturers and admins. It allows lecturers to upload course materials and students to access them in one place.' },
        { q: 'How do I create an account?', a: 'Click Register, fill in your name, email, role and password. Your account will be reviewed by Admin before you can login.' },
        { q: 'Why can\'t I login after registering?', a: 'After registration your account needs Admin approval. This ensures only valid users access the system. Please wait for approval.' },
        { q: 'What types of materials can lecturers upload?', a: 'Lecturers can upload PDF files, written notes and video links for each course topic.' },
        { q: 'Can guests download materials?', a: 'No. Guests can only browse course titles and descriptions. You must register and login to access materials.' },
        { q: 'How does a lecturer get assigned to a course?', a: 'The Admin assigns lecturers to courses. Once assigned, the lecturer can upload materials for that course.' },
    ];

    const features = [
        { icon: <MdBookmarkAdded size={25} color="#00e1ff"/>, title: 'PDF Materials',   desc: 'Download and read PDF files uploaded by your lecturers anytime.' },
        { icon: <MdNotes size={25} color="#00e1ff"/>, title: 'Written Notes',   desc: 'Access detailed notes written directly by your lecturers.' },
        { icon: <MdVideoLibrary size={25} color="#00e1ff"/>, title: 'Video Lessons',   desc: 'Watch video links shared by lecturers for each topic.' },
        { icon: <MdLock size={25} color="#00e1ff"/>, title: 'Secure Access',   desc: 'Role-based login ensures you only see what is relevant to you.' },
        { icon: <MdCheckCircle size={25} color="#00e1ff"/>, title: 'Admin Approval',  desc: 'Every account is verified by Admin before access is granted.' },
        { icon: <MdPhone size={25} color="#00e1ff"/>, title: 'Easy to Use',     desc: 'Clean, modern interface that works for everyone without confusion.' },
    ];

    const steps = [
        { num: '01', title: 'Register',         desc: 'Create your account as a student or lecturer.',        color: '#a78bfa' },
        { num: '02', title: 'Admin Approval',   desc: 'Admin reviews and approves your registration.',        color: '#38bdf8' },
        { num: '03', title: 'Login',            desc: 'Login with your approved email and password.',         color: '#34d399' },
        { num: '04', title: 'Browse Courses',   desc: 'Explore all available courses in your dashboard.',     color: '#fb923c' },
        { num: '05', title: 'Access Materials', desc: 'View PDFs, notes and videos uploaded by lecturers.',   color: '#f472b6' },
        { num: '06', title: 'Complete Courses', desc: 'Learn at your own pace and grow every day.',           color: '#facc15' },
    ];

    const testimonials = [
        { name: 'Kasun Perera',   role: 'Student',    text: 'LearnFlow made it so easy to access my course materials. I can read notes and download PDFs anytime from anywhere!', stars: 5, avatar: 'K' },
        { name: 'Dr. Silva',      role: 'Lecturer',   text: 'Uploading materials is so simple. My students can access everything I share within seconds. Great platform!',          stars: 5, avatar: 'S' },
        { name: 'Admin User',     role: 'Admin',      text: 'Managing users and courses is very straightforward. The approval system keeps the platform secure and organized.',     stars: 5, avatar: 'A' },
        { name: 'kumari',     role: 'Student',      text: 'Its easy to learn here and can clear doubt imediatly',     stars: 5, avatar: 'K' },
    ];

    return (
        <div style={s.page}>

            {/* ── Navbar ── */}
            <nav style={s.nav}>
                <div style={s.navLogo}>
                    <div style={s.logoBox}>LF</div>
                    <span style={s.logoText}>LearnFlow<MdSchool size={33} color="#ffffff"/></span>
                </div>
                <div style={s.navLinks}>
                    <span style={s.navItem} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</span>
                    <span style={s.navItem} onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}>FAQ</span>
                    <span style={s.navItem} onClick={() => navigate('/about')}>About</span>
                    <button style={s.navBtnOutline} onClick={() => navigate('/login')}>Login</button>
                    <button style={s.navBtnPrimary} onClick={() => navigate('/register')}>Get Started</button>
                    <button style={s.guestBtn} onClick={() => navigate('/guest-courses')}>Browse Guest Courses</button>                
                </div>
            </nav>

            {/* ── Hero ── */}
            <section style={s.hero}>
                {/* Glow blobs */}
                <div style={{ ...s.blob, top: -80, left: -80, background: 'rgba(124,58,237,0.25)' }} />
                <div style={{ ...s.blob, bottom: -620, right: -60, background: 'rgba(37,99,235,0.2)' }} />

                <div style={s.heroInner}>
                    <div style={s.heroLeft}>
                       
                        <h1 style={s.heroTitle}>
                            Learn at your<br />
                            <span style={s.heroGrad}>own pace,</span><br />
                            grow every day
                        </h1>
                        <p style={s.heroSub}>
                            LearnFlow connects students, lecturers and admins in one
                            elegant platform. Access courses, notes, PDFs and videos all in one place.
                        </p>
                            <div style={s.heroStats}>
                            {[
                                { icon: <MdBook size={15} />, val: `${stats.total_courses}+`,   lbl: 'Courses' },
                                { icon: <MdPerson size={15} />, val: `${stats.total_lecturers}+`, lbl: 'Lecturers' },
                                { icon: <MdSchool size={15} />, val: `${stats.total_students}+`,  lbl: 'Students' },
                            ].map(st => (
                                <div key={st.lbl} style={s.statPill}>
                                    <span style={{ fontSize: 16 }}>{st.icon}</span>
                                    <span style={s.statVal}>{st.val}</span>
                                    <span style={s.statLbl}>{st.lbl}</span>
                                </div>
                            ))}
                        </div>
                        <div style={s.heroBtns}>
                            <button style={s.btnGrad} onClick={() => navigate('/register')}>
                                Start Learning Free 
                            </button>
                            <button style={s.btnGhost} onClick={() => navigate('/login')}>
                                I have an account
                            </button>
                        </div>
                        <p style={s.heroNote}><MdLockOutline size={13} /> Account reviewed by Admin before login</p>
                    </div>

                    <div style={s.heroRight}>
                        <div style={s.heroCard}>
                            <div style={s.heroCardGlow} />
                            <div style={{ fontSize: 52, marginBottom: 14 }}><MdPerson size={85} color="#00e1ff"/></div>
                            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15, marginBottom: 4 }}>Start Learning Today</div>
                            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 16 }}>Join hundreds of students</div>
                            <div style={s.heroMini}>
                                {[' PDF Materials', 'Video Lessons', ' Notes'].map(t => (
                                    <div key={t} style={s.heroMiniItem}>{t}</div>
                                ))}
                            </div>
                            <button style={{ ...s.btnGrad, width: '100%', marginTop: 14 }} onClick={() => navigate('/register')}>
                                Join Now 
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <section style={s.statsBar}>
                {[
                    {icon: <MdBook size={35}color="#ecc80f" />, val: `${stats.total_courses}+`,   lbl: 'Available Courses' },
                    { icon: <MdPerson size={35} color="#a9a0ed"/>, val: `${stats.total_lecturers}+`, lbl: 'Expert Lecturers' },
                    { icon: <MdSchool size={35} color="#7462ff"/>, val: `${stats.total_students}+`,  lbl: 'Active Students' },
                    { icon: <MdStar size={35} color="#ecc80f" />, val: '100%',                       lbl: 'Free to Use' },
                ].map(st => (
                    <div key={st.lbl} style={s.statsItem}>
                        <span style={{ fontSize: 24, marginBottom: 6 }}>{st.icon}</span>
                        <span style={s.statsVal}>{st.val}</span>
                        <span style={s.statsLbl}>{st.lbl}</span>
                    </div>
                ))}
            </section>

            {/* ── Popular Courses ── */}
            {courses.length > 0 && (
                <section style={s.section}>
                    <div style={s.sectionHead}>
                        <h2 style={s.sectionTitle}>Popular Courses</h2>
                        <p style={s.sectionSub}>Browse our most popular courses. Register to start learning.</p>
                    </div>
                    <div style={s.courseGrid}>
                        {courses.map((c, i) => (
                            <div key={c.id} style={s.courseCard}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d40'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ ...s.courseCardTop, background: ['#7c3aed22', '#2563eb22', '#5225e522'][i % 3] }}>
                                    <span style={{ fontSize: 32 }}><MdLibraryBooks size={35} color="#00e1ff"/></span>
                                </div>
                                <div style={s.courseCardBody}>
                                    <span style={s.courseCode}>{c.course_code}</span>
                                    <h3 style={s.courseTitle}>{c.course_name}</h3>
                                    <p style={s.courseDesc}>{c.description?.slice(0, 80)}...</p>
                                    <div style={s.courseLecturer}>
                                        <div style={s.courseAvatar}>{c.lecturer?.name?.[0]?.toUpperCase() || '?'}</div>
                                        <span style={{ fontSize: 12, color: '#64748b' }}>{c.lecturer?.name || 'Not assigned'}</span>
                                    </div>
                                    <button style={s.courseBtn} onClick={() => navigate('/register')}>
                                        <MdLockOutline size={20} />Login to Enroll
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 28 }}>
                        <button style={s.btnGrad} onClick={() => navigate('/guest/courses')}>
                            Browse All Courses 
                        </button>
                    </div>
                </section>
            )}

            {/* ── Features ── */}
            <section style={{ ...s.section, background: '#080d14' }} id="features">
                <div style={s.sectionHead}>
                    <h2 style={s.sectionTitle}>Why Choose LearnFlow <MdRemoveRedEye size={25} color="#00e1ff"/></h2>
                    <p style={s.sectionSub}>Everything you need for a smooth and modern learning experience</p>
                </div>
                <div style={s.featGrid}>
                    {features.map(f => (
                        <div key={f.title} style={s.featCard}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.background = '#0f1629'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d40'; e.currentTarget.style.background = '#0d1220'; }}
                        >
                            <div style={s.featIcon}>{f.icon}</div>
                            <div style={s.featTitle}>{f.title}</div>
                            <div style={s.featDesc}>{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Timeline ── */}
            <section style={s.section}>
                <div style={s.sectionHead}>
                    <h2 style={s.sectionTitle}>Your Learning Journey</h2>
                    <p style={s.sectionSub}>From guest to certified learner in simple steps</p>
                </div>
                <div style={s.timeline}>
                    {steps.map((st, i) => (
                        <div key={st.num} style={s.timelineItem}>
                            <div style={{ ...s.timelineNum, background: st.color + '22', color: st.color, border: `2px solid ${st.color}` }}>
                                {st.num}
                            </div>
                            {i < steps.length - 1 && <div style={s.timelineLine} />}
                            <div style={s.timelineTitle}>{st.title}</div>
                            <div style={s.timelineDesc}>{st.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section style={{ ...s.section, background: '#080d14' }}>
                <div style={s.sectionHead}>
                    <h2 style={s.sectionTitle}>What People Say</h2>
                    <p style={s.sectionSub}>Hear from our students, lecturers and admins</p>
                </div>
                <div style={s.testiGrid}>
                    {testimonials.map(t => (
                        <div key={t.name} style={s.testiCard}>
                            <div style={s.testiStars}>{'⭐'.repeat(t.stars)}</div>
                            <p style={s.testiText}>"{t.text}"</p>
                            <div style={s.testiAuthor}>
                                <div style={s.testiAvatar}>{t.avatar}</div>
                                <div>
                                    <div style={s.testiName}>{t.name}</div>
                                    <div style={s.testiRole}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FAQ ── */}
            <section style={s.section} id="faq">
                <div style={s.sectionHead}>
                    <h2 style={s.sectionTitle}>Frequently Asked Questions</h2>
                    <p style={s.sectionSub}>Got questions? We have answers!</p>
                </div>
                <div style={s.faqWrapper}>
                    {faqs.map((f, i) => {
                        const isOpen = openFaq === i;
                        return (
                            <div key={i} style={{ ...s.faqItem, borderColor: isOpen ? '#7c3aed' : '#1e2d40' }}
                                onClick={() => setOpenFaq(isOpen ? null : i)}
                            >
                                <div style={s.faqQ}>
                                    <span>{f.q}</span>
                                    <span style={{ ...s.faqIcon, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                                </div>
                                {isOpen && <div style={s.faqA}>{f.a}</div>}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={s.cta}>
                <div style={s.ctaBlob1} />
                <div style={s.ctaBlob2} />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h2 style={s.ctaTitle}>Ready to start learning? </h2>
                    <p style={s.ctaSub}>Join LearnFlow today. It's completely free.</p>
                    <div style={s.ctaBtns}>
                        <button style={s.btnGrad} onClick={() => navigate('/register')}>Create Free Account</button>
                        <button style={s.btnGhost} onClick={() => navigate('/login')}>Login</button>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={s.footer}>
                <div style={s.footerTop}>
                <div style={{ ...s.blob, top: -80, left: -80, background: 'rgba(124,58,237,0.25)' }} />
                <div style={{ ...s.blob, bottom: -620, right: -60, background: 'rgba(37,99,235,0.2)' }} />
                    <div>
                        <div style={s.footerLogo}>
                            <div style={s.logoBox}>LF</div>
                            <span style={s.logoText}>LearnFlow<MdSchool size={30} color="#ffffff"/></span>
                        </div>
                        <p style={s.footerTagline}>A modern platform for students, lecturers and admins.</p>
                    </div>
                    <div style={s.footerLinks}>
                        <div style={s.footerCol}>
                            <div style={s.footerColTitle}>Quick Links</div>
                            {['Home', 'Browse Courses', 'Login', 'Register'].map(l => (
                                <div key={l} style={s.footerLink}
                                    onClick={() => navigate(l === 'Home' ? '/' : l === 'Browse Courses' ? '/guest/courses' : `/${l.toLowerCase()}`)}
                                >{l}</div>
                            ))}
                        </div>
                        <div style={s.footerCol}>
                            <div style={s.footerColTitle}>Roles</div>
                            {['Student', 'Lecturer', 'Admin'].map(r => (
                                <div key={r} style={s.footerLink}>{r}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <div style={s.footerBottom}>
                    <span>© 2026 LearnFlow LMS · Built with React & Laravel<b/></span>
                    <div style={s.socialIcons}>
                      <span style={s.socialIcon}><FaFacebook size={18} /></span>
                    <span style={s.socialIcon}><FaTwitter size={18} /></span>
                    <span style={s.socialIcon}><FaInstagram size={18} /></span>
                    <span style={s.socialIcon}><FaLinkedin size={18} /></span>
                    <span style={s.socialIcon}><MdEmail size={20} /></span>
                    </div>
                </div>
            </footer>

        </div>
    );
}

// ─── Styles ──────────────────────────────────────────────────
const s = {
    page: { fontFamily: "'Segoe UI', system-ui, sans-serif", background: '#0a0f1a', color: '#e2e8f0', minHeight: '100vh' },

    // Navbar
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', background: 'rgba(29, 38, 57, 0.95)', backdropFilter: 'blur(22px)', borderBottom: '1px solid #1e2d40', position: 'sticky', top: 0, zIndex: 50 },
    navLogo: { display: 'flex', alignItems: 'center', gap: 10 },
    logoBox: { width: 34, height: 34, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 },
    logoText: { fontWeight: 700, fontSize: 18, color: '#f1f5f9' },
    navLinks: { display: 'flex', alignItems: 'center', gap: 20 },
    navItem: { fontSize: 13, color: '#94a3b8', cursor: 'pointer', fontWeight: 500 },
    navBtnOutline: { background: 'none', border: '1px solid #334155', borderRadius: 8, padding: '7px 18px', fontSize: 13, color: '#94a3b8', cursor: 'pointer', fontWeight: 500 },
    navBtnPrimary: { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, color: '#fff', cursor: 'pointer', fontWeight: 600 },

    // Hero
    hero: { position: 'relative', overflow: 'hidden', padding: '80px 48px', background: 'linear-gradient(160deg,#0a0f1a 0%,#0d1220 100%)', borderBottom: '1px solid #1e2d40' },
    blob: { position: 'absolute', width: 400, height: 400, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' },
    heroInner: { maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap', position: 'relative', zIndex: 1 },
    heroLeft: { flex: 1, minWidth: 300 },
    heroBadge: { display: 'inline-block', background: '#7c3aed22', color: '#a78bfa', border: '1px solid #7c3aed44', borderRadius: 99, padding: '5px 14px', fontSize: 12, fontWeight: 600, marginBottom: 20 },
    heroTitle: { fontSize: 46, fontWeight: 800, lineHeight: 1.15, color: '#f1f5f9', marginBottom: 18 },
    heroGrad: { background: 'linear-gradient(90deg,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    heroSub: { fontSize: 15, color: '#64748b', lineHeight: 1.8, marginBottom: 28, maxWidth: 460 },
    heroStats: { display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' },
    statPill: { display: 'flex', alignItems: 'center', gap: 6, background: '#0d1629', border: '1px solid #1e2d40', borderRadius: 99, padding: '6px 14px' },
    statVal: { fontWeight: 700, fontSize: 14, color: '#a78bfa' },
    statLbl: { fontSize: 12, color: '#64748b' },
    heroBtns: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
    heroNote: { fontSize: 12, color: '#475569' },
    heroRight: { flex: 1, minWidth: 260, display: 'flex', justifyContent: 'center' },
    heroCard: { position: 'relative', background: '#0d1220', border: '1px solid #1e2d40', borderRadius: 20, padding: '32px 28px', textAlign: 'center', width: 280, overflow: 'hidden' },
    heroCardGlow: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: '#7c3aed33', borderRadius: '50%', filter: 'blur(30px)' },
    heroMini: { display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'center'},
    heroMiniItem: { background: '#131c2e', border: '1px solid #1e2d40', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#94a3b8', textAlign: 'left' },

    // Buttons
    btnGrad: { background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    btnGhost: { background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },

    // Stats Bar
    statsBar: { background: '#080d14', borderBottom: '1px solid #1e2d40', padding: '28px 48px', display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap' },
    statsItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
    statsVal: { fontSize: 26, fontWeight: 800, background: 'linear-gradient(90deg,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    statsLbl: { fontSize: 12, color: '#475569' },

    // Section
    section: { padding: '72px 48px', background: '#0a0f1a' },
    sectionHead: { textAlign: 'center', marginBottom: 44 },
    sectionTag: { display: 'inline-block', background: '#7c3aed22', color: '#a78bfa', border: '1px solid #7c3aed44', borderRadius: 99, padding: '4px 14px', fontSize: 12, fontWeight: 600, marginBottom: 12 },
    sectionTitle: { fontSize: 30, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 },
    sectionSub: { fontSize: 14, color: '#475569', maxWidth: 500, margin: '0 auto' },

    // Courses
    courseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' },
    courseCard: { background: '#0d1220', border: '1px solid #1e2d40', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s' },
    courseCardTop: { height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    courseCardBody: { padding: '16px 20px 20px' },
    courseCode: { display: 'inline-block', background: '#7c3aed22', color: '#a78bfa', border: '1px solid #7c3aed44', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700, marginBottom: 10 },
    courseTitle: { fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 },
    courseDesc: { fontSize: 13, color: '#475569', lineHeight: 1.6, marginBottom: 14 },
    courseLecturer: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 },
    courseAvatar: { width: 28, height: 28, background: '#1e3a5f', color: '#60a5fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 },
    courseBtn: { width: '100%', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px', fontWeight: 600, fontSize: 13, cursor: 'pointer' },

    // Features
    featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' },
    featCard: { background: '#0d1220', border: '1px solid #1e2d40', borderRadius: 14, padding: '24px 20px', transition: 'border-color 0.2s, background 0.2s', cursor: 'default' },
    featIcon: { fontSize: 30, marginBottom: 12 },
    featTitle: { fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 },
    featDesc: { fontSize: 13, color: '#475569', lineHeight: 1.6 },

    // Timeline
    timeline: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto', position: 'relative' },
    timelineItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' },
    timelineNum: { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, marginBottom: 12, flexShrink: 0 },
    timelineLine: { display: 'none' },
    timelineTitle: { fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 6 },
    timelineDesc: { fontSize: 12, color: '#475569', lineHeight: 1.5 },

    // Testimonials
    testiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' },
    testiCard: { background: '#0d1220', border: '1px solid #1e2d40', borderRadius: 16, padding: '24px 22px' },
    testiStars: { fontSize: 14, marginBottom: 12 },
    testiText: { fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 18, fontStyle: 'italic' },
    testiAuthor: { display: 'flex', alignItems: 'center', gap: 12 },
    testiAvatar: { width: 38, height: 38, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 },
    testiName: { fontSize: 13, fontWeight: 700, color: '#f1f5f9' },
    testiRole: { fontSize: 11, color: '#475569' },

    // FAQ
    faqWrapper: { maxWidth: 700, margin: '0 auto' },
    faqItem: { border: '1px solid #1e2d40', borderRadius: 10, marginBottom: 8, overflow: 'hidden', cursor: 'pointer', background: '#0d1220', transition: 'border-color 0.2s' },
    faqQ: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', fontSize: 14, fontWeight: 600, color: '#f1f5f9' },
    faqIcon: { fontSize: 16, color: '#7c3aed', transition: 'transform 0.2s', flexShrink: 0 },
    faqA: { padding: '0 18px 16px', fontSize: 13, color: '#475569', lineHeight: 1.7 },

    // CTA
    cta: { position: 'relative', overflow: 'hidden', padding: '72px 48px', background: '#080d14', borderTop: '1px solid #1e2d40', borderBottom: '1px solid #1e2d40' },
    ctaBlob1: { position: 'absolute', top: -60, left: '20%', width: 300, height: 300, background: '#7c3aed22', borderRadius: '50%', filter: 'blur(60px)' },
    ctaBlob2: { position: 'absolute', bottom: -60, right: '20%', width: 300, height: 300, background: '#2563eb22', borderRadius: '50%', filter: 'blur(60px)' },
    ctaTitle: { fontSize: 30, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 },
    ctaSub: { fontSize: 14, color: '#475569', marginBottom: 28 },
    ctaBtns: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },

    // Footer
    footer: { background: '#0b1a2f', borderTop: '1px solid #203654', padding: '40px 48px 20px' },
    footerTop: {  top: -60,display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 32 },
    footerLogo: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
    footerTagline: { fontSize: 13, color: '#475569', maxWidth: 260, lineHeight: 1.6 },
    footerLinks: { display: 'flex', gap: 48, flexWrap: 'wrap' },
    footerCol: { display: 'flex', flexDirection: 'column', gap: 10 },
    footerColTitle: { fontSize: 12, fontWeight: 700, color: '#96a2b2', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
    footerLink: { fontSize: 13, color: '#89909b', cursor: 'pointer' },
    footerBottom: { borderTop: '1px solid #e6f1ff', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#b8bbc0' },
    socialIcons: { display: 'flex', gap: 10 },
    socialIcon: { fontSize: 18, cursor: 'pointer' },


// inside your `s` style object
guestBtn: {
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(37,99,235,0.25)',
},
    
};