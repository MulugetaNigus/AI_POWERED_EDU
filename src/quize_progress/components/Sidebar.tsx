import React from 'react';
import { 
  ChevronDown, ChevronRight, GraduationCap, 
  BookOpen, BrainCircuit, Atom, BookText, 
  Calculator, Microscope, Languages 
} from 'lucide-react';

const grades = [
  {
    grade: 'Grade 6',
    subjects: ['Mathematics', 'Science', 'English', 'Biology'],
    icon: <Calculator className="w-5 h-5" />
  },
  {
    grade: 'Grade 8',
    subjects: ['Mathematics', 'Physics', 'English', 'Biology'],
    icon: <Microscope className="w-5 h-5" />
  },
  {
    grade: 'Grade 12',
    subjects: ['Mathematics', 'Physics', 'English', 'Biology'],
    icon: <GraduationCap className="w-5 h-5" />
  }
];

const subjectIcons: Record<string, JSX.Element> = {
  Mathematics: <BrainCircuit className="w-4 h-4" />,
  Physics: <Atom className="w-4 h-4" />,
  Science: <Microscope className="w-4 h-4" />,
  English: <Languages className="w-4 h-4" />,
  Biology: <BookOpen className="w-4 h-4" />
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
  onSubjectSelect 
}: SidebarProps) {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Learning Path
        </h2>
        <div className="space-y-2">
          {grades.map((gradeData) => (
            <div key={gradeData.grade} className="rounded-lg overflow-hidden">
              <button
                onClick={() => onGradeSelect(gradeData.grade)}
                className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
                  selectedGrade === gradeData.grade
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  {gradeData.icon}
                  <span className="font-medium">{gradeData.grade}</span>
                </span>
                {selectedGrade === gradeData.grade ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {selectedGrade === gradeData.grade && (
                <div className="pl-4">
                  {gradeData.subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => onSubjectSelect(subject)}
                      className={`w-full flex items-center gap-2 p-2 text-sm transition-colors ${
                        selectedSubject === subject
                          ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {subjectIcons[subject]}
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}