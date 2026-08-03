import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultCourseImg from './images/img1.avif';
import { MdBook, MdPerson, MdLightbulb, MdKeyboardArrowUp, MdKeyboardArrowDown, MdSchool, MdLogout, MdPeopleAlt, MdLockClock } from 'react-icons/md';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const CAT_COLORS = {
  WEB: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  IT: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  SE: { bg: '#faf5ff', color: '#7c3aed', border: '#ddd6fe' },
  DB: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  NET: { bg: '#ecfeff', color: '#0891b2', border: '#a5f3fc' },
};

const getCatColor = (code) => {
  if (!code) return { bg: '#f1f5f9', color: '#5e85bc', border: '#e2e8f0' };
  const prefix = code.replace(/[0-9]/g, '').toUpperCase();
  return CAT_COLORS[prefix] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
};

const getCourseImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  if (imagePath.startsWith('http')) return imagePath;
  const backendHost = 'http://127.0.0.1:8000';
  const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${backendHost}${normalized}`;
};

function CourseCard({ course, onRegister }) {
  const [hovered, setHovered] = useState(false);
  const cat = getCatColor(course.course_code);
  const courseImageUrl = getCourseImageUrl(course.image);

  return (
    <div
      style={{
        ...s.card,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 16px 40px rgba(37,99,235,0.14)'
          : '0 8px 24px rgba(15,23,42,0.05)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={s.cardBanner}>
        {courseImageUrl ? (
          <img
            src={courseImageUrl}
            alt={course.course_name || 'Course image'}
            style={s.cardBannerImg}
            onError={(e) => { e.target.onerror = null; e.target.src = defaultCourseImg; }}
          />
        ) : (
          <span style={{ fontSize: 36 }}><MdBook size={35} color="#7462ff" /></span>
        )}
      </div>
      <div style={s.cardBody}>
        <span style={{ ...s.catBadge, background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
          {course.course_code}
        </span>
        <h3 style={s.cardTitle}>{course.course_name || 'Untitled Course'}</h3>
        <p style={s.cardDesc}>
          {course.description
            ? course.description.length > 90
              ? course.description.slice(0, 90) + '...'
              : course.description
            : 'No description available.'}
        </p>
        <div style={s.cardLecturer}>
          <div style={s.avatarSm}>{course.lecturer?.name?.[0]?.toUpperCase() || '?'}</div>
          <span style={s.lecturerName}>{course.lecturer?.name || 'Not assigned'}</span>
        </div>
        <div style={s.cardActions}>
          <button style={s.loginBtn} onClick={onRegister}>
            Guest View
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GuestCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ total_courses: 0, total_students: 0, total_lecturers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/guest/courses')
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('http://127.0.0.1:8000/api/guest/stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLogo} onClick={() => navigate('/')}>
          <div style={s.logoBox}>LF</div>
          <span style={s.logoText}>LearnFlow<MdSchool size={35} color="#ffffff" /></span>
        </div>
        <div style={s.navMenu}>
          <span style={s.navLink} onClick={() => navigate('/')}>Home</span>
          <button style={s.navBtnOutline} onClick={() => navigate('/login')}>Login</button>
          <button style={s.navBtnPrimary} onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroLeft}>
            <h1 style={s.heroTitle}>
              Browse <span style={s.heroBlue}>Courses</span> as a Guest
            </h1>
            <p style={s.heroSub}>
              Discover all available courses created by admins and taught by lecturers.
            </p>

            <div style={s.heroButtons}>
              <button style={s.btnPrimary} onClick={() => navigate('/register')}>
                Register Free
              </button>
              <button style={s.btnOutline} onClick={() => navigate('/login')}>
                Already a member?
              </button>
            </div>

            <div style={s.heroStats}>
              {[
                { icon: <MdSchool size={35} color="#d2d2d2" />, value: stats.total_courses, label: 'Courses' },
                { icon: <MdPerson size={35} color="#adadaf" />, value: stats.total_lecturers, label: 'Lecturers' },
                { icon: <MdPeopleAlt size={35} color="#bababe" />, value: stats.total_students, label: 'Students' },
              ].map((st) => (
                <div key={st.label} style={s.heroStat}>
                  <span style={s.heroStatIcon}>{st.icon}</span>
                  <div>
                    <div style={s.heroStatVal}>{st.value}+</div>
                    <div style={s.heroStatLbl}>{st.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.heroRight}>
            <div style={s.heroCard}>
              <span style={{ fontSize: 42, marginBottom: 10 }}><MdLightbulb size={35} color="#f1ff26" /></span>
              <h3 style={s.heroCardTitle}>Guest Access</h3>
              <p style={s.heroCardText}>
                You can browse all available courses here without purchasing anything.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={s.grid}>
        <h2 style={s.sectionTitle}>
          {loading ? 'Loading courses...' : `${courses.length} Courses Available`}
        </h2>

        {loading ? (
          <div style={s.loading}>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div style={s.empty}>
            <span style={{ fontSize: 32, marginBottom: 10 }}><MdBook size={35} color="#7afff8" /></span>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>No courses found</div>
          </div>
        ) : (
          <div style={s.courseGrid}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onRegister={() => navigate('/register')}
              />
            ))}
          </div>
        )}
      </section>

      <section style={s.cta}>
        <h2 style={s.ctaTitle}>Ready to start learning?</h2>
        <p style={s.ctaSub}>
          Create a free account to unlock full access to lessons, notes, videos, and progress tracking.
        </p>
        <div style={s.ctaButtons}>
          <button style={s.ctaBtnWhite} onClick={() => navigate('/register')}>
            Create Free Account
          </button>
          <button style={s.ctaBtnOutline} onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </section>

      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.footerLogo}>
            <div style={s.logoBox}>LF</div>
            <span style={{ fontWeight: 700, color: '#d7e6ff' }}>LearnFlow</span>
          </div>
          <span style={s.footerText}>© 2026 LearnFlow LMS · Built with React & Laravel</span>
          <div style={s.heroButtons}>
            <span style={s.heroButtons} onClick={() => navigate('/login')}>Login</span>
            <span style={s.heroButtons} onClick={() => navigate('/register')}>Register</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const s = {
  page: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    background: '#071425',
    minHeight: '100vh',
    color: '#e6eef8',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 48px',
    background: '#071425',
    borderBottom: '1px solid #0f1724',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  logoBox: {
    width: 36,
    height: 36,
    background: '#60a5fa',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#071425',
    fontWeight: 800,
  },
  logoText: { fontWeight: 800, fontSize: 18, color: '#e6eef8' },
  navMenu: { display: 'flex', alignItems: 'center', gap: 14 },
  navLink: { color: '#cbd5e1', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  navBtnOutline: {
    background: 'transparent',
    border: '1px solid #1f2937',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 600,
    color: '#cbd5e1',
    cursor: 'pointer',
  },
  navBtnPrimary: {
    background: '#2563eb',
    border: 'none',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
  },
  hero: {
    background: 'linear-gradient(135deg, #a4a2a2 0%, #0f2c51 80%)',
    padding: '56px 48px',
    borderBottom: '1px solid #0f1724',
  },
  heroInner: {
    maxWidth: 1160,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 40,
    flexWrap: 'wrap',
  },
  heroLeft: { flex: 1, minWidth: 320 },
  heroTitle: { fontSize: 40, fontWeight: 800, lineHeight: 1.15, color: '#e6eef8', marginBottom: 14 },
  heroBlue: { color: '#60a5fa' },
  heroSub: { fontSize: 15, color: '#9fb7d9', lineHeight: 1.7, marginBottom: 22, maxWidth: 520 },
  heroButtons: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 },
  btnPrimary: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '11px 18px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnOutline: {
    background: 'transparent',
    color: '#cbd5e1',
    border: '1px solid #1f2937',
    borderRadius: 10,
    padding: '11px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  heroStats: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  heroStat: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#071425',
    border: '1px solid #0f1724',
    borderRadius: 12,
    padding: '10px 12px',
    boxShadow: '0 6px 20px rgba(2,6,23,0.6)',
  },
  heroStatIcon: { fontSize: 18 },
  heroStatVal: { fontWeight: 800, color: '#60a5fa' },
  heroStatLbl: { fontSize: 12, color: '#9fb7d9' },
  heroRight: { flex: 1, minWidth: 260, display: 'flex', justifyContent: 'center' },
  heroCard: {
    background: '#071425',
    border: '2px solid rgba(96,165,250,0.08)',
    borderRadius: 20,
    padding: '28px 24px',
    width: 280,
    textAlign: 'center',
    boxShadow: '0 12px 30px rgba(2,6,23,0.6)',
  },
  heroCardTitle: { fontSize: 18, fontWeight: 800, color: '#e6eef8', marginBottom: 8 },
  heroCardText: { fontSize: 13, color: '#9fb7d9', lineHeight: 1.6 },
  grid: { padding: '36px 48px', maxWidth: 1160, margin: '0 auto' },
  sectionTitle: { fontSize: 22, fontWeight: 800, color: '#e6eef8', marginBottom: 18 },
  courseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 },
  loading: { textAlign: 'center', padding: 42, color: '#9fb7d9' },
  empty: { textAlign: 'center', padding: 42, color: '#9fb7d9' },
  card: {
    background: '#0a183a',
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid #506b98',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardBanner: { height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#0f172a' },
  cardBannerImg: { width: '100%', height: '100%', objectFit: 'cover' },
  cardBody: { padding: '16px 18px 18px' },
  catBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: 800, color: '#e6eef8', marginBottom: 8 },
  cardDesc: { fontSize: 13, color: '#9fb7d9', lineHeight: 1.6, marginBottom: 14, minHeight: 58 },
  cardLecturer: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 },
  avatarSm: {
    width: 30,
    height: 30,
    background: '#1f2937',
    color: '#60a5fa',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 12,
  },
  lecturerName: { fontSize: 13, color: '#cbd5e1', fontWeight: 600 },
  cardActions: { borderTop: '1px solid #0f1724', paddingTop: 12 },
  loginBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    color: '#fff',
    border: 'none',
    borderRadius: 9,
    padding: '10px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  cta: {
    background: 'linear-gradient(135deg, #071425, #071425)',
    padding: '54px 48px',
    textAlign: 'center',
  },
  ctaTitle: { fontSize: 26, fontWeight: 800, color: '#e6eef8', marginBottom: 10 },
  ctaSub: { fontSize: 14, color: '#9fb7d9', maxWidth: 540, margin: '0 auto 22px', lineHeight: 1.7 },
  ctaButtons: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' },
  ctaBtnWhite: {
    background: '#46494d',
    color: '#60a5fa',
    border: 'none',
    borderRadius: 9,
    padding: '12px 22px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  ctaBtnOutline: {
    background: 'transparent',
    color: '#cbd5e1',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 9,
    padding: '12px 22px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  footer: {
    background: '#243244',
    borderTop: '1px solid #3d4046',
    padding: '20px 48px',
  },
  footerInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    maxWidth: 1160,
    margin: '0 auto',
  },
  footerText: { fontSize: 12, color: '#94a3b8' },
  footerLinks: { display: 'flex', gap: 14 },
  footerLink: { color: '#cbd5e1', cursor: 'pointer', fontSize: 13 },
};