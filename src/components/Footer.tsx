import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import ContactModal from './ContactModal'; // Import the ContactModal component

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">ExtreamX</h3>
            <p className="text-gray-400">
              Empowering Ethiopian students to achieve academic excellence through AI-powered learning.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Subjects</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">AI Tutoring</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                support@ethiolearn.com
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                +251 11 234 5678
              </li>
              <li>
                <p onClick={toggleModal} className="mt-5 text-white transition easy-out duration-120 cursor-pointer w-2/6 hover:bg-blue-600 border border-blue-700 bg-blue-700 p-2 rounded">
                  Contact Us
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} EthioLearn. All rights reserved.</p>
        </div>
      </div>
      <ContactModal isOpen={isModalOpen} onClose={toggleModal} />
    </footer>
  );
}
