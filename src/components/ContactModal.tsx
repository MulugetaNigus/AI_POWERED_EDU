import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Loader2 } from "lucide-react";

const ContactModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendLoading, setsendLoading] = useState(false);

  // get the user email for pre poplited
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_info") || "{}");
    setEmail(user.email);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsendLoading(true);
    try {
      const user_cred = {
        email,
        message,
      };
      await axios
        .post("http://localhost:8888/api/v1/contact", user_cred)
        .then((result) => {
          console.log(result);
          alert("success !");
          setsendLoading(false);
          onClose();
        })
        .catch((err) => {
          setsendLoading(false);
          return console.log(err);
        });
    } catch (err) {
      setsendLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <h2 className="text-2xl font-extrabold font-['Poppins'] text-blue-400 mb-4">
              Contact Us !
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  // placeholder="Enter your email"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your message"
                  rows="4"
                />
              </div>
              <div className="flex justify-end">
                <button
                  disabled={sendLoading}
                  type="button"
                  onClick={onClose}
                  className="mr-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {sendLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ContactModal;
