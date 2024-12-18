import { motion } from "framer-motion";

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
                    <p className="text-7xl font-normal text-gray-600 dark:text-blue-500 relative">
                        <span className="flex gap-4 text-8xl mb-4 font-extrabold text-blue-600 dark:text-blue-500">
                            Togather
                        </span>
                        We Will Go Further!
                    </p>
                    <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
                        Join us on a journey to discover new ways of learning and growing together!
                    </p>
                </motion.div>

                {/* Right side with blur and mirror effect */}
                <motion.div
                    className="flex justify-center relative"
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
                    <span className="absolute inset-0 opacity-30 transform -translate-y-1/4 blur-md">
                        <img
                            src={"https://img.freepik.com/premium-vector/leisure-time-isolated-cartoon-vector-illustrations-happy-students-having-leisure-time-coffee_107173-75430.jpg?uid=R110435962&ga=GA1.1.1909156352.1733350697"}
                            alt="Happy students enjoying leisure time"
                            className="rounded-lg"
                            width={700}
                            height={400}
                        />
                    </span>
                </motion.div>
            </div>
        </>
    );
}

export default Togather;