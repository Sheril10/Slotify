"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import AddSessionModal from "./AddSessionModal";
import AddGroupModal from "./AddGroupModal";
import AddShiftModal from "./AddShiftModal";
import AddSubjectModal from "./AddSubjectModal";
import AddSectionModal from "./AddSectionModal";
import AddDepartmentModal from "./AddDepartmentModal";
import AddTeacherModal from "./AddTeacherModal";
import AddRoomModal from "./AddRoomModal";
import ProgressOverviewModal from "./ProgressOverviewModal"; // 🆕 NEW IMPORT

export default function TimetablePage() {
  const { timetable } = useParams();
  const router = useRouter();

  const [expanded, setExpanded] = useState(null);
  const [steps, setSteps] = useState(["Add Sessions"]);

  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showProgressOverview, setShowProgressOverview] = useState(false); // 🆕

  const [sessions, setSessions] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const nextSteps = [
    "Add Shifts",
    "Add Groups",
    "Add Subjects",
    "Add Sections",
    "Add Departments",
    "Add Teachers",
    "Add Rooms",
  ];

  const stepIcons = {
    "Add Sessions": "/sessions.png",
    "Add Shifts": "/shifts.png",
    "Add Groups": "/groups.png",
    "Add Subjects": "/subjects.png",
    "Add Sections": "/sections.png",
    "Add Departments": "/departments.png",
    "Add Teachers": "/teachers.png",
    "Add Rooms": "/rooms.png",
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("token");
      if (!user) router.push("/");
    }
  }, [router]);

  const toggleExpand = (section) =>
    setExpanded(expanded === section ? null : section);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const advanceStep = (currentStepName) => {
    const currentIndex = nextSteps.indexOf(currentStepName);
    const next = nextSteps[currentIndex + 1];
    if (next && !steps.includes(next)) {
      setSteps([...steps, next]);
    }
  };

  const markStepComplete = (stepName) => {
    if (!completedSteps.includes(stepName)) {
      setCompletedSteps([...completedSteps, stepName]);
      setProgress((prev) => Math.min(prev + 12.5, 100));
    }
  };

  const handleSessionsSubmitted = (newSessions) => {
    setSessions(newSessions);
    advanceStep("Add Sessions");
    markStepComplete("Add Sessions");
  };

  const handleShiftsSubmitted = (newShifts) => {
    setShifts(newShifts);
    advanceStep("Add Shifts");
    markStepComplete("Add Shifts");
  };

  const handleGroupsSubmitted = (newGroups) => {
    setGroups(newGroups);
    advanceStep("Add Groups");
    markStepComplete("Add Groups");
  };

  const handleSubjectsSubmitted = (newSubjects) => {
    setSubjects(newSubjects);
    advanceStep("Add Subjects");
    markStepComplete("Add Subjects");
  };

  const handleSectionsSubmitted = (newSections) => {
    setSections(newSections);
    advanceStep("Add Sections");
    markStepComplete("Add Sections");
  };

  const handleDepartmentsSubmitted = (newDepartments) => {
    setDepartments(newDepartments);
    advanceStep("Add Departments");
    markStepComplete("Add Departments");
  };

  const handleTeachersSubmitted = (newTeachers) => {
    setTeachers(newTeachers);
    advanceStep("Add Teachers");
    markStepComplete("Add Teachers");
  };

  const handleRoomsSubmitted = (newRooms) => {
    setRooms(newRooms);
    advanceStep("Add Rooms");
    markStepComplete("Add Rooms");
  };

  return (
    <div className={styles.container}>
      {/* ==== SIDEBAR ==== */}
      <div className={styles.sidebar}>
        <img
          src="/ChatGPT Image Sep 13, 2025, 04_46_17 AM.png"
          alt="Logo"
          className={styles.logo}
        />
        <div className={styles.nav}>
          <button className={styles.navItem} onClick={() => router.push("/front")}>
            Home
          </button>
          <button className={styles.navItem}>About</button>

          <div className={styles.expandableSection}>
            <button className={styles.navItem} onClick={() => toggleExpand("settings")}>
              Settings
            </button>
            {expanded === "settings" && (
              <div className={styles.subMenu}>
                <button className={styles.subItem}>Configuration</button>
                <button className={styles.subItem} onClick={logout}>Logout</button>
              </div>
            )}
          </div>

          <div className={styles.expandableSection}>
            <button className={styles.navItem} onClick={() => toggleExpand("help")}>
              Help
            </button>
            {expanded === "help" && (
              <div className={styles.subMenu}>
                <button className={styles.subItem}>Contact Support</button>
                <button className={styles.subItem}>FAQs</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==== MAIN CONTENT ==== */}
      <div className={styles.main}>
        <div className={`${styles.scrollContent} ${styles.hiddenScrollbar}`}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{decodeURIComponent(timetable)}</h1>
            <button
              className={styles.statusBox}
              onClick={() => setShowProgressOverview(true)} // 🆕 Open overview
            >
              Current Progress: {progress}%
            </button>
          </div>

          <div className={styles.cardContainer}>
            {steps.map((label, index) => (
              <div key={index} className={styles.cardWrapper}>
                <button
                  className={styles.cardBtn}
                  onClick={() => {
                    if (label === "Add Sessions") setShowAddSession(true);
                    else if (label === "Add Shifts") setShowAddShift(true);
                    else if (label === "Add Groups") setShowAddGroup(true);
                    else if (label === "Add Subjects") setShowAddSubject(true);
                    else if (label === "Add Sections") setShowAddSection(true);
                    else if (label === "Add Departments") setShowAddDepartment(true);
                    else if (label === "Add Teachers") setShowAddTeacher(true);
                    else if (label === "Add Rooms") setShowAddRoom(true);
                  }}
                >
                  <img
                    src={stepIcons[label] || "/default.png"}
                    alt={label}
                    className={styles.addIcon}
                  />
                </button>
                <span className={styles.cardLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==== MODALS ==== */}
      {showAddSession && (
        <AddSessionModal
          onClose={() => setShowAddSession(false)}
          onSubmit={(newSessions) => {
            handleSessionsSubmitted(newSessions);
            setShowAddSession(false);
          }}
          sessions={sessions}
          setSessions={setSessions}
        />
      )}
      {showAddShift && (
        <AddShiftModal
          onClose={() => setShowAddShift(false)}
          onSubmit={(newShifts) => {
            handleShiftsSubmitted(newShifts);
            setShowAddShift(false);
          }}
          shifts={shifts}
          setShifts={setShifts}
        />
      )}
      {showAddGroup && (
        <AddGroupModal
          onClose={() => setShowAddGroup(false)}
          onSubmit={(newGroups) => {
            handleGroupsSubmitted(newGroups);
            setShowAddGroup(false);
          }}
          groups={groups}
          setGroups={setGroups}
          sessions={sessions}
        />
      )}
      {showAddSubject && (
        <AddSubjectModal
          onClose={() => setShowAddSubject(false)}
          onSubmit={(newSubjects) => {
            handleSubjectsSubmitted(newSubjects);
            setShowAddSubject(false);
          }}
          subjects={subjects}
          setSubjects={setSubjects}
          groups={groups}
          sessions={sessions}
        />
      )}
      {showAddSection && (
        <AddSectionModal
          onClose={() => setShowAddSection(false)}
          onSubmit={(newSections) => {
            handleSectionsSubmitted(newSections);
            setShowAddSection(false);
          }}
          sections={sections}
          setSections={setSections}
          sessions={sessions}
          groups={groups}
          shifts={shifts}
        />
      )}
      {showAddDepartment && (
        <AddDepartmentModal
          onClose={() => setShowAddDepartment(false)}
          onSubmit={(newDepartments) => {
            handleDepartmentsSubmitted(newDepartments);
            setShowAddDepartment(false);
          }}
          departments={departments}
          setDepartments={setDepartments}
        />
      )}
      {showAddTeacher && (
        <AddTeacherModal
          onClose={() => setShowAddTeacher(false)}
          onSubmit={(newTeachers) => {
            handleTeachersSubmitted(newTeachers);
            setShowAddTeacher(false);
          }}
          teachers={teachers}
          setTeachers={setTeachers}
          departments={departments}
        />
      )}
      {showAddRoom && (
        <AddRoomModal
          onClose={() => setShowAddRoom(false)}
          onSubmit={(newRooms) => {
            handleRoomsSubmitted(newRooms);
            setShowAddRoom(false);
          }}
          rooms={rooms}
          setRooms={setRooms}
        />
      )}

      {/* ==== PROGRESS OVERVIEW POPUP ==== */}
      {showProgressOverview && (
        <ProgressOverviewModal
          onClose={() => setShowProgressOverview(false)}
          data={{
            sessions,
            shifts,
            groups,
            subjects,
            sections,
            departments,
            teachers,
            rooms,
          }}
        />
      )}
    </div>
  );
}
