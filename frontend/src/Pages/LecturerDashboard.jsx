import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import defaultCourseImg from './images/img1.avif';
import { MdBook, MdPerson, MdSchool, MdKeyboardArrowUp, MdKeyboardArrowDown, MdLogout, MdPeopleAlt, MdLockClock, MdSaveAs, MdArrowBack } from 'react-icons/md';


function LecturerDashboard() {
    const navigate = useNavigate();

    // Get logged in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Active tab state
    const [activeTab, setActiveTab] = useState('courses');

    // Data states
    const [courses,         setCourses]         = useState([]);
    const [materials,       setMaterials]       = useState([]);
    const [selectedCourse,  setSelectedCourse]  = useState(null);

    // Message states
    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState('');

    // Material form state
    const [materialForm, setMaterialForm] = useState({
        title:      '',
        type:       'note',
        course_id:  '',
        video_link: '',
        note_text:  '',
         message:    '',
    });

    // File state for PDF upload
    const [selectedFile, setSelectedFile] = useState(null);

    // Edit material state
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [editingFile, setEditingFile] = useState(null);

    // -----------------------------------------------
    // LOAD COURSES WHEN PAGE LOADS
    // -----------------------------------------------
    useEffect(() => {
        fetchMyCourses();
    }, []);

    // -----------------------------------------------
    // FETCH MY COURSES
    // -----------------------------------------------
    const fetchMyCourses = async () => {
        try {
            const res = await api.get('/lecturer/courses');
            setCourses(res.data);
        } catch (err) {
            setError('Failed to load courses.');
        }
    };

    // -----------------------------------------------
    // FETCH MATERIALS FOR A COURSE
    // -----------------------------------------------
    const fetchMaterials = async (courseId) => {
        try {
            const res = await api.get(`/lecturer/courses/${courseId}/materials`);
            setMaterials(res.data);
        } catch (err) {
            setError('Failed to load materials.');
        }
    };

    // -----------------------------------------------
    // SELECT A COURSE TO VIEW MATERIALS
    // -----------------------------------------------
    const selectCourse = (course) => {
        setSelectedCourse(course);
        setActiveTab('materials');
        fetchMaterials(course.id);

        // Set course_id in material form
        setMaterialForm({
            ...materialForm,
            course_id: course.id,
        });
    };

    // -----------------------------------------------
    // HANDLE MATERIAL FORM CHANGE
    // -----------------------------------------------
    const handleMaterialChange = (e) => {
        setMaterialForm({
            ...materialForm,
            [e.target.name]: e.target.value,
        });
    };

    // -----------------------------------------------
    // HANDLE FILE SELECTION
    // -----------------------------------------------
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // -----------------------------------------------
    // UPLOAD MATERIAL
    // Uses FormData because we are sending a file
    // -----------------------------------------------
    const uploadMaterial = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Use FormData to send files
            const formData = new FormData();
            formData.append('title',     materialForm.title);
            formData.append('type',      materialForm.type);
            formData.append('course_id', materialForm.course_id);

            // Add file if PDF or doc type
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            // Add video link if video type
            if (materialForm.type === 'video') {
                formData.append('video_link', materialForm.video_link);
            }

            // Add note text if note type
            if (materialForm.type === 'note') {
                formData.append('note_text', materialForm.note_text);
            }

            // Send as FormData (axios will set Content-Type boundary)
            await api.post('/lecturer/materials', formData);

            setSuccess('Material uploaded successfully.');

            // Reset form
            setMaterialForm({
                title:      '',
                type:       'note',
                course_id:  selectedCourse.id,
                video_link: '',
                note_text:  '',
            });
            setSelectedFile(null);

            // Reload materials
            fetchMaterials(selectedCourse.id);

        } catch (err) {
            if (err.response && err.response.data.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else if (err.response && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to upload material.');
            }
        }
    };
    const [courseStudents, setCourseStudents] = useState([]);
const [showStudents, setShowStudents] = useState(false);
const [studentsLoading, setStudentsLoading] = useState(false);

const viewStudents = async (courseId) => {
    setStudentsLoading(true);
    setShowStudents(true);
    try {
        const res = await api.get(`/lecturer/courses/${courseId}/students`);
        setCourseStudents(res.data);
    } catch (err) {
        console.log(err);
    }
    setStudentsLoading(false);
};
    // -----------------------------------------------
    // START EDITING A MATERIAL
    // -----------------------------------------------
    const startEditMaterial = (material) => {
        setEditingMaterial({ ...material });
        setEditingFile(null);
    };

    // -----------------------------------------------
    // HANDLE EDIT FORM CHANGE
    // -----------------------------------------------
    const handleEditChange = (e) => {
        setEditingMaterial({
            ...editingMaterial,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditFileChange = (e) => {
        setEditingFile(e.target.files[0] || null);
    };

    // -----------------------------------------------
    // SAVE EDITED MATERIAL
    // -----------------------------------------------
    const saveEditMaterial = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // If a file was selected (or type is pdf and user may want to upload), send FormData
            if (editingFile) {
                const formData = new FormData();
                formData.append('title', editingMaterial.title);
                formData.append('type', editingMaterial.type);
                formData.append('video_link', editingMaterial.video_link || '');
                formData.append('note_text', editingMaterial.note_text || '');
                formData.append('file', editingFile);
                // debug log
                for (let pair of formData.entries()) console.log('saveEditMaterial formData', pair[0], pair[1]);
                await api.post(`/lecturer/materials/${editingMaterial.id}`, formData, { headers: { 'X-HTTP-Method-Override': 'PUT' } });
            } else {
                await api.put(`/lecturer/materials/${editingMaterial.id}`, {
                    title:      editingMaterial.title,
                    type:       editingMaterial.type,
                    video_link: editingMaterial.video_link,
                    note_text:  editingMaterial.note_text || null,
                });
            }

            setSuccess('Material updated successfully.');
            setEditingMaterial(null);
            fetchMaterials(selectedCourse.id);

        } catch (err) {
            setError('Failed to update material.');
        }
    };

    // -----------------------------------------------
    // DELETE MATERIAL
    // -----------------------------------------------
    const deleteMaterial = async (id) => {
        if (!window.confirm('Are you sure you want to delete this material?')) return;

        try {
            await api.delete(`/lecturer/materials/${id}`);
            setSuccess('Material deleted.');
            fetchMaterials(selectedCourse.id);
        } catch (err) {
            setError('Failed to delete material.');
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
    const [hover, setHover] = useState(false);
    const [viewingMaterial, setViewingMaterial] = useState(null);
    const [modalContent, setModalContent] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    const getMaterialUrl = (filePath) => {
        if (!filePath) return null;
        const backendHost = api.defaults.baseURL.replace(/\/api$/, '');
        const normalized = filePath.startsWith('/') ? filePath : `/${filePath}`;
        // public storage is served at /storage/{path}
        return `${backendHost}/storage${normalized}`;
    };

    const openOrPreviewMaterial = async (m) => {
        if (m.video_link) {
            window.open(m.video_link, '_blank');
            return;
        }
        if (m.file_path) {
            const url = getMaterialUrl(m.file_path);
            if (m.type === 'note') {
                setModalLoading(true);
                try {
                    const res = await api.get(`/lecturer/materials/${m.id}/preview`);
                    setModalContent(res.data.content || 'No note content available.');
                    setViewingMaterial(m);
                } catch (err) {
                    setModalContent('Unable to load note content.');
                    setViewingMaterial(m);
                } finally {
                    setModalLoading(false);
                }
            } else {
                window.open(url, '_blank');
            }
            return;
        }
        alert('No file or link available for this material.');
    };



    return (
        <div style={styles.container}>

            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarLogo}>LearnFlow<MdSchool size={33} color="#ffffff"/></div>
                <div style={styles.sidebarRole}><MdPerson size={15} color="#e74c3c"/><b>Lecturer Panel</b></div>

                <nav style={styles.nav}>
                    <button
                        style={activeTab === 'courses' ? styles.navItemActive : styles.navItem}
                        onClick={() => setActiveTab('courses')}
                    >
                         My Courses
                    </button>

                    {/* Show Materials tab only if a course is selected */}
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

                    {/* Show course list while inside materials */}
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
                                    : defaultCourseImg;
                                return (
                                    <button
                                        key={course.id}
                                        style={course.id === selectedCourse?.id ? styles.sidebarCourseActive : styles.sidebarCourseCard}
                                        onClick={() => selectCourse(course)}
                                    >
    
                                        <img
                                            src={courseImage}
                                            alt={course.course_name || 'Course'}
                                            style={styles.sidebarCourseImg}
                                            onError={(e) => { e.target.onerror = null; e.target.src = defaultCourseImg; }}
                                        />
                                        <div style={styles.sidebarCourseInfo}>
                                            <div style={styles.sidebarCourseCode}>{course.course_code}</div>
                                            <div style={styles.sidebarCourseName}>{course.course_name}</div>
                                        <button
                                            style={styles.studentsBtn}
                                            onClick={() => viewStudents(course.id)}
>
                                             View Students
                                        </button>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </nav>

                <button style={styles.logoutBtn} onClick={logout}>
                    <MdLogout size={15} color="#e74c3c" /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div style={styles.main}>

                {/* Top Bar */}
                <div style={styles.topBar}>
                    <h1 style={styles.pageTitle}>
                        {activeTab === 'courses'   && ' My Courses'}
                        {activeTab === 'materials' && ` Materials — ${selectedCourse?.course_name}`}
                    </h1>
                    <div style={styles.userInfo}>
                        Welcome, <strong>{user?.name}</strong>
                    </div>
                </div>

                {/* Messages */}
                {error   && <div style={styles.errorBox}>{error}</div>}
                {success && <div style={styles.successBox}>{success}</div>}

                {/* ---------------------------------------- */}
                {/* TAB: MY COURSES                          */}
                {/* ---------------------------------------- */}
                {activeTab === 'courses' && (
                    <div style={styles.section}>
                        {courses.length === 0 ? (
                            <div style={styles.emptyMsg}>
                                No courses assigned to you yet. Contact Admin.
                            </div>
                        ) : (
                            <div style={styles.courseGrid}>
                                {courses.map((course) => (
                                    <div key={course.id} style={styles.courseCard}>
                                        
                                        <div style={styles.courseCode}>
                                            {course.course_code}
                                        </div>

                                        {(() => {
                                            const imageSrc = course?.image
                                                ? (typeof course.image === 'string' && course.image.startsWith('http')
                                                    ? course.image
                                                    : course.image.startsWith('/')
                                                        ? course.image
                                                        : `/${course.image}`)
                                                : defaultCourseImg;
                                            return (
                                                <img
                                                    src={imageSrc}
                                                    alt={course.course_name || 'Course image'}
                                                    style={styles.courseImage}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = defaultCourseImg; }}
                                                />
                                            );
                                        })()}
                                        <h3 style={styles.courseName}>
                                            {course.course_name}
                                        </h3>
                                        
                                        <p style={styles.courseDesc}>
                                            {course.description || 'No description.'}
                                        </p>
                                        
                                        <button
                                            style={styles.viewBtn}
                                            onClick={() => selectCourse(course)}
                                        >
                                             Manage Materials
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ---------------------------------------- */}
                {/* TAB: MATERIALS                           */}
                {/* ---------------------------------------- */}
                {activeTab === 'materials' && selectedCourse && (
                    <div style={styles.section}>
                        <button
                            style={styles.backBtn}
                            onClick={() => {
                                setActiveTab('courses');
                                setSelectedCourse(null);
                                setMaterials([]);
                                setEditingMaterial(null);
                            }}
                        >
                            <MdArrowBack size={18} style={{ marginRight: '8px' }} />
                            Back to Courses
                        </button>

                        {/* Edit Material Form */}
                        {editingMaterial && (
                            <div style={styles.formCard}>
                                <h3 style={styles.formTitle}> Edit Material</h3>
                                <form onSubmit={saveEditMaterial}>
                                    <label style={styles.label}>Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editingMaterial.title}
                                        onChange={handleEditChange}
                                        style={styles.input}
                                        required
                                    />
                                   
                                    <label style={styles.label}>Type</label>
                                    <select
                                        name="type"
                                        value={editingMaterial.type}
                                        onChange={handleEditChange}
                                        style={styles.input}
                                    >
                                        <option value="note">Note</option>
                                        <option value="pdf">PDF</option>
                                        <option value="video">Video</option>
                                    </select>

                                    {/* Show video link if type is video */}
                                    {editingMaterial.type === 'video' && (
                                        <>
                                            <label style={styles.label}>Video /External Link</label>
                                            <input
                                                type="url"
                                                name="video_link"
                                                value={editingMaterial.video_link || ''}
                                                onChange={handleEditChange}
                                                style={styles.input}
                                                placeholder="https://youtube.com/...  or  https://zoom.us/j/123456789  or  https://quiz.example.com/..."
     
                                            />
                                        </>
                                    )}

                                    {/* Show note textarea or file upload when type is note */}
                                    {editingMaterial.type === 'note' && (
                                        <>
                                            <label style={styles.label}>Note Content</label>
                                            <textarea
                                                name="note_text"
                                                placeholder="Write your note here..."
                                                value={editingMaterial.note_text || ''}
                                                onChange={handleEditChange}
                                                style={styles.input}
                                                rows="5"
                                            />
                                            <label style={styles.label}>Or Replace Note File (.txt)</label>
                                            <input
                                                type="file"
                                                accept=".txt"
                                                onChange={handleEditFileChange}
                                                style={styles.input}
                                            />
                                        </>
                                    )}

                                    {/* Show file upload if type is pdf when editing */}
                                    {editingMaterial.type === 'pdf' && (
                                        <>
                                            <label style={styles.label}>Replace File (PDF/DOC)</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.txt"
                                                onChange={handleEditFileChange}
                                                style={styles.input}
                                            />
                                        </>
                                    )}

                                    <div style={styles.formButtons}>
                                        <button type="submit" style={styles.saveBtn}>
                                            <MdSaveAs size={20} />Save
                                        </button>
                                        <button
                                            type="button"
                                            style={styles.cancelBtn}
                                            onClick={() => setEditingMaterial(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Upload Material Form */}
                        <div style={styles.formCard}>
                            <h3 style={styles.formTitle}><MdBook size={15} />Upload New Material</h3>
                            <form onSubmit={uploadMaterial}>

                                <label style={styles.label}>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="e.g. Chapter 1 Notes"
                                    value={materialForm.title}
                                    onChange={handleMaterialChange}
                                    style={styles.input}
                                    required
                                />

                                <label style={styles.label}>Type</label>
                                <select
                                    name="type"
                                    value={materialForm.type}
                                    onChange={handleMaterialChange}
                                    style={styles.input}
                                >
                                    <option value="note">Note (Text)</option>
                                    <option value="pdf">PDF / Document</option>
                                    <option value="video">Video Link</option>
                                </select>

                                {/* Show note text area if type is note */}
                                {materialForm.type === 'note' && (
                                    <>
                                        <label style={styles.label}>Note Content</label>
                                        <textarea
                                            name="note_text"
                                            placeholder="Write your note here..."
                                            value={materialForm.note_text}
                                            onChange={handleMaterialChange}
                                            style={styles.input}
                                            rows="5"
                                        />
                                    </>
                                )}

                                {/* Show file upload if type is pdf */}
                                {materialForm.type === 'pdf' && (
                                    <>
                                        <label style={styles.label}>Upload File (PDF/DOC)</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.txt"
                                            onChange={handleFileChange}
                                            style={styles.input}
                                        />
                                    </>
                                )}

                                {/* Show video link if type is video */}
                                {materialForm.type === 'video' && (
                                    <>
                                        <label style={styles.label}>Video  / External Link (YouTube,Zoom, Quiz etc.)</label>
                                        <input
                                            type="url"
                                            name="video_link"
                                            placeholder="https://youtube.com/... or  https://zoom.us/j/123456789  or  https://quiz.example.com/..."
                                            value={materialForm.video_link}
                                            onChange={handleMaterialChange}
                                            style={styles.input}
                                        />
                                    </>
                                )}

                                <button type="submit" style={styles.addBtn}>
                                    Upload Material
                                </button>
                            </form>
                        </div>

                        {/* Materials Table */}
                        {materials.length === 0 ? (
                            <div style={styles.emptyMsg}>
                                No materials uploaded for this course yet.
                            </div>
                        ) : (
                            <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>File / Link</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materials.map((m) => (<tr key={m.id}>
                                    <td>{m.title}</td>
                                    <td>
                                            <span style={
                                                m.type === 'pdf'   ? styles.typePdf   :
                                                m.type === 'video' ? styles.typeVideo :
                                                styles.typeNote
                                            }>
                                                {m.type}
                                            </span>
                                        </td>
                                        <td>
                                            {m.video_link ? (
                                                <a href={m.video_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={styles.link}
                                                >
                                                    View Video
                                                </a>
                                            ) : m.file_path ? (
                                                <span style={styles.fileText}>
                                                <MdLockClock size={15} />  File uploaded
                                                </span>
                                            ) : '—'}
                                        </td>
                                        
                                        <td>
                                            <button
                                                style={styles.editBtn}
                                                onClick={() => startEditMaterial(m)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={styles.viewBtn}
                                                onClick={() => openOrPreviewMaterial(m)}
                                            >
                                                Open / Details
                                            </button>
                                            <button
                                                style={styles.deleteBtn}
                                                onClick={() => deleteMaterial(m.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                </tbody>
                            </table>
                            {/* Note preview modal */}
                            {viewingMaterial && (
                                <div style={styles.modalOverlay} onClick={() => setViewingMaterial(null)}>
                                    <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
                                        <div style={styles.modalHeader}>
                                            <h3 style={styles.modalTitle}>{viewingMaterial.title}</h3>
                                            <button style={styles.modalClose} onClick={() => setViewingMaterial(null)}>✕</button>
                                        </div>
                                        {modalLoading ? (
                                            <div style={{padding:20}}>Loading...</div>
                                        ) : (
                                            <pre style={{whiteSpace:'pre-wrap',color:'#cbd5e1'}}>{modalContent}</pre>
                                        )}
                                    </div>
                                </div>
                            )}
                            </>
                        )}
                    </div>
                )}
            </div>
            {showStudents && (
    <div style={styles.modalOverlay} onClick={() => setShowStudents(false)}>
        <div style={styles.modalBox} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={styles.modalHeader}>
                <div>
                    <h2 style={styles.modalTitle}>
                         Enrolled Students
                    </h2>
                    <div style={styles.modalCourse}>
                        {courseStudents.course}
                    </div>
                </div>
                <button style={styles.modalClose} onClick={() => setShowStudents(false)}>✕</button>
            </div>

            {/* Count badge */}
            <div style={styles.countBadge}>
                {courseStudents.total || 0} Students Enrolled
            </div>

            {/* Students list */}
            {studentsLoading ? (
                <div style={styles.loadingText}>Loading students...</div>
            ) : courseStudents.students?.length === 0 ? (
                <div style={styles.emptyText}>No students enrolled yet.</div>
            ) : (
                <div style={styles.studentsList}>
                    {courseStudents.students?.map((s, i) => (
                        <div key={s.id} style={styles.studentItem}>
                            <div style={{
                                ...styles.studentAvatar,
                                background: ['#1e3a5f','#14532d','#3b0764','#7c2d12'][i % 4],
                                color: ['#60a5fa','#86efac','#d8b4fe','#fdba74'][i % 4],
                            }}>
                                {s.name[0].toUpperCase()}
                            </div>
                            <div>
                                <div style={styles.studentName}>{s.name}</div>
                                <div style={styles.studentEmail}>ID: {s.id} · {s.email}</div>
                                {s.enrolled_at && (
                                    <div style={styles.studentDate}>
                                        Enrolled: {new Date(s.enrolled_at).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    </div>
)}
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
    sidebarCourseSection: {
        marginTop: '18px',
        padding: '12px 14px',
        backgroundColor: '#111827',
        border: '1px solid #334155',
        borderRadius: '12px',
    },
    sidebarSectionTitle: {
        fontSize: '12px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '10px',
    },
    sidebarCourseItem: {
        width: '100%',
        textAlign: 'left',
        backgroundColor: 'transparent',
        color: '#cbd5e1',
        border: 'none',
        padding: '10px 12px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'background 0.2s ease',
        marginBottom: '6px',
    },
    sidebarCourseActive: {
        width: '100%',
        textAlign: 'left',
        backgroundColor: '#11243b',
        color: '#f8fafc',
        border: '1px solid #2563eb',
        padding: '10px',
        borderRadius: '14px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '700',
        marginBottom: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    sidebarCourseCard: {
        width: '100%',
        textAlign: 'left',
        backgroundColor: 'transparent',
        color: '#cbd5e1',
        border: '1px solid transparent',
        padding: '10px',
        borderRadius: '14px',
        cursor: 'pointer',
        fontSize: '13px',
        transition: 'all 0.2s ease',
        marginBottom: '10px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    sidebarCourseImg: {
        width: '50px',
        height: '50px',
        borderRadius: '10px',
        objectFit: 'cover',
        flexShrink: 0,
    },
    sidebarCourseInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minWidth: 0,
    },
    sidebarCourseCode: {
        fontSize: '11px',
        color: '#93c5fd',
        backgroundColor: '#1e3a5f',
        padding: '4px 8px',
        borderRadius: '999px',
        marginBottom: '6px',
        whiteSpace: 'nowrap',
    },
    sidebarCourseName: {
        fontSize: '13px',
        color: '#e2e8f0',
        fontWeight: '700',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '120px',
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
    successBox: {
        backgroundColor: '#052e16',
        border: '1px solid #22c55e',
        color: '#86efac',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
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
        ransition: 'transform 0.3s ease, boxShadow 0.3s ease',
        cursor: 'pointer'
    },

    courseCode: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#3b82f6',
        backgroundColor: '#1e3a5f',
        display: 'inline-block',
        alignItems:'ce',
        padding: '3px 10px',
        borderRadius: '6px',
        marginBottom: '10px',
    },
     courseImage: {
        width: '100%',
        height: '180px',
        
        borderRadius: '10px',
        display: 'block',
        margin: '0 auto'
    },
    courseName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#e2e8f0',
        marginBottom: '8px',
    },
    courseDesc: {
        fontSize: '13px',
        color: '#64748b',
        marginBottom: '16px',
        lineHeight: '1.5',
    },
    backBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#1e3a5f',
        color: '#f8fafc',
        border: '1px solid #334155',
        padding: '10px 18px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
        marginBottom: '20px',
        transition: 'all 0.2s ease',
    },
    backBtnHover: {
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
    },
    viewBtn: {
        backgroundColor: '#2563eb',
        color: 'white',
        border: '1px solid transparent',
        padding: '8px 16px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '700',
        transition: 'all 0.2s ease',
        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.18)',
    },
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
    addBtn: {
        backgroundColor: '#2563eb',
        color: '#f8fafc',
        border: '1px solid transparent',
        padding: '12px 24px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.18)',
    },
    saveBtn: {
        backgroundColor: '#16a34a',
        color: '#f8fafc',
        border: '1px solid transparent',
        padding: '12px 24px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
        marginRight: '8px',
        boxShadow: '0 10px 25px rgba(22, 163, 74, 0.18)',
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        color: '#cbd5e1',
        border: '1px solid #475569',
        padding: '12px 24px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
    },
    formButtons: {
        display: 'flex',
        gap: '8px',
        marginTop: '8px',
    },
    editBtn: {
        backgroundColor: '#334155',
        color: '#f8fafc',
        border: '1px solid #475569',
        padding: '8px 16px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '700',
        marginRight: '6px',
    },
    deleteBtn: {
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '700',
    },
    typePdf: {
        backgroundColor: '#7f1d1d',
        color: '#fca5a5',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    typeVideo: {
        backgroundColor: '#1e3a5f',
        color: '#93c5fd',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    typeNote: {
        backgroundColor: '#14532d',
        color: '#86efac',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    link: {
        color: '#3b82f6',
        fontSize: '13px',
    },
    fileText: {
        color: '#64748b',
        fontSize: '13px',
    },
    modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
},
modalBox: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 16,
    padding: 28,
    width: 480,
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
},
modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
},
modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#f1f5f9',
    margin: 0,
},
modalCourse: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
},
modalClose: {
    background: '#334155',
    border: 'none',
    color: '#94a3b8',
    width: 28,
    height: 28,
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
},
countBadge: {
    background: '#1e3a5f',
    color: '#60a5fa',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 16,
    display: 'inline-block',
},
loadingText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    padding: 24,
},
emptyText: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    padding: 24,
    background: '#0f172a',
    borderRadius: 8,
},
studentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
},
studentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 10,
    padding: '12px 14px',
},
studentAvatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
},
studentName: {
    fontSize: 13,
    fontWeight: 600,
    color: '#f1f5f9',
},
studentEmail: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
},
studentDate: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
},
studentsBtn: {
    backgroundColor: '#1e3a5f',
    color: '#60a5fa',
    border: '1px solid #2563eb',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    marginTop: '8px',
    width: '100%',
},
};

export default LecturerDashboard;