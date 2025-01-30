import React from 'react';

const Modal = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
        <h2 className="text-2xl font-bold mb-4 dark:text-white text-white">Answer Detail</h2>
        <p className="mb-4 dark:text-gray-300 text-white text-base">{content}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-white text-gray-700 w-full rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
