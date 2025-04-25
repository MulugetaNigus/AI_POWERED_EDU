import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Privacy Policy
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-gray-600 dark:text-gray-300">
            <p className="font-medium">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>

            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">Information We Collect</h4>
            <p>
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Personal Identification Information (Name, email address, etc.)</li>
              <li>Educational Background and Goals</li>
              <li>Usage Data (interactions with the platform, learning progress, feature usage)</li>
              <li>Communication Preferences</li>
              <li>Feedback and Survey Responses</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">How We Use Your Information</h4>
            <p>
              Your information is used to:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide, operate, and maintain our services</li>
              <li>Personalize and improve your learning experience</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you (updates, support, marketing)</li>
              <li>Understand and analyze how you use our services</li>
              <li>Prevent fraud and ensure security</li>
            </ul>

            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">AI Model Interaction Data</h4>
            <p>
              To continuously improve our AI-powered features and provide a better learning experience, we collect and analyze data related to your interactions with our AI models. This includes:
            </p>
            <ul className="list-disc list-inside space-y-1">
                <li>Questions you ask the AI</li>
                <li>The AI's responses</li>
                <li>Feedback you provide on AI interactions (e.g., ratings, corrections)</li>
            </ul>
            <p>
              This data is used solely for the purpose of tuning and enhancing the performance, accuracy, and safety of our AI models. We take steps to anonymize or aggregate this data where possible to protect your privacy. Your personal identification information is not directly used for model training unless explicitly stated and consented to for specific features.
            </p>

            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">Data Protection</h4>
            <p>
              We implement robust security measures (technical and organizational) to protect your data from unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">Your Rights</h4>
            <p>
              You have rights regarding your personal data, including:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>The right to access copies of your personal data.</li>
              <li>The right to request correction of inaccurate data.</li>
              <li>The right to request erasure of your personal data under certain conditions.</li>
              <li>The right to object to processing of your personal data under certain conditions.</li>
              <li>The right to data portability under certain conditions.</li>
            </ul>
            <p>
              To exercise these rights, please contact us.
            </p>

             <h4 className="text-lg font-semibold text-gray-800 dark:text-white mt-4 mb-2">Changes to This Policy</h4>
             <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
             </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end p-5 border-t border-gray-200 dark:border-gray-700 rounded-b">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-colors"
          >
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
}