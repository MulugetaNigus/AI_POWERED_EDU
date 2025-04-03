import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, Heart, ArrowRight, Globe, BookOpen } from 'lucide-react';
import ContactModal from './ContactModal';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const { isSignedIn } = useUser();

  const toggleModal = () => {
    if (!isSignedIn) {
      return alert("Please sign in first");
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscriptionStatus('Please enter a valid email address');
      toast.error('Please enter a valid email address', {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: () => {
          setTimeout(() => {
            toast.dismiss();
          }, 3000);
        }
      });
      return;
    }
    
    setIsSubmitting(true);
    setSubscriptionStatus('');
    
    try {
      const response = await fetch('http://localhost:8888/api/v1/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setEmail('');
        setSubscriptionStatus('Successfully subscribed!');
        toast.success('Successfully subscribed to our newsletter!', {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          // auto close after 3 seconds
          onClose: () => {
            setTimeout(() => {
              toast.dismiss();
            }, 3000);
          }
        });
      } else {
        const data = await response.json();
        setSubscriptionStatus(data.message || 'Failed to subscribe. Please try again.');
        toast.error(data.message || 'Failed to subscribe. Please try again.', {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          onClose: () => {
            setTimeout(() => {
              toast.dismiss();
            }, 3000);
          }
        });
      }
    } catch (error) {
      setSubscriptionStatus('Network error. Please try again later.');
      toast.error('Network error. Please try again later.', {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: () => {
          setTimeout(() => {
            toast.dismiss();
          }, 3000);
        }
      });
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerLinks = [
    { title: 'Quick Links', links: [
      { name: 'Home', href: '/' },
      { name: 'Features', href: '#features' },
      { name: 'Subjects', href: '#subjects' },
      { name: 'AI Assistance', href: '/dashboard' },
    ]},
    { title: 'Resources', links: [
      { name: 'Blog', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '/community' },
      { name: 'Exam Prep', href: '/exam' },
    ]},
    { title: 'Legal', links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ]},
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600 dark:hover:text-blue-400' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400 dark:hover:text-blue-300' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600 dark:hover:text-pink-400' },
    { name: 'Website', icon: Globe, href: '#', color: 'hover:text-green-600 dark:hover:text-green-400' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl" />
      </div>
      
      {/* Newsletter section */}
      <div className="relative border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Stay Updated</h3>
                <p className="text-gray-400 max-w-md">
                  Subscribe to our newsletter for the latest updates, tips, and educational resources.
                </p>
              </div>
              
              <div className="w-full md:w-auto">
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white w-full sm:w-64"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <motion.button 
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </motion.button>
                </form>
                {subscriptionStatus && (
                  <p className={`mt-2 text-sm ${subscriptionStatus.includes('Success') ? 'text-green-400' : 'text-red-400'}`}>
                    {subscriptionStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">
                Extream<span className="text-blue-400">X</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering Ethiopian students to achieve academic excellence through AI-powered learning. Our platform is designed to help you prepare for national entrance exams with confidence.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className={`transition-colors duration-200 text-gray-400 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold text-white mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center"
                    >
                      <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">•</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Contact section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                support@ExtreamX.com
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                +251 9xxxxxxxx
              </li>
              <li>
                <motion.button
                  onClick={toggleModal}
                  className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="flex items-center justify-center text-gray-500">
            &copy; {new Date().getFullYear()} ExtreamX {" "}|{" "} All rights reserved. 
            <span className="ml-2 flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> in Ethiopia
            </span>
          </p>
        </div>
      </div>
      <ContactModal isOpen={isModalOpen} onClose={toggleModal} />
    </footer>
  );
}
