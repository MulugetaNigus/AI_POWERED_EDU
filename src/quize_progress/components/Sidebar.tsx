import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  GraduationCap,
  BookOpen,
  BrainCircuit,
  Atom,
  BookText,
  Footprints,
  Calculator,
  Microscope,
  Languages,
  ArrowLeft, // Import ArrowLeft
} from "lucide-react";
import axios from "axios";

// Interface for course data from API
interface CourseData {
  _id: string;
  grade: string;
  courseName: string;
  accuracy: string;
  courseDescription: string;
  createdAt: string;
  updatedAt: string;
}

// Remove the static grades array since we'll fetch from API
const subjectIcons: Record<string, JSX.Element> = {
  Mathematics: <Calculator className="w-4 h-4" />,
  English: <Languages className="w-4 h-4" />,
  Science: <Microscope className="w-4 h-4" />,
  Biology: <BookOpen className="w-4 h-4" />,
  Physics: <Atom className="w-4 h-4" />,
  Chemistry: <BrainCircuit className="w-4 h-4" />,
  "Env't Science": <Microscope className="w-4 h-4" />,
  Amharic: <BookText className="w-4 h-4" />,
  Maths: <Calculator className="w-4 h-4" />,
  // Add more subject icons as needed
};

interface SidebarProps {
  selectedGrade: string;
  selectedSubject: string;
  onGradeSelect: (grade: string) => void;
  onSubjectSelect: (subject: string) => void;
}

export default function Sidebar({
  selectedGrade,
  selectedSubject,
  onGradeSelect,
  onSubjectSelect,
}: SidebarProps) {
  const [userGrade, setUserGrade] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the user's grade level from localStorage
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (user) {
      setUserGrade(user.user_grade_level);
    }

    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8888/api/v1/getAllCourses');
        if (response.data.message === 'success') {
          setCourses(response.data.data);
        }
        console.log(response.data.data);
      } catch (err) {
        setError('Failed to fetch courses');
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Group courses by grade
  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.grade]) {
      acc[course.grade] = [];
    }
    acc[course.grade].push(course);
    return acc;
  }, {} as Record<string, CourseData[]>);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-y-auto">
      <div className="p-4">
        {/* Link to Home Page */}
        <a href="/dashboard" className="flex items-center gap-2 text-xl font-bold mb-4 mt-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ArrowLeft className="w-5 h-5" /> {/* Add ArrowLeft icon */}
          <span>Learning Path</span>
        </a>
        <div className="space-y-2">
          {Object.entries(groupedCourses).map(
            ([grade, gradeSubjects]) =>
              // Only show subjects for user's grade
              userGrade === grade && (
                <div
                  key={grade}
                  className="rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => onGradeSelect(grade)}
                    className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
                      selectedGrade === grade
                        ? "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        : "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-medium">
                        Grade {grade}
                      </span>
                    </span>
                    {selectedGrade === grade ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {selectedGrade === grade && (
                    <div className="pl-4">
                      {gradeSubjects.map((subject) => (
                        <button
                          key={subject._id}
                          onClick={() => {
                            onSubjectSelect(subject.courseName);
                            console.log("selected subjects: ", subject.courseName);
                          }}
                          className={`w-full flex items-center gap-2 p-2 text-sm transition-colors ${
                            selectedSubject === subject.courseName
                              ? "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {subjectIcons[subject.courseName] || <BookText className="w-4 h-4" />}
                          <span>{subject.courseName}</span>
                          <span className="ml-auto text-xs text-gray-500">
                            {subject.accuracy}%
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
