import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { MdBook, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLogout, MdPeopleAlt, MdLockClock, MdSaveAs, MdSafetyCheck, MdSignalWifiStatusbarConnectedNoInternet1, MdTextRotationAngledown, MdOutlineTextRotationAngledown, MdOutlineTextRotationAngleup, MdAdUnits, MdAddBusiness, MdPendingActions } from 'react-icons/md';
import { MdPictureAsPdf, MdNotes, MdVideoLibrary, MdLock, MdCheckCircle, 
    MdPhoneAndroid, MdCancel, MdSchool, MdMenuBook, MdPerson, MdCelebration, MdAdminPanelSettings, MdCastForEducation, 
    MdLaptop,
    MdOutlinePlaylistAddCheckCircle,
    MdMan3,
    MdOutlineMan2} from 'react-icons/md';
function AdminDashboard() {
    const navigate = useNavigate();
      const [activeTab, setActiveTab] = useState('pending');
const [showCourses, setShowCourses] = useState(false);
const [showCourseList, setShowCourseList] = useState(false);
    // Get logged in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));


const [selectedCourse, setSelectedCourse] = useState(null);
    // Data states
    const [pendingUsers, setPendingUsers] = useState([]);
    const [students,     setStudents]     = useState([]);
    const [lecturers,    setLecturers]    = useState([]);
    const [courses,      setCourses]      = useState([]);
    // Message states
    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState('');

    // Course form state
    const [courseForm, setCourseForm] = useState({
        course_name: '',
        course_code: '',
        description: '',
        image: null,
        lecturer_id: '',
    });

    // Edit course state
    const [editingCourse, setEditingCourse] = useState(null);

    // -----------------------------------------------
    // LOAD DATA WHEN PAGE LOADS
    // -----------------------------------------------
    useEffect(() => {
        fetchPendingUsers();
        fetchStudents();
        fetchLecturers();
        fetchCourses();
    }, []);

    // -----------------------------------------------
    // FETCH FUNCTIONS
    // -----------------------------------------------

    const fetchPendingUsers = async () => {
        try {
            const res = await api.get('/admin/pending-users');
            setPendingUsers(res.data);
        } catch (err) {
            setError('Failed to load pending users.');
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            setStudents(res.data);
        } catch (err) {
            setError('Failed to load students.');
        }
    };

    const fetchLecturers = async () => {
        try {
            const res = await api.get('/admin/lecturers');
            setLecturers(res.data);
        } catch (err) {
            setError('Failed to load lecturers.');
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await api.get('/admin/courses');
            setCourses(res.data);
        } catch (err) {
            setError('Failed to load courses.');
        }
    };

    // -----------------------------------------------
    // START EDIT - open edit form for a course
    // -----------------------------------------------
    const startEdit = (course) => {
        setEditingCourse({
            ...course,
            lecturer_id: course.lecturer_id || course.lecturer?.id || '',
        });
        // scroll to top so edit form is visible
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
    };

    const getCourseImageUrl = (imagePath) => {
        if (!imagePath || typeof imagePath !== 'string') return null;
        let normalized = imagePath;
        if (normalized.startsWith('/public/')) {
            normalized = normalized.replace(/^\/public/, '');
        }
        if (normalized.startsWith('public/')) {
            normalized = `/${normalized.slice(7)}`;
        }
        const backendHost = api.defaults.baseURL.replace(/\/api$/, '');
        if (normalized.startsWith('http')) return normalized;
        normalized = normalized.startsWith('/') ? normalized : `/${normalized}`;
        return `${backendHost}${normalized}`;
    };

    // -----------------------------------------------
    // APPROVE USER
    // -----------------------------------------------
    const approveUser = async (id) => {
        try {
            await api.put(`/admin/approve-user/${id}`);
            setSuccess('User approved successfully.');
            fetchPendingUsers();
            fetchStudents();
            fetchLecturers();
        } catch (err) {
            setError('Failed to approve user.');
        }
    };

    // -----------------------------------------------
    // REJECT USER
    // -----------------------------------------------
    const rejectUser = async (id) => {
        try {
            await api.put(`/admin/reject-user/${id}`);
            setSuccess('User rejected.');
            fetchPendingUsers();
        } catch (err) {
            setError('Failed to reject user.');
        }
    };

    // -----------------------------------------------
    // HANDLE COURSE FORM CHANGE
    // -----------------------------------------------
    const handleCourseChange = (e) => {
        if (e.target.type === 'file') {
            setCourseForm({
                ...courseForm,
                [e.target.name]: e.target.files[0] || null,
            });
            return;
        }

        setCourseForm({
            ...courseForm,
            [e.target.name]: e.target.value,
        });
    };

    // -----------------------------------------------
    // ADD COURSE
    // -----------------------------------------------
    const addCourse = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('course_name', courseForm.course_name);
            formData.append('course_code', courseForm.course_code);
            formData.append('description', courseForm.description);
            formData.append('lecturer_id', courseForm.lecturer_id);
            if (courseForm.image) {
                formData.append('image', courseForm.image);
            }

            // DEBUG: log FormData contents
            for (let pair of formData.entries()) console.log('addCourse formData', pair[0], pair[1]);
            await api.post('/admin/courses', formData);
            setSuccess('Course added successfully.');
            setCourseForm({
                course_name: '',
                course_code: '',
                description: '',
                image: null,
                lecturer_id: '',
            });
            fetchCourses();

        } catch (err) {
            console.error('addCourse error', err.response || err);
            if (err.response && err.response.data) {
                if (err.response.data.errors) {
                    const firstError = Object.values(err.response.data.errors)[0][0];
                    setError(firstError);
                } else if (err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError(JSON.stringify(err.response.data));
                }
            } else {
                setError('Failed to add course.');
            }
        }
    };

    // -----------------------------------------------
    // HANDLE EDIT FORM CHANGE
    // -----------------------------------------------
    const handleEditChange = (e) => {
        if (e.target.type === 'file') {
            setEditingCourse({
                ...editingCourse,
                [e.target.name]: e.target.files[0] || null,
            });
            return;
        }

        setEditingCourse({
            ...editingCourse,
            [e.target.name]: e.target.value,
        });
    };

    // -----------------------------------------------
    // SAVE EDITED COURSE
    // -----------------------------------------------
    const saveEdit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const formData = new FormData();
            formData.append('course_name', editingCourse.course_name);
            formData.append('course_code', editingCourse.course_code);
            formData.append('description', editingCourse.description);
            formData.append('lecturer_id', editingCourse.lecturer_id);
            if (editingCourse.image && editingCourse.image instanceof File) {
                formData.append('image', editingCourse.image);
            }

            // DEBUG: log FormData contents
            for (let pair of formData.entries()) console.log('saveEdit formData', pair[0], pair[1]);
            await api.put(`/admin/courses/${editingCourse.id}`, formData);
            setSuccess('Course updated successfully.');
            setEditingCourse(null);
            fetchCourses();
        } catch (err) {
            console.error('saveEdit error', err.response || err);
            if (err.response && err.response.data) {
                if (err.response.data.errors) {
                    const firstError = Object.values(err.response.data.errors)[0][0];
                    setError(firstError);
                } else if (err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError(JSON.stringify(err.response.data));
                }
            } else {
                setError('Failed to update course.');
            }
        }
    };

    // -----------------------------------------------
    // DELETE COURSE
    // -----------------------------------------------
    const deleteCourse = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;

        try {
            await api.delete(`/admin/courses/${id}`);
            setSuccess('Course deleted successfully.');
            fetchCourses();
        } catch (err) {
            setError('Failed to delete course.');
        }
    };

    // -----------------------------------------------
    // LOGOUT
    // -----------------------------------------------
    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (err) {
            // Even if logout fails, clear local storage
        }
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={styles.container}>

            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>LearnFlow<MdSchool size={33} color="#ffffff"/></div>
                <div style={styles.sidebarRole}><b><MdAddBusiness size={23} color="#0eb7ff"/>Admin Panel</b></div>

                {/* Sidebar Menu */}
                <nav style={styles.nav}>
                    <button
                        style={activeTab === 'pending' ? styles.navItemActive : styles.navItem}
                        onClick={() => setActiveTab('pending')}
                    >
                        <MdLockClock size={15} color="#00e1ff"/>Pending Users
                        {pendingUsers.length > 0 && (
                            <span style={styles.badge}>{pendingUsers.length}</span>
                        )}
                    </button>
                    <button
                        style={activeTab === 'students' ? styles.navItemActive : styles.navItem}
                        onClick={() => setActiveTab('students')}
                    >
                        <MdPeopleAlt size={15} color="#ffffff"/> Students
                    </button>
                    <button
                        style={activeTab === 'lecturers' ? styles.navItemActive : styles.navItem}
                        onClick={() => setActiveTab('lecturers')}
                    >
                        <MdPerson size={15} color="#e74c3c"/>Lecturers
                    </button>
                      <button
    style={activeTab === 'courses' ? styles.navItemActive : styles.navItem}
    onClick={() => {
        setActiveTab('courses');
        setShowCourseList(!showCourseList);
    }}
>
    <MdBook size={16} /> Courses {showCourseList ? <MdKeyboardArrowUp size={16} /> : <MdKeyboardArrowDown size={16} />}
</button>



    {showCourseList && (
        <div style={styles.courseList}>
            {courses.map((course) => {
                const imageUrl = getCourseImageUrl(course.image);
                return (
                    <div key={course.id} style={styles.courseItem}
                        onClick={() => setSelectedCourse(course)}
                        onMouseEnter={e => e.currentTarget.style.background = '#1e3a5f'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        {imageUrl && (
                            <img src={imageUrl} alt={course.course_name || 'Course'} style={styles.courseItemThumbnail} />
                        )}
                        <div style={styles.courseItemText}>
                            <span style={styles.courseCodeBadge}>{course.course_code}</span>
                            <span style={styles.courseItemName}>{course.course_name}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    )}
                </nav>

                {/* Logout Button */}
                <button style={styles.logoutBtn} onClick={logout}>
                     <MdLogout size={15} color="#e74c3c" />Logout
                </button>
            </div>

            {/* Main Content */}
            <div style={styles.main}>
                {selectedCourse && (
    <div style={styles.modalOverlay} onClick={() => setSelectedCourse(null)}>
        <div style={styles.modalBox} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={styles.modalHeader}>
                <div>
                    <span style={styles.modalCode}>{selectedCourse.course_code}</span>
                    <h2 style={styles.modalTitle}>{selectedCourse.course_name}</h2>
                </div>
                <button style={styles.modalClose} onClick={() => setSelectedCourse(null)}>✕</button>
            </div>

            {/* Description */}
            {selectedCourse.description && (
                <p style={styles.modalDesc}>{selectedCourse.description}</p>
            )}

            {/* Lecturer Info */}
            <div style={styles.modalSection}>
                <div style={styles.modalSectionTitle}> <MdPerson size={15} color="#e74c3c"/>Lecturer</div>
                {selectedCourse.lecturer ? (
                    <div style={styles.modalInfoCard}>
                        <div style={styles.modalAvatar}>
                            {selectedCourse.lecturer.name[0].toUpperCase()}
                        </div>
                        <div>
                            <div style={styles.modalName}>{selectedCourse.lecturer.name}</div>
                            <div style={styles.modalSub}>ID: {selectedCourse.lecturer.id}</div>
                            <div style={styles.modalSub}>{selectedCourse.lecturer.email}</div>
                        </div>
                    </div>
                ) : (
                    <div style={styles.modalEmpty}>No lecturer assigned</div>
                )}
            </div>

            {/* Students */}
            <div style={styles.modalSection}>
                <div style={styles.modalSectionTitle}>
                    👩‍🎓 Enrolled Students
                    <span style={styles.modalCount}>
                        {students.length}
                    </span>
                </div>
                {students.length === 0 ? (
                    <div style={styles.modalEmpty}>No students enrolled</div>
                ) : (
                    <div style={styles.modalStudentList}>
                        {students.slice(0, 5).map(s => (
                            <div key={s.id} style={styles.modalStudentItem}>
                                <div style={styles.modalStudentAvatar}>
                                    {s.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <div style={styles.modalName}>{s.name}</div>
                                    <div style={styles.modalSub}>ID: {s.id} · {s.email}</div>
                                </div>
                            </div>
                        ))}
                        {students.length > 5 && (
                            <div style={styles.modalMore}>+{students.length - 5} more students</div>
                        )}
                    </div>
                )}
            </div>

        </div>
    </div>
)}

                {/* Top Bar */}
                <div style={styles.topBar}>
                    <h1 style={styles.pageTitle}>
                        {activeTab === 'pending'   && 'Pending Approvals'}
                        {activeTab === 'students'  && 'All Students'}
                        {activeTab === 'lecturers' && 'All Lecturers'}
                        {activeTab === 'courses'   && 'Manage Courses'}
                    </h1>
                    <div style={styles.userInfo}>
                        Welcome, <strong>{user?.name}</strong>
                    </div>
                </div>

                {/* Messages */}
                {error   && <div style={styles.errorBox}>{error}</div>}
                {success && <div style={styles.successBox}>{success}</div>}

                {/* ---------------------------------------- */}
                {/* TAB: PENDING USERS                       */}
                {/* ---------------------------------------- */}
                {activeTab === 'pending' && (
                    <div style={styles.section}>
                        {pendingUsers.length === 0 ? (
                            <div style={styles.emptyMsg}> No pending users at the moment.</div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingUsers.map((u) => (
                                        <tr key={u.id}>
                                            <td>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span style={
                                                    u.role === 'lecturer'
                                                    ? styles.roleBadgeLecturer
                                                    : styles.roleBadgeStudent
                                                }>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    style={styles.approveBtn}
                                                    onClick={() => approveUser(u.id)}
                                                >
                                                    <MdCheckCircle size={18} color="#07de00"/> Approve
                                                </button>
                                                <button
                                                    style={styles.rejectBtn}
                                                    onClick={() => rejectUser(u.id)}
                                                >
                                                    <MdCancel size={18} color="#ff6e6e"/> Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ---------------------------------------- */}
                {/* TAB: STUDENTS                            */}
                {/* ---------------------------------------- */}
                {activeTab === 'students' && (
                    <div style={styles.section}>
                        {students.length === 0 ? (
                            <div style={styles.emptyMsg}>No approved students yet.</div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => (
                                        <tr key={s.id}>
                                            <td>{s.id}</td>
                                            <td>{s.name}</td>
                                            <td>{s.email}</td>
                                            <td>
                                                <span style={styles.statusApproved}>
                                                    {s.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ---------------------------------------- */}
                {/* TAB: LECTURERS                           */}
                {/* ---------------------------------------- */}
                {activeTab === 'lecturers' && (
                    <div style={styles.section}>
                        {lecturers.length === 0 ? (
                            <div style={styles.emptyMsg}>No approved lecturers yet.</div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lecturers.map((l) => (
                                        <tr key={l.id}>
                                            <td>{l.id}</td>
                                            <td>{l.name}</td>
                                            <td>{l.email}</td>
                                            <td>
                                                <span style={styles.statusApproved}>
                                                    {l.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* ---------------------------------------- */}
                {/* TAB: COURSES                             */}
                {/* ---------------------------------------- */}
                {activeTab === 'courses' && (
                    <div style={styles.section}>

                        {/* Edit Course Form */}
                        {editingCourse && (
                            <div style={styles.formCard}>
                                <h3 style={styles.formTitle}> Edit Course</h3>
                                <form onSubmit={saveEdit}>
                                    <label style={styles.label}>Course Name</label>
                                    <input
                                        type="text"
                                        name="course_name"
                                        value={editingCourse.course_name}
                                        onChange={handleEditChange}
                                        style={styles.input}
                                        required
                                    />
                                    <label style={styles.label}>Course Code</label>
                                    <input
                                        type="text"
                                        name="course_code"
                                        value={editingCourse.course_code}
                                        onChange={handleEditChange}
                                        style={styles.input}
                                        required
                                    />
                                    <label style={styles.label}>Description</label>
                                    <textarea
                                        name="description"
                                        value={editingCourse.description || ''}
                                        onChange={handleEditChange}
                                        style={styles.input}
                                        rows="3"
                                    />
                                    <label style={styles.label}>Assign Lecturer</label>
                                    <select
                                        name="lecturer_id"
                                        value={editingCourse.lecturer_id || ''}
                                        onChange={handleEditChange}
                                        style={styles.input}
                                    >
                                        <option value="">-- No Lecturer --</option>
                                        {lecturers.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label style={styles.label}>Course Image</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="images/*"
                                        onChange={handleEditChange}
                                        style={styles.input}
                                    />
                                    <div style={styles.formButtons}>
                                        <button type="submit" style={styles.saveBtn}>
                                            <MdSaveAs/> Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            style={styles.cancelBtn}
                                            onClick={() => setEditingCourse(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Add Course Form */}
                        <div style={styles.formCard}>
                            <h3 style={styles.formTitle}> Add New Course</h3>
                            <form onSubmit={addCourse}>
                                <label style={styles.label}>Course Name</label>
                                <input
                                    type="text"
                                    name="course_name"
                                    placeholder="e.g. Web Development"
                                    value={courseForm.course_name}
                                    onChange={handleCourseChange}
                                    style={styles.input}
                                    required
                                />
                                <label style={styles.label}>Course Code</label>
                                <input
                                    type="text"
                                    name="course_code"
                                    placeholder="e.g. IT101"
                                    value={courseForm.course_code}
                                    onChange={handleCourseChange}
                                    style={styles.input}
                                    required
                                />
                                <label style={styles.label}>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Course description..."
                                    value={courseForm.description}
                                    onChange={handleCourseChange}
                                    style={styles.input}
                                    rows="3"
                                />
                                <label style={styles.label}>Assign Lecturer</label>
                                <select
                                    name="lecturer_id"
                                    value={courseForm.lecturer_id}
                                    onChange={handleCourseChange}
                                    style={styles.input}
                                >
                                    <option value="">-- No Lecturer --</option>
                                    {lecturers.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.name}
                                        </option>
                                    ))}
                                </select>
                                <label style={styles.label}>Course Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleCourseChange}
                                    style={styles.input}
                                />
                                <button type="submit" style={styles.addBtn}>
                                     Add Course
                                </button>
                            </form>
                        </div>

                        {/* Courses Table */}
                        {courses.length === 0 ? (
                            <div style={styles.emptyMsg}>No courses added yet.</div>
                        ) : (
                            <div style={styles.coursesTableWrapper}>
                                <table style={styles.coursesTable}>
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Image</th>
                                            <th>Course Name</th>
                                            <th>Description</th>
                                            <th>Lecturer</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((c) => (
                                            <tr key={c.id}>
                                                <td>{c.course_code}</td>
                                                <td>
                                                    {c.image ? (
                                                        <img src={getCourseImageUrl(c.image)} alt={c.course_name || 'Course'} style={styles.courseThumbSmall} />
                                                    ) : '—'}
                                                </td>
                                                <td>{c.course_name}</td>
                                                <td>{c.description || '—'}</td>
                                                <td>{c.lecturer?.name || '—'}</td>
                                                <td>
                                                    <button
                                                        style={styles.editBtn}
                                                        onClick={() => startEdit(c)}
                                                    >
                                                        <MdPendingActions/> Edit
                                                    </button>
                                                    <button
                                                        style={styles.rejectBtn}
                                                        onClick={() => deleteCourse(c.id)}
                                                    >
                                                         Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
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

    // Sidebar
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
    sidebarLogo: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#3b82f6',
        padding: '0 24px',
        marginBottom: '4px',
    },
    sidebarRole: {
        fontSize: '12px',
        color: '#64748b',
        padding: '0 24px',
        marginBottom: '32px',
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
    badge: {
        backgroundColor: '#ef4444',
        color: 'white',
        borderRadius: '10px',
        padding: '1px 7px',
        fontSize: '11px',
        fontWeight: '700',
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

    // Main content
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

    // Messages
    errorBox: {
        backgroundColor: '#450a0a',
        border: '1px solid #ef4444',
        color: '#fca5a5',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
    },
    successBox: {
        backgroundColor: '#052e16',
        border: '1px solid #22c55e',
        color: '#86efac',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
    },

    // Section
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

    // Role badges
    roleBadgeLecturer: {
        backgroundColor: '#1e3a5f',
        color: '#93c5fd',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    roleBadgeStudent: {
        backgroundColor: '#14532d',
        color: '#86efac',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    statusApproved: {
        backgroundColor: '#14532d',
        color: '#86efac',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },

    // Buttons
    approveBtn: {
        backgroundColor: '#15803d',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        marginRight: '6px',
    },
    rejectBtn: {
        backgroundColor: '#991b1b',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
    },
    editBtn: {
        backgroundColor: '#1d4ed8',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
        marginRight: '6px',
    },
    addBtn: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        marginTop: '4px',
    },
    saveBtn: {
        backgroundColor: '#15803d',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        marginRight: '8px',
    },
    cancelBtn: {
        backgroundColor: '#334155',
        color: '#e2e8f0',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
    },
    formButtons: {
        display: 'flex',
        gap: '8px',
        marginTop: '8px',
    },

    // Form card
    formCard: {
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
    },
    formTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#e2e8f0',
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
        marginBottom: '12px',
    },
    courseList: {
        marginLeft: '20px',
        marginTop: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
        border: '1px solid #334155',
        borderRadius: '10px',
        backgroundColor: '#0f172a',
        maxHeight: '380px',
        overflowY: 'auto',
    },
    coursesTableWrapper: {
        maxHeight: '560px',
        overflowY: 'auto',
        overflowX: 'auto',
        border: '1px solid #334155',
        borderRadius: '12px',
        backgroundColor: '#0f172a',
        padding: '12px',
    },
    coursesTable: {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '860px',
    },

    noCourseItem: {
        color: '#475569',
        fontSize: '12px',
        padding: '6px 12px',
        fontStyle: 'italic',
    },
    courseItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background 0.15s',
        backgroundColor: '#1e293b',
    },
    courseItemThumbnail: {
        width: '50px',
        height: '50px',
        borderRadius: '10px',
        objectFit: 'cover',
        flexShrink: 0,
        backgroundColor: '#111827',
        border: '1px solid #334155',
    },
    courseItemThumbnailPlaceholder: {
        width: '50px',
        height: '50px',
        borderRadius: '10px',
        backgroundColor: '#111827',
        border: '1px solid #334155',
        flexShrink: 0,
    },
    courseItemText: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    courseLecturerLabel: {
        color: '#94a3b8',
        fontSize: '11px',
        marginTop: '4px',
    },
    courseCodeBadge: {
        backgroundColor: '#1e3a5f',
        color: '#60a5fa',
        fontSize: '10px',
        fontWeight: '700',
        padding: '2px 6px',
        borderRadius: '4px',
        flexShrink: 0,
        marginBottom: '4px',
        display: 'inline-block',
    },
    courseItemName: {
        color: '#cbd5e1',
        fontSize: '13px',
        fontWeight: '600',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    courseThumbSmall: {
        width: '60px',
        height: '40px',
        objectFit: 'cover',
        borderRadius: '8px',
        border: '1px solid #334155',
    },
modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
},
modalBox: {background: '#1e293b',
border: '1px solid #334155',borderRadius: 16,padding: 28, width: 480,maxHeight: '80vh', overflowY: 'auto',boxShadow: '0 25px 60px rgba(0,0,0,0.5)',},
modalHeader: { display: 'flex', justifyContent: 'space-between',alignItems: 'flex-start',marginBottom: 16,},
modalCode: {background: '#1e3a5f',color: '#60a5fa',fontSize: 11,fontWeight: 700,padding: '2px 8px',borderRadius: 4,display: 'inline-block',marginBottom: 6,},
modalTitle: {fontSize: 18,fontWeight: 700,color: '#e2e8f0',margin: 0,},
modalClose: { background: '#334155',border: 'none',color: '#94a3b8',width: 28, height: 28, borderRadius: '50%',cursor: 'pointer',fontSize: 13,fontWeight: 700,},
modalDesc: {fontSize: 13,color: '#64748b',lineHeight: 1.6,marginBottom: 20,padding: '10px 14px',background: '#0f172a', borderRadius: 8,},
modalSection: { marginBottom: 20,},
modalSectionTitle: {fontSize: 13,fontWeight: 700,color: '#94a3b8', marginBottom: 10,display: 'flex',alignItems: 'center',gap: 8,},
modalCount: {background: '#2563eb',color: '#fff',fontSize: 11,fontWeight: 700,padding: '1px 7px',borderRadius: 10,},
modalInfoCard: { display: 'flex', alignItems: 'center', gap: 12, background: '#0f172a', border: '1px solid #334155', borderRadius: 10,padding: '12px 14px',},
modalAvatar: { width: 38, height: 38, background: '#1e3a5f', color: '#60a5fa',borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,fontSize: 16,flexShrink: 0,},
modalStudentAvatar: {width: 34,height: 34,background: '#14532d',color: '#86efac',borderRadius: '50%',display: 'flex',alignItems: 'center',justifyContent: 'center',fontWeight: 700,fontSize: 14,flexShrink: 0,},
    modalName: {fontSize: 13,fontWeight: 600,color: '#e2e8f0',},
    modalSub: {fontSize: 11,color: '#64748b',marginTop: 2,},
    modalEmpty: { fontSize: 13,color: '#475569',padding: '12px 14px',background: '#0f172a',
    borderRadius: 8,textAlign: 'center',},modalStudentList: {
    display: 'flex',flexDirection: 'column', gap: 8,},
    modalStudentItem: {display: 'flex', alignItems: 'center',gap: 10, background: '#0f172a',border: '1px solid #334155',borderRadius: 8,padding: '10px 12px',},
    modalMore: {fontSize: 12,color: '#64748b',textAlign: 'center',padding: '8px',
},
};

export default AdminDashboard;