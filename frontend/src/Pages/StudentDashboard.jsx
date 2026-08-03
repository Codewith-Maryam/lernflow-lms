import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import defaultCourseImg from './images/img1.avif';
import { MdBook, MdPerson4, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLogout, MdPeopleAlt, MdLockClock, MdPerson3, MdAssignmentTurnedIn, MdSchool, MdPermCameraMic, MdSubtitles } from 'react-icons/md';
import { MdOutlineSchool } from 'react-icons/md'; 

function StudentDashboard() {
    const navigate = useNavigate();

    // Get logged in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Active tab state
    const [activeTab, setActiveTab] = useState('courses');

    // Data states
    const [myEnrollments, setMyEnrollments] = useState([]);
    const fetchMyEnrollments = async () => {
    try {
        const res = await api.get('/student/my-enrollments');
        setMyEnrollments(res.data);
    } catch (err) {}
};

const enrollCourse = async (courseId) => {
    try {
        await api.post(`/student/courses/${courseId}/enroll`);
        setSuccess('Enrolled successfully!');
        fetchMyEnrollments();
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to enroll.');
    }
};
    const [success, setSuccess] = useState('');
    const [courses,        setCourses]        = useState([]);
    const [materials,      setMaterials]      = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedNote,   setSelectedNote]   = useState(null);

    // Message states
    const [error,   setError]   = useState('');
    const [loading, setLoading] = useState(false);

    // -----------------------------------------------
    // LOAD COURSES WHEN PAGE LOADS
    // -----------------------------------------------
    useEffect(() => {
        fetchCourses();
        fetchMyEnrollments();
    }, []);

    // -----------------------------------------------
    // FETCH ALL COURSES
    // -----------------------------------------------
    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/student/courses');
            setCourses(res.data);
        } catch (err) {
            setError('Failed to load courses.');
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------
    // FETCH MATERIALS FOR A COURSE
    // -----------------------------------------------
    const fetchMaterials = async (courseId) => {
        setLoading(true);
        try {
            const res = await api.get(`/student/courses/${courseId}/materials`);
            setMaterials(res.data);
        } catch (err) {
            setError('Failed to load materials.');
        } finally {
            setLoading(false);
        }
    };

    const getCourseImageUrl = (imagePath) => {
        if (!imagePath || typeof imagePath !== 'string') return null;
        if (imagePath.startsWith('http')) return imagePath;
        const backendHost = api.defaults.baseURL.replace(/\/api$/, '');
        return imagePath.startsWith('/') ? `${backendHost}${imagePath}` : `${backendHost}/${imagePath}`;
    };

    // -----------------------------------------------
    // SELECT A COURSE TO VIEW MATERIALS
    // -----------------------------------------------
    const selectCourse = (course) => {
        setSelectedCourse(course);
        setSelectedNote(null);
        setActiveTab('materials');
        fetchMaterials(course.id);
    };

    // -----------------------------------------------
    // VIEW A NOTE MATERIAL
    // -----------------------------------------------
  const viewNote = async (material) => {
    try {
        setError('');
        const res = await api.get(`/student/materials/${material.id}/note`);
        setSelectedNote({ title: material.title, content: res.data.content, message: material.message || '', });
        setActiveTab('note');
    } catch (err) {
        setError('Failed to load note content.');
    }
   

};
    // -----------------------------------------------
    // LOGOUT
    // -----------------------------------------------
    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (err) {}
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={styles.container}>

            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <div style={styles.sidebarLogo}>LearnFlow<MdSchool size={33} color="#ffffff"/></div>
                    <div style={styles.sidebarRole}><b><MdOutlineSchool  size={23} color="#e74c3c"/>student Dashboard</b> </div>
                </div>

                <div style={styles.sidebarContent}>
                    <nav style={styles.nav}>
                    {/* Courses Tab */}
                    <button
                        style={activeTab === 'courses' ? styles.navItemActive : styles.navItem}
                        onClick={() => setActiveTab('courses')}
                    >
                                 All Courses
                    </button>

                    {/* Materials Tab — only if course selected */}
                    {selectedCourse && (
                        <button
                            style={activeTab === 'materials' ? styles.navItemActive : styles.navItem}
                            onClick={() => setActiveTab('materials')}
                        >
                             Materials
                            <span style={styles.courseLabel}>
                                {selectedCourse.course_code}
                            </span>
                        </button>
                    )}

                    {/* Note Tab — only if note is open */}
                    {selectedNote && (
                        <button
                            style={activeTab === 'note' ? styles.navItemActive : styles.navItem}
                            onClick={() => setActiveTab('note')}
                        >
                             Reading Note
                        </button>
                    )}

                    {/* Course list while inside materials */}
                    {activeTab === 'materials' && courses.length > 0 && (
                        <div style={styles.sidebarCourseSection}>
                            <div style={styles.sidebarSectionTitle}>Other Courses</div>
                            {courses.map((course) => {
                                const courseImage = course?.image
                                    ? (typeof course.image === 'string' && course.image.startsWith('http')
                                        ? course.image
                                        : course.image.startsWith('/')
                                            ? course.image
                                            : `/${course.image}`)
                                    : null;
                                return (
                                    <button
                                        key={course.id}
                                        style={course.id === selectedCourse?.id ? styles.sidebarCourseActive : styles.sidebarCourseCard}
                                        onClick={() => selectCourse(course)}
                                    >
                                        {courseImage && (
                                            <img
                                                src={courseImage}
                                                alt={course.course_name || 'Course'}
                                                style={styles.sidebarCourseImg}
                                                onError={(e) => { e.target.onerror = null; e.target.src = defaultCourseImg; }}
                                            />
                                        )}
                                        <div style={styles.sidebarCourseInfo}>
                                            <div style={styles.sidebarCourseCode}>{course.course_code}</div>
                                            <div style={styles.sidebarCourseName}>{course.course_name}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    </nav>
                </div>

                <button style={styles.logoutBtn} onClick={logout}>
                    <MdLogout size={15} color="#e74c3c" /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div style={styles.main}>

                {/* Top Bar */}
                <div style={styles.topBar}>
                    <h1 style={styles.pageTitle}>
                        {activeTab === 'courses'   && ' Browse Courses'}
                        {activeTab === 'materials' && ` ${selectedCourse?.course_name}`}
                        {activeTab === 'note'      && ` ${selectedNote?.title}`}
                    </h1>
                    <div style={styles.userInfo}>
                        Welcome, <strong>{user?.name}</strong>
                    </div>
                </div>

                {/* Error Message */}
                {error && <div style={styles.errorBox}>{error}</div>}

                {/* Loading */}
                {loading && <div style={styles.loadingMsg}>Loading...</div>}

                {/* ---------------------------------------- */}
                {/* TAB: ALL COURSES                         */}
                {/* ---------------------------------------- */}
                {activeTab === 'courses' && !loading && (
                    <div style={styles.section}>
                        {courses.length === 0 ? (
                            <div style={styles.emptyMsg}>
                                No courses available yet.
                            </div>
                        ) : (
                            <div style={styles.courseGrid}>
                                {courses.map((course) => (
                                    <div key={course.id} style={styles.courseCard}>

                                        {/* Course Code Badge */}
                                        <div style={styles.courseCode}>
                                            {course.course_code}
                                        </div>

                                        {/* Course Image */}
                                        {course?.image && (
                                            <img
                                                src={getCourseImageUrl(course.image)}
                                                alt={course.course_name || 'Course image'}
                                                style={styles.courseImage}
                                            />
                                        )}
                                        <h3 style={styles.courseName}>
                                            {course.course_name}
                                        </h3>

                                        {/* Description */}
                                        <p style={styles.courseDesc}>
                                            {course.description || 'No description available.'}
                                        </p>

                                        {/* Lecturer Name */}
                                        <div style={styles.lecturerName}>
                                             {course.lecturer?.name || 'No lecturer assigned'}
                                        </div>
                                        

                                        {/* View Materials Button */}
                                       <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            style={styles.viewBtn}
                                            onClick={() => selectCourse(course)}
                                        >
                                            View Materials
                                        </button>
                                        
                                    </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ---------------------------------------- */}
                {/* TAB: MATERIALS                           */}
                {/* ---------------------------------------- */}
                {activeTab === 'materials' && !loading && (
                    <div style={styles.section}>

                        {/* Back Button */}
                        <button
                            style={styles.backBtn}
                            onClick={() => setActiveTab('courses')}
                        >
                            Back to Courses
                        </button>

                        {materials.length === 0 ? (
                            <div style={styles.emptyMsg}>
                                No materials uploaded for this course yet.
                            </div>
                        ) : (
                            <div style={styles.materialsGrid}>
                                {materials.map((m) => (
                                    <div key={m.id} style={styles.materialCard}>

                                        {/* Material Type Badge */}
                                        <span style={
                                            m.type === 'pdf'   ? styles.typePdf   :
                                            m.type === 'video' ? styles.typeVideo :
                                            styles.typeNote
                                        }>
                                            {m.type === 'pdf'   && ' PDF'}
                                            {m.type === 'video' && 'Video'}
                                            {m.type === 'note'  && ' Note'}
                                        </span>

                                        {/* Material Title */}
                                        <h3 style={styles.materialTitle}>
                                            {m.title}
                                        </h3>

                                        {/* Lecturer */}
                                        <p style={styles.materialLecturer}>
                                            By: {m.lecturer?.name || 'Unknown'}
                                        </p>

                                        {/* Action Buttons based on type */}
                                        <div style={styles.materialActions}>

                                            {/* PDF — Download button */}
                                            {m.type === 'pdf' && m.file_url && (
                                                
                                                   <a href={m.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={styles.downloadBtn}
                                                >
                                                     Download PDF
                                                </a>
                                            )}

                                            {/* Video — Watch button */}
                                            {m.type === 'video' && m.video_link && (
                                                
                                                    <a href={m.video_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={styles.watchBtn}
                                                >
                                                     Watch Video
                                                </a>
                                            )}

                                            {/* Note — Read button */}
                                            {m.type === 'note' && m.file_url && (
                                                <button
                                                    style={styles.readBtn}
                                                    onClick={() => viewNote(m)}
                                                >
                                                     Read Note
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ---------------------------------------- */}
                {/* TAB: NOTE VIEWER                         */}
                {/* ---------------------------------------- */}
                {activeTab === 'note' && selectedNote && (
                    <div style={styles.section}>

                        {/* Back Button */}
                        <button
                            style={styles.backBtn}
                            onClick={() => setActiveTab('materials')}
                        >
                            ← Back to Materials
                        </button>

                        {/* Note Content */}
                        <div style={styles.noteCard}>
                            <h2 style={styles.noteTitle}>{selectedNote.title}</h2>
                            <hr style={styles.noteDivider} />
                            <pre style={styles.noteContent}>
                                {selectedNote.content}
                            </pre>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

// -----------------------------------------------
// STYLES
// -----------------------------------------------
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
    },
    sidebar: {
        width: '240px',
        backgroundColor: '#1e293b',
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'fixed',
        height: '100vh',
    },
    sidebarHeader: {
        padding: '0 24px 24px',
    },
    sidebarContent: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 12px',
        scrollbarWidth: 'thin',
    },
    sidebarLogo: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#3b82f6',
        marginBottom: '4px',
    },
    sidebarRole: {
        fontSize: '15px',
        color: '#94aed3',
        padding: '0 24px',
        marginBottom: '28px',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '0 12px',
        flex: 1,
    },
    navItem: {
        backgroundColor: 'transparent',
        color: '#94a3b8',
        border: 'none',
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    navItemActive: {
        backgroundColor: '#1e3a5f',
        color: '#3b82f6',
        border: 'none',
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    courseLabel: {
        fontSize: '11px',
        backgroundColor: '#334155',
        color: '#94a3b8',
        padding: '2px 6px',
        borderRadius: '4px',
        marginLeft: 'auto',
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        color: '#ef4444',
        border: '1px solid #ef4444',
        margin: '12px',
        padding: '10px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
    },
    main: {
        marginLeft: '240px',
        flex: 1,
        padding: '32px',
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    pageTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#e2e8f0',
    },
    userInfo: {
        fontSize: '14px',
        color: '#94a3b8',
    },
    errorBox: {
        backgroundColor: '#450a0a',
        border: '1px solid #ef4444',
        color: '#fca5a5',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
    },
    loadingMsg: {
        color: '#64748b',
        fontSize: '14px',
        padding: '24px',
        textAlign: 'center',
    },
    section: {
        marginTop: '8px',
    },
    emptyMsg: {
        color: '#64748b',
        fontSize: '14px',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
    },

    // Course Grid
    courseGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px',
    },
    courseCard: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    courseCode: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#3b82f6',
        backgroundColor: '#1e3a5f',
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '6px',
    },
    courseName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#e2e8f0',
    },
    courseImage: {
        width: '100%',
        height: '160px',
        objectFit: 'cover',
        borderRadius: '10px',
        marginBottom: '14px',
        border: '1px solid #334155',
        backgroundColor: '#0f172a',
    },
    courseDesc: {
        fontSize: '13px',
        color: '#64748b',
        lineHeight: '1.5',
        flex: 1,
    },
    lecturerName: {
        fontSize: '12px',
        color: '#94a3b8',
    },
    viewBtn: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        marginTop: '8px',
    },
    sidebarCourseSection: {
        marginTop: '18px',
        padding: '12px 14px',
        backgroundColor: '#111827',
        border: '1px solid #334155',
        borderRadius: '12px',
    },
    sidebarSectionTitle: {
        fontSize: '11px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '10px',
    },
    sidebarCourseCard: {
        width: '100%',
        textAlign: 'left',
        backgroundColor: 'transparent',
        color: '#cbd5e1',
        border: '1px solid transparent',
        padding: '10px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s ease',
        marginBottom: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        minHeight: '66px',
    },
    sidebarCourseActive: {
        width: '100%',
        textAlign: 'left',
        backgroundColor: '#1e3a5f',
        color: '#f8fafc',
        border: '1px solid #2563eb',
        padding: '10px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '700',
        marginBottom: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
        minHeight: '66px',
    },
    sidebarCourseImg: {
        width: '46px',
        height: '46px',
        borderRadius: '10px',
        objectFit: 'cover',
        flexShrink: 0,
        border: '1px solid #334155',
        backgroundColor: '#0f172a',
    },
    sidebarCourseInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minWidth: 0,
        flex: 1,
        overflow: 'hidden',
    },
    sidebarCourseCode: {
        fontSize: '11px',
        color: '#93c5fd',
        backgroundColor: '#1e3a5f',
        padding: '4px 8px',
        borderRadius: '999px',
        marginBottom: '6px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    sidebarCourseName: {
        fontSize: '13px',
        color: '#e2e8f0',
        fontWeight: '700',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        whiteSpace: 'normal',
        lineHeight: '1.2',
    },

    // Materials Grid
    materialsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px',
        marginTop: '16px',
    },
    materialCard: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    materialTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#e2e8f0',
    },
    materialLecturer: {
        fontSize: '12px',
        color: '#64748b',
        flex: 1,
    },
    materialActions: {
        marginTop: '8px',
    },

    // Type badges
    typePdf: {
        backgroundColor: '#7f1d1d',
        color: '#fca5a5',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
    },
    typeVideo: {
        backgroundColor: '#1e3a5f',
        color: '#93c5fd',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
    },
    typeNote: {
        backgroundColor: '#14532d',
        color: '#86efac',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
    },

    // Action buttons
    downloadBtn: {
        display: 'inline-block',
        backgroundColor: '#7f1d1d',
        color: '#fca5a5',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        textDecoration: 'none',
        border: 'none',
    },
    watchBtn: {
        display: 'inline-block',
        backgroundColor: '#1e3a5f',
        color: '#93c5fd',
        padding: '8px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        textDecoration: 'none',
        border: 'none',
    },
    readBtn: {
        backgroundColor: '#14532d',
        color: '#86efac',
        border: 'none',
        padding: '8px 14px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
    },

    // Back button
    backBtn: {
        backgroundColor: '#334155',
        color: '#e2e8f0',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '20px',
    },

    // Note Viewer
    noteCard: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '32px',
    },
    noteTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#e2e8f0',
        marginBottom: '16px',
    },
    noteDivider: {
        border: 'none',
        borderTop: '1px solid #334155',
        marginBottom: '20px',
    },
    noteContent: {
        fontSize: '14px',
        color: '#cbd5e1',
        lineHeight: '1.8',
        whiteSpace: 'pre-wrap',   // keeps line breaks from the note
        fontFamily: 'inherit',
    },
    enrollBtn: {
    backgroundColor: '#15803d',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
},
enrolledBtn: {
    backgroundColor: '#334155',
    color: '#94a3b8',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontSize: '13px',
    fontWeight: '600',
},
};

export default StudentDashboard;