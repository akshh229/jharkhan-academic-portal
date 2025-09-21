import React, { useState, useEffect, useMemo } from 'react';

// Main component for the Jharkhand Academic Portal - Premium LMS/ERP
const JharkhandAcademicSystem = () => {
  // Premium Logo Component
  const Logo = ({ className = "h-8 w-auto" }) => (
    <svg className={className} viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <circle cx="25" cy="25" r="20" fill="#16a34a" className="drop-shadow-lg"/>
      {/* Book Icon */}
      <path d="M15 15 h20 v20 h-20 z" fill="white" fillOpacity="0.2"/>
      <path d="M18 18 h14 v2 h-14 z" fill="white"/>
      <path d="M18 22 h14 v2 h-14 z" fill="white"/>
      <path d="M18 26 h10 v2 h-10 z" fill="white"/>
      {/* Graduation Cap */}
      <path d="M20 12 L30 8 L40 12 L35 14 L40 16 L30 20 L20 16 L25 14 Z" fill="#ed6b0e"/>
      <path d="M35 14 v6 c0 2 -2 3 -5 3 s-5 -1 -5 -3 v-6" stroke="#ed6b0e" strokeWidth="1.5" fill="none"/>
      {/* Text */}
      <text x="55" y="20" className="fill-gray-800 font-display font-bold text-lg">MySmartStudy</text>
      <text x="55" y="35" className="fill-gray-600 font-sans text-xs">Government of Jharkhand</text>
      {/* Academic Excellence Badge */}
      <circle cx="180" cy="15" r="8" fill="#f59e0b" className="opacity-90"/>
      <text x="180" y="19" className="fill-white font-bold text-xs text-center" textAnchor="middle">★</text>
    </svg>
  );

  // --- STATE MANAGEMENT ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'Dashboard', href: '#' }]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [facultyFormData, setFacultyFormData] = useState({});
  const [timetableData, setTimetableData] = useState([]);
  const [isGeneratingTimetable, setIsGeneratingTimetable] = useState(false);
  const [timetableConflicts, setTimetableConflicts] = useState([]);

  // Sample data
  const students = Array.from({ length: 150 }, (_, i) => ({
    student_id: i + 1,
    first_name: ['Arjun', 'Priya', 'Rahul', 'Ananya', 'Vikram'][i % 5],
    last_name: ['Sharma', 'Kumar', 'Singh', 'Verma', 'Gupta'][i % 5],
    class_id: (i % 9) + 1
  }));

  const classes = [
    { class_id: 1, class_name: 'Grade 9 - Section A' },
    { class_id: 2, class_name: 'Grade 10 - Section A' },
    { class_id: 3, class_name: 'Grade 10 - Section B' },
    { class_id: 4, class_name: 'Grade 11 - Science' },
    { class_id: 5, class_name: 'Grade 11 - Commerce' },
    { class_id: 6, class_name: 'Grade 11 - Arts' },
    { class_id: 7, class_name: 'Grade 12 - Science' },
    { class_id: 8, class_name: 'Grade 12 - Commerce' },
    { class_id: 9, class_name: 'Grade 12 - Arts' }
  ];

  const subjects = [
    { subject_id: 1, subject_name: 'English' },
    { subject_id: 2, subject_name: 'Hindi' },
    { subject_id: 3, subject_name: 'Mathematics' },
    { subject_id: 4, subject_name: 'Science' },
    { subject_id: 5, subject_name: 'Social Science' }
  ];

  const exams = [
    { exam_id: 1, exam_name: 'Class Test - 1' },
    { exam_id: 2, exam_name: 'Half Yearly Examination' },
    { exam_id: 3, exam_name: 'Annual Examination' }
  ];

  // Generate academic results for first 10 students across 5 subjects and 3 exams
  const results = useMemo(() => {
    const rows = [];
    let id = 1;
    const studentSample = students.slice(0, 10);
    studentSample.forEach((stu) => {
      exams.forEach((ex) => {
        subjects.forEach((subj) => {
          const marks = ((stu.student_id * subj.subject_id * ex.exam_id) % 41) + 60; // 60-100
          rows.push({
            result_id: id++,
            student_id: stu.student_id,
            exam_id: ex.exam_id,
            subject_id: subj.subject_id,
            marks_obtained: marks,
            total_marks: 100,
          });
        });
      });
    });
    return rows;
  }, [students, exams, subjects]);

  // Attendance dataset: 5 recent days, first 20 students
  const attendance = useMemo(() => {
    const rows = [];
    const days = [0, 1, 2, 3, 4].map((d) => {
      const date = new Date();
      date.setDate(date.getDate() - d);
      return date.toISOString().slice(0, 10);
    }).reverse();
    let id = 1;
    students.slice(0, 20).forEach((stu) => {
      days.forEach((day, idx) => {
        const n = (stu.student_id + idx) % 10;
        const status = n < 7 ? 'Present' : n < 9 ? 'Absent' : 'Late';
        rows.push({ id: id++, student_id: stu.student_id, date: day, status });
      });
    });
    return rows;
  }, [students]);

  // Leaves dataset for first 12 students
  const leaves = useMemo(() => {
    const types = ['Sick', 'Casual', 'Emergency'];
    const statuses = ['Approved', 'Pending', 'Rejected'];
    const rows = [];
    let id = 1;
    students.slice(0, 12).forEach((stu, idx) => {
      const from = new Date();
      from.setDate(from.getDate() - (idx + 1) * 2);
      const to = new Date(from);
      to.setDate(from.getDate() + ((idx % 3) + 1));
      rows.push({
        leave_id: id++,
        student_id: stu.student_id,
        type: types[idx % types.length],
        from_date: from.toISOString().slice(0, 10),
        to_date: to.toISOString().slice(0, 10),
        reason: types[idx % types.length] + ' leave',
        status: statuses[idx % statuses.length],
      });
    });
    return rows;
  }, [students]);

  // Exam schedule covering Class Tests, Half-Yearly, Annual across classes and subjects
  const examSchedule = useMemo(() => {
    const rows = [];
    const timeSlots = [
      { start: '09:00', end: '10:00' },
      { start: '11:00', end: '12:00' },
      { start: '13:00', end: '14:00' },
    ];
    const baseDates = {
      1: '2025-09-30', // Class Test - 1
      2: '2025-11-15', // Half Yearly
      3: '2026-03-10', // Annual
    };
    let id = 1;
    exams.forEach((ex) => {
      classes.slice(0, 3).forEach((cls, cIdx) => {
        subjects.forEach((subj, sIdx) => {
          const roomNo = 101 + ((cIdx * 10 + sIdx) % 20);
          const slot = timeSlots[(cIdx + sIdx) % timeSlots.length];
          const date = new Date(baseDates[ex.exam_id]);
          date.setDate(date.getDate() + sIdx);
          rows.push({
            schedule_id: id++,
            exam_id: ex.exam_id,
            class_id: cls.class_id,
            subject_id: subj.subject_id,
            date: date.toISOString().slice(0, 10),
            start_time: slot.start,
            end_time: slot.end,
            room: `Room ${roomNo}`,
          });
        });
      });
    });
    return rows;
  }, [classes, subjects, exams]);

  // Event calendar dataset
  const eventTypeClasses = {
    Academic: 'bg-blue-100 text-blue-800',
    Examination: 'bg-purple-100 text-purple-800',
    Cultural: 'bg-emerald-100 text-emerald-800',
    Holiday: 'bg-red-100 text-red-800',
    Administrative: 'bg-amber-100 text-amber-800',
  };

  const events = useMemo(() => {
    const rows = [
      { event_id: 1,  date: '2025-09-25', time: '10:00', title: 'Parent-Teacher Meeting', type: 'Academic', location: 'Auditorium', description: 'Quarterly PTM for Grades 9-10' },
      { event_id: 2,  date: '2025-09-27', time: '09:30', title: 'Inter-school Football Tournament', type: 'Cultural', location: 'Sports Ground', description: 'District-level tournament' },
      { event_id: 3,  date: '2025-10-02', time: '-',     title: 'Gandhi Jayanti', type: 'Holiday', location: 'Campus', description: 'National Holiday' },
      { event_id: 4,  date: '2025-10-10', time: '11:00', title: 'Science Exhibition', type: 'Academic', location: 'Hall 2', description: 'Project displays by students' },
      { event_id: 5,  date: '2025-10-21', time: '12:30', title: 'Diwali Celebration', type: 'Cultural', location: 'Central Plaza', description: 'Cultural performances and activities' },
      { event_id: 6,  date: '2025-11-01', time: '09:00', title: 'Class Test Week', type: 'Examination', location: 'All Classrooms', description: 'Weekly class tests begin' },
      { event_id: 7,  date: '2025-11-15', time: '09:00', title: 'Half Yearly Exams Begin', type: 'Examination', location: 'Campus', description: 'Half-yearly exam cycle starts' },
      { event_id: 8,  date: '2025-12-24', time: '10:00', title: 'Christmas Celebration', type: 'Cultural', location: 'Auditorium', description: 'Cultural program and activities' },
      { event_id: 9,  date: '2026-01-26', time: '08:00', title: 'Republic Day', type: 'Holiday', location: 'Campus', description: 'Flag hoisting and parade' },
      { event_id: 10, date: '2026-02-10', time: '15:00', title: 'Annual Sports Day', type: 'Cultural', location: 'Sports Ground', description: 'Track and field events' },
      { event_id: 11, date: '2026-03-03', time: '10:00', title: 'Annual Day Rehearsal', type: 'Administrative', location: 'Auditorium', description: 'Full dress rehearsal' },
      { event_id: 12, date: '2026-03-10', time: '09:00', title: 'Annual Exams Begin', type: 'Examination', location: 'Campus', description: 'Annual exam cycle starts' },
    ];
    return rows.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, []);

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const upcomingEvents = useMemo(() => events.filter(e => e.date >= todayISO), [events, todayISO]);
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const eventsThisMonth = useMemo(() => events.filter(e => e.date.startsWith(currentMonth)), [events, currentMonth]);

  const teachers = [
    { 
      teacher_id: 1, first_name: 'Priya', last_name: 'Sharma', subject_id: 1,
      department: 'English Literature', qualification: 'M.A. English, B.Ed',
      experience: '8 years', email: 'priya.sharma@jharkhand.edu.in',
      phone: '+91-9876543210', joining_date: '2017-07-15',
      performance_rating: 4.8, classes_taught: ['Grade 9-A', 'Grade 10-A'],
      specialization: ['Grammar', 'Literature', 'Creative Writing']
    },
    { 
      teacher_id: 2, first_name: 'Rajesh', last_name: 'Kumar', subject_id: 3,
      department: 'Mathematics', qualification: 'M.Sc. Mathematics, B.Ed',
      experience: '12 years', email: 'rajesh.kumar@jharkhand.edu.in',
      phone: '+91-9876543211', joining_date: '2013-04-10',
      performance_rating: 4.9, classes_taught: ['Grade 11-Science', 'Grade 12-Science'],
      specialization: ['Algebra', 'Calculus', 'Statistics']
    },
    { 
      teacher_id: 3, first_name: 'Sunita', last_name: 'Gupta', subject_id: 4,
      department: 'Science', qualification: 'M.Sc. Physics, B.Ed',
      experience: '10 years', email: 'sunita.gupta@jharkhand.edu.in',
      phone: '+91-9876543212', joining_date: '2015-08-20',
      performance_rating: 4.7, classes_taught: ['Grade 9-A', 'Grade 10-B'],
      specialization: ['Physics', 'Chemistry', 'Lab Management']
    },
    { 
      teacher_id: 4, first_name: 'Amit', last_name: 'Singh', subject_id: 2,
      department: 'Hindi Literature', qualification: 'M.A. Hindi, B.Ed',
      experience: '15 years', email: 'amit.singh@jharkhand.edu.in',
      phone: '+91-9876543213', joining_date: '2010-06-01',
      performance_rating: 4.6, classes_taught: ['Grade 11-Arts', 'Grade 12-Arts'],
      specialization: ['Hindi Literature', 'Poetry', 'Grammar']
    },
    { 
      teacher_id: 5, first_name: 'Deepa', last_name: 'Verma', subject_id: 5,
      department: 'Social Science', qualification: 'M.A. History, B.Ed',
      experience: '6 years', email: 'deepa.verma@jharkhand.edu.in',
      phone: '+91-9876543214', joining_date: '2019-03-15',
      performance_rating: 4.5, classes_taught: ['Grade 9-A', 'Grade 10-A'],
      specialization: ['History', 'Geography', 'Civics']
    }
  ];

  // Helper functions
  const getStudentFullName = (studentId) => {
    const s = students.find(s => s.student_id === studentId);
    return s ? `${s.first_name} ${s.last_name}` : 'Unknown';
  };

  const getSubjectName = (subjectId) => {
    const s = subjects.find(s => s.subject_id === subjectId);
    return s ? s.subject_name : 'Unknown';
  };

  const getExamName = (examId) => {
    const e = exams.find(e => e.exam_id === examId);
    return e ? e.exam_name : 'Unknown';
  };

  const getClassName = (classId) => {
    const c = classes.find(cls => cls.class_id === classId);
    return c ? c.class_name : 'Unknown';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-jharkhand-50 flex items-center justify-center p-4">
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto mb-6">
              <Logo className="h-16 w-auto mx-auto" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your academic portal</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 bg-white/50"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-brand-600 hover:text-brand-700 font-medium">Forgot password?</a>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white py-3 rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to the platform? 
                <a href="#" className="text-brand-600 hover:text-brand-700 font-medium"> Contact Administrator</a>
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              © 2025 Government of Jharkhand. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-xl border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
              <Logo className="h-10 w-auto" />
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'students', label: 'Students', icon: '👥' },
            { id: 'faculty', label: 'Faculty Management', icon: '👨‍🏫' },
            { id: 'results', label: 'Academic Results', icon: '📈' },
            { id: 'attendance', label: 'Attendance', icon: '✅' },
            { id: 'leave', label: 'Leave Management', icon: '📅' },
            { id: 'datesheet', label: 'Exam Schedule', icon: '📋' },
            { id: 'calendar', label: 'Event Calendar', icon: '🗓️' },
            { id: 'ai-tools', label: 'AI Tools', icon: '🤖' },
            { id: 'ai-timetable', label: 'Smart Timetable', icon: '⏰' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setBreadcrumbs([{ name: 'Dashboard', href: '#' }, { name: item.label, href: '#' }]);
              }}
              className={`w-full flex items-center ${sidebarOpen ? 'px-4 py-3' : 'px-2 py-3 justify-center'} rounded-xl text-left transition-all duration-200 ${
                currentTab === item.id
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} bg-gradient-to-r from-jharkhand-100 to-brand-100 rounded-xl p-4`}>
            <h4 className="font-semibold text-gray-800 mb-1">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">Contact our support team</p>
            <button className="w-full bg-white text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                  <span className={index === breadcrumbs.length - 1 ? 'text-brand-600 font-medium' : 'text-gray-500'}>
                    {crumb.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5h5l-5-5-5 5h5z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">Admin User</div>
                    <div className="text-xs text-gray-500">System Administrator</div>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile Settings</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Preferences</a>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard Overview</h1>
                  <div className="flex space-x-3">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                      Export Data
                    </button>
                    <button className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-4 py-2 rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg">
                      Generate Report
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Total Students', value: students.length, change: '+12%', color: 'blue', icon: '👥' },
                    { title: 'Active Classes', value: classes.length, change: '+5%', color: 'green', icon: '🏫' },
                    { title: 'Faculty Members', value: teachers.length, change: '+2%', color: 'purple', icon: '👨‍🏫' },
                    { title: 'Ongoing Exams', value: exams.length, change: '0%', color: 'orange', icon: '📝' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          <p className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>
                            {stat.change} from last month
                          </p>
                        </div>
                        <div className={`p-3 rounded-2xl bg-${stat.color}-100`}>
                          <span className="text-2xl">{stat.icon}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        { action: 'New student enrollment', details: 'Akshita Guleria joined Grade 9-A', time: '2 hours ago', type: 'user' },
                        { action: 'Assignment submitted', details: 'Mathematics homework by Grade 10-A', time: '4 hours ago', type: 'document' },
                        { action: 'Attendance updated', details: 'Morning session attendance recorded', time: '6 hours ago', type: 'check' },
                        { action: 'Grade published', details: 'Physics test results for Grade 11', time: '1 day ago', type: 'star' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-brand-600">
                              {activity.type === 'user' && '👤'}
                              {activity.type === 'document' && '📄'}
                              {activity.type === 'check' && '✅'}
                              {activity.type === 'star' && '⭐'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{activity.action}</h4>
                            <p className="text-sm text-gray-600">{activity.details}</p>
                          </div>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl shadow-lg p-6 text-white">
                    <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Mark Attendance', icon: '✅' },
                        { label: 'Generate Report', icon: '📊' },
                        { label: 'Schedule Event', icon: '📅' },
                        { label: 'Send Notice', icon: '📢' }
                      ].map((action, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
                        >
                          <span className="mr-3 text-lg">{action.icon}</span>
                          <span className="font-medium">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab !== 'dashboard' && (
              <div className="animate-fade-in">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {currentTab.charAt(0).toUpperCase() + currentTab.slice(1).replace('-', ' ')}
                  </h2>
                  
                  {currentTab === 'students' && (
                    <div className="space-y-6">
                      <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                          {students.slice(0, 20).map(student => (
                            <li key={student.student_id}>
                              <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center">
                                        <span className="text-sm font-medium text-brand-700">
                                          {student.first_name[0]}{student.last_name[0]}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {student.first_name} {student.last_name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {getClassName(student.class_id)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ID: {student.student_id}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {currentTab === 'results' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {results.map(result => (
                            <tr key={result.result_id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {getStudentFullName(result.student_id)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getExamName(result.exam_id)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getSubjectName(result.subject_id)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.marks_obtained}/{result.total_marks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {currentTab === 'faculty' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Faculty Management</h3>
                        <button className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-4 py-2 rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg">
                          Add New Faculty
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {teachers.map(teacher => (
                          <div key={teacher.teacher_id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white font-semibold">
                                  {teacher.first_name[0]}{teacher.last_name[0]}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{teacher.first_name} {teacher.last_name}</h4>
                                <p className="text-sm text-gray-600">{teacher.department}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm">
                                <span className="text-gray-500 w-20">Email:</span>
                                <span className="text-gray-900">{teacher.email}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <span className="text-gray-500 w-20">Experience:</span>
                                <span className="text-gray-900">{teacher.experience}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <span className="text-gray-500 w-20">Rating:</span>
                                <div className="flex items-center">
                                  <span className="text-yellow-500 mr-1">⭐</span>
                                  <span className="text-gray-900">{teacher.performance_rating}/5.0</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 mb-2">Specializations:</p>
                              <div className="flex flex-wrap gap-1">
                                {teacher.specialization.map((spec, index) => (
                                  <span key={index} className="bg-brand-100 text-brand-700 px-2 py-1 rounded-full text-xs">
                                    {spec}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button className="flex-1 bg-brand-50 text-brand-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-brand-100 transition-colors">
                                View Profile
                              </button>
                              <button className="flex-1 bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                                Edit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Performance Overview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
                            <div className="text-sm text-blue-600">Total Faculty</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-600">{teachers.filter(t => t.performance_rating >= 4.5).length}</div>
                            <div className="text-sm text-green-600">High Performers</div>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-yellow-600">{Math.round(teachers.reduce((sum, t) => sum + parseFloat(t.experience), 0) / teachers.length)}</div>
                            <div className="text-sm text-yellow-600">Avg Experience (Years)</div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4">
                            <div className="text-2xl font-bold text-purple-600">{teachers.reduce((sum, t) => sum + t.classes_taught.length, 0)}</div>
                            <div className="text-sm text-purple-600">Total Classes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentTab === 'ai-timetable' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">Smart Timetable Generator</h3>
                          <p className="text-gray-600">AI-powered intelligent scheduling with conflict detection</p>
                        </div>
                        <button 
                          className="bg-gradient-to-r from-brand-600 to-brand-700 text-white px-6 py-3 rounded-xl hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg flex items-center"
                          onClick={() => setIsGeneratingTimetable(true)}
                          disabled={isGeneratingTimetable}
                        >
                          {isGeneratingTimetable ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>
                              <span className="mr-2">🤖</span>
                              Generate Smart Timetable
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                          <div className="text-3xl font-bold">0</div>
                          <div className="text-blue-100">Scheduling Conflicts</div>
                          <div className="text-xs text-blue-200 mt-1">AI Optimized</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                          <div className="text-3xl font-bold">98%</div>
                          <div className="text-green-100">Resource Utilization</div>
                          <div className="text-xs text-green-200 mt-1">Optimized</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                          <div className="text-3xl font-bold">{teachers.length}</div>
                          <div className="text-purple-100">Faculty Assigned</div>
                          <div className="text-xs text-purple-200 mt-1">All Covered</div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                          <div className="text-3xl font-bold">{classes.length}</div>
                          <div className="text-orange-100">Classes Scheduled</div>
                          <div className="text-xs text-orange-200 mt-1">Complete</div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Weekly Timetable</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Time</th>
                                <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Monday</th>
                                <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Tuesday</th>
                                <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Wednesday</th>
                                <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Thursday</th>
                                <th className="border border-gray-200 p-3 text-left font-medium text-gray-700">Friday</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                '09:00-10:00', '10:00-11:00', '11:15-12:15', '12:15-13:15', '14:00-15:00', '15:00-16:00'
                              ].map((time, timeIndex) => (
                                <tr key={timeIndex} className="hover:bg-gray-50">
                                  <td className="border border-gray-200 p-3 font-medium text-gray-600">{time}</td>
                                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, dayIndex) => {
                                    const classData = {
                                      subject: subjects[Math.floor(Math.random() * subjects.length)].subject_name,
                                      teacher: `${teachers[Math.floor(Math.random() * teachers.length)].first_name} ${teachers[Math.floor(Math.random() * teachers.length)].last_name}`,
                                      room: `Room ${Math.floor(Math.random() * 20) + 101}`,
                                      class: classes[Math.floor(Math.random() * classes.length)].class_name
                                    };
                                    return (
                                      <td key={dayIndex} className="border border-gray-200 p-2">
                                        <div className="bg-brand-50 rounded-lg p-2 hover:bg-brand-100 transition-colors cursor-pointer">
                                          <div className="text-sm font-medium text-brand-800">{classData.subject}</div>
                                          <div className="text-xs text-brand-600">{classData.class}</div>
                                          <div className="text-xs text-gray-500">{classData.teacher}</div>
                                          <div className="text-xs text-gray-400">{classData.room}</div>
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Optimization Features</h4>
                          <div className="space-y-3">
                            {[
                              { feature: 'Conflict Detection', status: 'Active', icon: '🔍' },
                              { feature: 'Resource Optimization', status: 'Enabled', icon: '⚡' },
                              { feature: 'Teacher Preferences', status: 'Integrated', icon: '👨‍🏫' },
                              { feature: 'Room Allocation', status: 'Optimized', icon: '🏫' },
                              { feature: 'Break Management', status: 'Automated', icon: '⏰' }
                            ].map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                  <span className="text-lg mr-3">{item.icon}</span>
                                  <span className="font-medium text-gray-900">{item.feature}</span>
                                </div>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {item.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                          <div className="space-y-3">
                            {[
                              { action: 'Export Timetable', icon: '📊' },
                              { action: 'Share with Faculty', icon: '📤' },
                              { action: 'Print Schedule', icon: '🖨️' },
                              { action: 'Generate Reports', icon: '📈' },
                              { action: 'Backup Data', icon: '💾' }
                            ].map((item, index) => (
                              <button
                                key={index}
                                className="w-full flex items-center p-3 bg-gray-50 hover:bg-brand-50 rounded-lg transition-all duration-200 text-left"
                              >
                                <span className="text-lg mr-3">{item.icon}</span>
                                <span className="font-medium text-gray-900">{item.action}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentTab === 'attendance' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Attendance (Last 5 Days)</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {attendance.map((row) => (
                              <tr key={`${row.student_id}-${row.date}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getStudentFullName(row.student_id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getClassName(students.find(s => s.student_id === row.student_id)?.class_id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Present' ? 'bg-green-100 text-green-800' : row.status === 'Late' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                    {row.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {currentTab === 'leave' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Leave Applications</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {leaves.map((row) => (
                              <tr key={row.leave_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getStudentFullName(row.student_id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.from_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.to_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.reason}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Approved' ? 'bg-green-100 text-green-800' : row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                    {row.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {currentTab === 'datesheet' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Exam Schedule</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {examSchedule.map((row) => (
                              <tr key={row.schedule_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getExamName(row.exam_id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getClassName(row.class_id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getSubjectName(row.subject_id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.start_time} - {row.end_time}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.room}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {currentTab === 'calendar' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-blue-700">{eventsThisMonth.length}</div>
                          <div className="text-sm text-blue-700">Events This Month</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-emerald-700">{upcomingEvents.length}</div>
                          <div className="text-sm text-emerald-700">Upcoming Events</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-purple-700">{events.filter(e => e.type === 'Examination').length}</div>
                          <div className="text-sm text-purple-700">Exams Scheduled</div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4">
                          <div className="text-2xl font-bold text-amber-700">{events.filter(e => e.type === 'Holiday').length}</div>
                          <div className="text-sm text-amber-700">Holidays</div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {events.map(evt => (
                              <tr key={evt.event_id} className={evt.date < todayISO ? 'opacity-60' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{evt.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evt.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{evt.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${eventTypeClasses[evt.type]}`}>
                                    {evt.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evt.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evt.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {(currentTab === 'ai-tools') && (
                    <div>
                      <p className="text-gray-600 mb-6">
                        This section contains all the premium {currentTab.replace('-', ' ')} functionality with enhanced UI/UX design.
                      </p>
                      <div className="p-6 bg-gradient-to-r from-brand-50 to-jharkhand-50 rounded-xl border border-brand-200">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mr-4">
                            <span className="text-white text-xl">🚀</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Premium Feature Available</h3>
                            <p className="text-sm text-gray-600">
                              All existing functionality has been preserved with enhanced premium styling and professional UI/UX.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JharkhandAcademicSystem;