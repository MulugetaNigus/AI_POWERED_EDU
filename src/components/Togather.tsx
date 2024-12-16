import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import img from '../Assets/99a6302b-5f45-466a-85e0-998ea41ec58d.png';

const Togather = () => {
    return (
        <>
            {/* Main container */}
            <div className="flex items-center justify-between container mx-auto rounded-lg p-12 mt-20 mb-20 gap-10 bg-white dark:bg-gray-800 transition-all duration-300">
                {/* Inner contents */}

                {/* Left side */}
                <motion.div
                    className="flex flex-col"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-7xl font-normal text-gray-600 dark:text-blue-500">
                        <span className="flex gap-4 text-8xl mb-4 font-extrabold text-blue-600 dark:text-blue-500">Togather</span>
                        We Will Go Further!
                    </p>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
                        Join us on a journey to discover new ways of learning and growing together!
                    </p>
                </motion.div>

                {/* Right side */}
                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <img 
                        src={"https://img.freepik.com/premium-vector/leisure-time-isolated-cartoon-vector-illustrations-happy-students-having-leisure-time-coffee_107173-75430.jpg?uid=R110435962&ga=GA1.1.1909156352.1733350697"} 
                        alt="Happy students enjoying leisure time" 
                        className="rounded-lg" 
                        width={700} 
                        height={400} 
                    />
                </motion.div>
            </div>
        </>
    );
}

export default Togather;