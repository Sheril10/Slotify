"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

import AddSessionModal from "./AddSessionModal";
import AddAcademicYearModal from "./AddAcademicYearModal";
import AddGroupModal from "./AddGroupModal";
import AddShiftModal from "./AddShiftModal";
import AddTimeslotModal from "./AddTimeslotModal";
import AddSubjectModal from "./AddSubjectModal";
import AddSubjectCombinationModal from "./AddSubjectCombinationModal";
import AddGroupSubjectModal from "./AddGroupSubjectModal";
import AddDepartmentModal from "./AddDepartmentModal";
import AddTeacherModal from "./AddTeacherModal";
import AddRoomModal from "./AddRoomModal";
import AddSectionModal from "./AddSectionModal";            // ✅ NEW
import AddSubsectionModal from "./AddSubsectionModal";      // ✅ NEW
import ProgressOverviewModal from "./ProgressOverviewModal";

export default function TimetablePage() {
  const { timetable } = useParams();
  const router = useRouter();

  const safeTitle = timetable ? decodeURIComponent(timetable) : "Timetable";

  // ================= STEPS =================
  const [steps, setSteps] = useState(["Add Sessions"]);

  const nextSteps = [
    "Add Academic Years",
    "Add Groups",
    "Add Shifts",
    "Add Timeslots",
    "Add Subjects",
    "Add Subject Combinations",
    "Add Group Subjects",
    "Add Departments",
    "Add Teachers",
    "Add Rooms",
    "Add Sections",       // ✅
    "Add Subsections",    // ✅ LAST
  ];

  // ================= MODALS =================
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddAcademicYear, setShowAddAcademicYear] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAddTimeslot, setShowAddTimeslot] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddSubjectCombination, setShowAddSubjectCombination] = useState(false);
  const [showAddGroupSubject, setShowAddGroupSubject] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);

  const [showAddSection, setShowAddSection] = useState(false);     // ✅
  const [showAddSubsection, setShowAddSubsection] = useState(false); // ✅

  const [showProgressOverview, setShowProgressOverview] = useState(false);

  // ================= DATA =================
  const [sessions, setSessions] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [groups, setGroups] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [timeslots, setTimeslots] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subjectCombinations, setSubjectCombinations] = useState([]);
  const [groupSubjects, setGroupSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [sections, setSections] = useState([]);        // ✅
  const [subsections, setSubsections] = useState([]);  // ✅

  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  // ================= AUTH =================
  useEffect(() => {
    if (!localStorage.getItem("token")) router.push("/");
  }, [router]);

  // ================= PROGRESS =================
  const STEP_INCREMENT = 7.7;

  useEffect(() => {
    const value = Math.min(completedSteps.length * STEP_INCREMENT, 100);
    setProgress(parseFloat(value.toFixed(1)));
  }, [completedSteps]);

  const markStepComplete = (step) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev : [...prev, step]
    );
  };

  const advanceStep = (current) => {
    const idx = nextSteps.indexOf(current);
    const next = nextSteps[idx + 1];

    if (next && !steps.includes(next)) {
      setSteps((prev) => [...prev, next]);
    }
  };

  const handleSubmit = () => {
    if (progress < 100) return;
    localStorage.setItem(`generated_${safeTitle}`, "true");
    router.push("/dashboard");
  };

  // ================= CASCADE RESET =================

  useEffect(() => {
    if (sessions.length === 0) {
      setAcademicYears([]);
      setGroups([]);
      setShifts([]);
      setTimeslots([]);
      setSubjects([]);
      setSubjectCombinations([]);
      setGroupSubjects([]);
      setDepartments([]);
      setTeachers([]);
      setRooms([]);
      setSections([]);
      setSubsections([]);

      setSteps(["Add Sessions"]);
      setCompletedSteps([]);
    }
  }, [sessions]);

  useEffect(() => {
  if (academicYears.length === 0 && sessions.length > 0) {
    setGroups([]);
    setShifts([]);
    setTimeslots([]);
    setSubjects([]);
    setSubjectCombinations([]);
    setGroupSubjects([]);
    setDepartments([]);
    setTeachers([]);
    setRooms([]);
    setSections([]);
    setSubsections([]);

    const remove = [
      "Add Groups",
      "Add Shifts",
      "Add Timeslots",
      "Add Subjects",
      "Add Subject Combinations",
      "Add Group Subjects",
      "Add Departments",
      "Add Teachers",
      "Add Rooms",
      "Add Sections",
      "Add Subsections",
    ];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [academicYears, sessions]);


useEffect(() => {
  if (groups.length === 0 && academicYears.length > 0) {
    setShifts([]);
    setTimeslots([]);
    setSubjects([]);
    setSubjectCombinations([]);
    setGroupSubjects([]);
    setDepartments([]);
    setTeachers([]);
    setRooms([]);
    setSections([]);
    setSubsections([]);

    const remove = [
      "Add Shifts",
      "Add Timeslots",
      "Add Subjects",
      "Add Subject Combinations",
      "Add Group Subjects",
      "Add Departments",
      "Add Teachers",
      "Add Rooms",
      "Add Sections",
      "Add Subsections",
    ];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [groups, academicYears]);

useEffect(() => {
  if (shifts.length === 0 && groups.length > 0) {
    setTimeslots([]);
    setSubjects([]);
    setSubjectCombinations([]);
    setGroupSubjects([]);
    setDepartments([]);
    setTeachers([]);
    setRooms([]);
    setSections([]);
    setSubsections([]);

    const remove = [
      "Add Timeslots",
      "Add Subjects",
      "Add Subject Combinations",
      "Add Group Subjects",
      "Add Departments",
      "Add Teachers",
      "Add Rooms",
      "Add Sections",
      "Add Subsections",
    ];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [shifts, groups]);


useEffect(() => {
  if (timeslots.length === 0 && shifts.length > 0) {
    setSubjects([]);
    setSubjectCombinations([]);
    setGroupSubjects([]);
    setDepartments([]);
    setTeachers([]);
    setRooms([]);
    setSections([]);
    setSubsections([]);

    const remove = [
      "Add Subjects",
      "Add Subject Combinations",
      "Add Group Subjects",
      "Add Departments",
      "Add Teachers",
      "Add Rooms",
      "Add Sections",
      "Add Subsections",
    ];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [timeslots, shifts]);


useEffect(() => {
  if (subjects.length === 0 && timeslots.length > 0) {
    setSubjectCombinations([]);
    setGroupSubjects([]);
    setDepartments([]);
    setTeachers([]);
    setRooms([]);
    setSections([]);
    setSubsections([]);

    const remove = [
      "Add Subject Combinations",
      "Add Group Subjects",
      "Add Departments",
      "Add Teachers",
      "Add Rooms",
      "Add Sections",
      "Add Subsections",
    ];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [subjects, timeslots]);


useEffect(() => {
  if (subjectCombinations.length === 0 && subjects.length > 0) {
    setGroupSubjects([]);
    setDepartments([]);
    setTeachers([]);
    setRooms([]);
    setSections([]);
    setSubsections([]);

    const remove = [
      "Add Group Subjects",
      "Add Departments",
      "Add Teachers",
      "Add Rooms",
      "Add Sections",
      "Add Subsections",
    ];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [subjectCombinations, subjects]);



useEffect(() => {
  if (groupSubjects.length === 0 && subjectCombinations.length > 0) {
    setDepartments([]);
    setTeachers([]);
    setRooms([]);
    setSections([]);
    setSubsections([]);

    const remove = [
      "Add Departments",
      "Add Teachers",
      "Add Rooms",
      "Add Sections",
      "Add Subsections",
    ];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [groupSubjects, subjectCombinations]);



useEffect(() => {
  if (departments.length === 0 && groupSubjects.length > 0) {
    setTeachers([]);
    setRooms([]);
    setSections([]);
    setSubsections([]);

    const remove = [
      "Add Teachers",
      "Add Rooms",
      "Add Sections",
      "Add Subsections",
    ];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [departments, groupSubjects]);



useEffect(() => {
  if (teachers.length === 0 && departments.length > 0) {
    setRooms([]);
    setSections([]);
    setSubsections([]);

    const remove = [
      "Add Rooms",
      "Add Sections",
      "Add Subsections",
    ];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [teachers, departments]);





  useEffect(() => {
    if (rooms.length === 0 && teachers.length > 0) {
      setSections([]);
      setSubsections([]);

      setSteps((prev) =>
        prev.filter(
          (s) => !["Add Sections", "Add Subsections"].includes(s)
        )
      );

      setCompletedSteps((prev) =>
        prev.filter(
          (s) => !["Add Sections", "Add Subsections"].includes(s)
        )
      );
    }
  }, [rooms, teachers]);


  useEffect(() => {
  if (sections.length === 0 && rooms.length > 0) {
    setSubsections([]);

    const remove = ["Add Subsections"];

    setSteps((prev) => prev.filter((s) => !remove.includes(s)));
    setCompletedSteps((prev) => prev.filter((s) => !remove.includes(s)));
  }
}, [sections, rooms]);




  // ================= HANDLERS =================

  const handleSessionsSubmitted = (data) => {
    setSessions(data);
    advanceStep("Add Sessions");
    markStepComplete("Add Sessions");
    setShowAddSession(false);
  };

  const handleAcademicYearsSubmitted = (data) => {
    setAcademicYears(data);
    advanceStep("Add Academic Years");
    markStepComplete("Add Academic Years");
    setShowAddAcademicYear(false);
  };

  const handleGroupsSubmitted = (data) => {
    setGroups(data);
    advanceStep("Add Groups");
    markStepComplete("Add Groups");
    setShowAddGroup(false);
  };

  const handleShiftsSubmitted = (data) => {
    setShifts(data);
    advanceStep("Add Shifts");
    markStepComplete("Add Shifts");
    setShowAddShift(false);
  };

  const handleTimeslotsSubmitted = (data) => {
    setTimeslots(data);
    advanceStep("Add Timeslots");
    markStepComplete("Add Timeslots");
    setShowAddTimeslot(false);
  };

  const handleSubjectsSubmitted = (data) => {
    setSubjects(data);
    advanceStep("Add Subjects");
    markStepComplete("Add Subjects");
    setShowAddSubject(false);
  };

  const handleSubjectCombinationsSubmitted = (data) => {
    setSubjectCombinations(data);
    advanceStep("Add Subject Combinations");
    markStepComplete("Add Subject Combinations");
    setShowAddSubjectCombination(false);
  };

  const handleGroupSubjectsSubmitted = (data) => {
    setGroupSubjects(data);
    advanceStep("Add Group Subjects");
    markStepComplete("Add Group Subjects");
    setShowAddGroupSubject(false);
  };

  const handleDepartmentsSubmitted = (data) => {
    setDepartments(data);
    advanceStep("Add Departments");
    markStepComplete("Add Departments");
    setShowAddDepartment(false);
  };

  const handleTeachersSubmitted = (data) => {
    setTeachers(data);
    advanceStep("Add Teachers");
    markStepComplete("Add Teachers");
    setShowAddTeacher(false);
  };

  const handleRoomsSubmitted = (data) => {
    setRooms(data);
    advanceStep("Add Rooms");
    markStepComplete("Add Rooms");
    setShowAddRoom(false);
  };

  const handleSectionsSubmitted = (data) => {
    setSections(data);
    advanceStep("Add Sections");
    markStepComplete("Add Sections");
    setShowAddSection(false);
  };

  const handleSubsectionsSubmitted = (data) => {
    setSubsections(data);
    advanceStep("Add Subsections");
    markStepComplete("Add Subsections");
    setShowAddSubsection(false);
  };

  // ================= ICONS =================
  const stepIcons = {
    "Add Sessions": "/sessions.png",
    "Add Academic Years": "/academicyear.png",
    "Add Groups": "/groups.png",
    "Add Shifts": "/shifts.png",
    "Add Timeslots": "/timeslot.png",
    "Add Subjects": "/subjects.png",
    "Add Subject Combinations": "/subjectcombination.png",
    "Add Group Subjects": "/groupsubject.png",
    "Add Departments": "/departments.png",
    "Add Teachers": "/teachers.png",
    "Add Rooms": "/rooms.png",
    "Add Sections": "/sections.png",
    "Add Subsections": "/subsections.png",
  };

  // ================= UI =================
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <img src="/ChatGPT Image Sep 13, 2025, 04_46_17 AM.png" className={styles.logo} />

        <div className={styles.nav}>
          <button className={styles.navItem} onClick={() => router.push("/front")}>
            Home
          </button>

          <button className={styles.navItem}>
            Save "{safeTitle}"
          </button>

          <button
            className={`${styles.navItem} ${
              progress < 100 ? styles.disabledSubmit : styles.activeSubmit
            }`}
            onClick={handleSubmit}
            disabled={progress < 100}
          >
            Submit
          </button>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{safeTitle}</h1>

          <button
            className={styles.statusBox}
            onClick={() => setShowProgressOverview(true)}
          >
            Current Progress: {progress}%
          </button>
        </div>

        <div className={styles.scrollContent}>
          <div className={styles.cardContainer}>
            {steps.map((label, i) => (
              <div key={i} className={styles.cardWrapper}>
                <button
                  className={styles.cardBtn}
                  onClick={() => {
                    if (label === "Add Sessions") setShowAddSession(true);
                    if (label === "Add Academic Years") setShowAddAcademicYear(true);
                    if (label === "Add Groups") setShowAddGroup(true);
                    if (label === "Add Shifts") setShowAddShift(true);
                    if (label === "Add Timeslots") setShowAddTimeslot(true);
                    if (label === "Add Subjects") setShowAddSubject(true);
                    if (label === "Add Subject Combinations") setShowAddSubjectCombination(true);
                    if (label === "Add Group Subjects") setShowAddGroupSubject(true);
                    if (label === "Add Departments") setShowAddDepartment(true);
                    if (label === "Add Teachers") setShowAddTeacher(true);
                    if (label === "Add Rooms") setShowAddRoom(true);
                    if (label === "Add Sections") setShowAddSection(true);
                    if (label === "Add Subsections") setShowAddSubsection(true);
                  }}
                >
                  <img src={stepIcons[label]} className={styles.addIcon} />
                </button>

                <span className={styles.cardLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showAddSession && <AddSessionModal onClose={() => setShowAddSession(false)} onSubmit={handleSessionsSubmitted} sessions={sessions} setSessions={setSessions} />}
      {showAddAcademicYear && <AddAcademicYearModal onClose={() => setShowAddAcademicYear(false)} onSubmit={handleAcademicYearsSubmitted} academicYears={academicYears} setAcademicYears={setAcademicYears} sessions={sessions} />}
      {showAddGroup && <AddGroupModal onClose={() => setShowAddGroup(false)} onSubmit={handleGroupsSubmitted} groups={groups} setGroups={setGroups} academicYears={academicYears} />}
      {showAddShift && <AddShiftModal onClose={() => setShowAddShift(false)} onSubmit={handleShiftsSubmitted} shifts={shifts} setShifts={setShifts} />}
      {showAddTimeslot && <AddTimeslotModal onClose={() => setShowAddTimeslot(false)} onSubmit={handleTimeslotsSubmitted} timeslots={timeslots} setTimeslots={setTimeslots} shifts={shifts} />}
      {showAddSubject && <AddSubjectModal onClose={() => setShowAddSubject(false)} onSubmit={handleSubjectsSubmitted} subjects={subjects} setSubjects={setSubjects} />}
      {showAddSubjectCombination && <AddSubjectCombinationModal onClose={() => setShowAddSubjectCombination(false)} onSubmit={handleSubjectCombinationsSubmitted} subjects={subjects} subjectCombinations={subjectCombinations} setSubjectCombinations={setSubjectCombinations} />}
      {showAddGroupSubject && <AddGroupSubjectModal onClose={() => setShowAddGroupSubject(false)} onSubmit={handleGroupSubjectsSubmitted} groupSubjects={groupSubjects} setGroupSubjects={setGroupSubjects} groups={groups} subjects={subjects} />}
      {showAddDepartment && <AddDepartmentModal onClose={() => setShowAddDepartment(false)} onSubmit={handleDepartmentsSubmitted} departments={departments} setDepartments={setDepartments} />}
      {showAddTeacher && <AddTeacherModal onClose={() => setShowAddTeacher(false)} onSubmit={handleTeachersSubmitted} teachers={teachers} setTeachers={setTeachers} departments={departments} subjects={subjects} />}
      {showAddRoom && <AddRoomModal onClose={() => setShowAddRoom(false)} onSubmit={handleRoomsSubmitted} rooms={rooms} setRooms={setRooms} subjects={subjects} />}

      {showAddSection && (
        <AddSectionModal
          onClose={() => setShowAddSection(false)}
          onSubmit={handleSectionsSubmitted}
          sections={sections}
          setSections={setSections}
          timeslots={timeslots}
          teachers={teachers}
          subsections={subsections}
        />
      )}

      {showAddSubsection && (
        <AddSubsectionModal
          onClose={() => setShowAddSubsection(false)}
          onSubmit={handleSubsectionsSubmitted}
          subsections={subsections}
          setSubsections={setSubsections}
          sections={sections}
          groupSubjects={groupSubjects}
        />
      )}

      {showProgressOverview && (
        <ProgressOverviewModal
          onClose={() => setShowProgressOverview(false)}
          data={{
            sessions,
            academicYears,
            groups,
            shifts,
            timeslots,
            subjects,
            subjectCombinations,
            groupSubjects,
            departments,
            teachers,
            rooms,
            sections,
            subsections,
          }}
        />
      )}
    </div>
  );
}