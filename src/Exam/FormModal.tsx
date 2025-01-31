import React, { useState } from "react";

const FormModal = ({ isOpen, onClose, onSubmit }) => {
  const [subject, setSubject] = useState("");
  const [period, setPeriod] = useState("");

  const subjects = ["Mathematics", "Physics", "Biology", "Chemistry", "History", "Computer Science"];
  const periods = ["2020", "2021", "2022", "2023", "2024"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ subject, period });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="p-6 rounded-lg shadow-xl transform transition-all w-3/6">
        <div className="p-6 rounded-lg">
          
          <h2 className="text-2xl mb-6 text-white font-normal dark:text-white text-center">
            Select Exam Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Selection */}
            <div>
              <label className="block text-white dark:text-gray-300 font-semibold mb-2">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a Subject</option>
                {subjects.map((subj, index) => (
                  <option key={index} value={subj}>
                    {subj}
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Period Selection */}
            <div>
              <label className="block text-white dark:text-gray-300 font-semibold mb-2">Exam Period (Year)</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a Year</option>
                {periods.map((yr, index) => (
                  <option key={index} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-red-400 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-white text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
              >
                Start Exam
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
