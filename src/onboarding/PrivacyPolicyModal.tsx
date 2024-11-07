import React from 'react';
import { X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Privacy Policy
            </h3>

            <div className="prose dark:prose-invert max-w-none">
              <p>
                We are committed to protecting your privacy and personal data. This privacy policy explains how we collect, use, and protect your information.
              </p>

              <h4>Information We Collect</h4>
              <p>
                We collect information that you provide directly to us, including:
              </p>
              <ul>
                <li>Name and contact information</li>
                <li>Educational background</li>
                <li>Usage data and learning progress</li>
                <li>Communication preferences</li>
              </ul>

              <h4>How We Use Your Information</h4>
              <p>
                We use your information to:
              </p>
              <ul>
                <li>Personalize your learning experience</li>
                <li>Improve our educational content and services</li>
                <li>Communicate with you about your progress</li>
                <li>Provide technical support</li>
              </ul>

              <h4>Data Protection</h4>
              <p>
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </p>

              <h4>Your Rights</h4>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}