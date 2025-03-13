import { motion } from "framer-motion";
import { Users, Rocket, ArrowRight } from "lucide-react";

const Togather = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-100/20 dark:bg-yellow-900/10 rounded-full blur-3xl" />
            </div>
            
            {/* Main container */}
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 shadow-xl dark:shadow-blue-900/5 relative overflow-hidden">
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl"></div>
                    
                    <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                        {/* Left side content */}
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Community Learning</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Together</span> We Will 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400"> Go Further!</span>
                            </h2>
                            
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
                                Join our vibrant community of learners and educators. Share knowledge, collaborate on challenging problems, and celebrate achievements together.
                            </p>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-1 mr-3">
                                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Connect with peers preparing for the same exams</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-1 mr-3">
                                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Participate in group study sessions and challenges</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-1 mr-3">
                                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">Learn from top performers and share your insights</p>
                                </div>
                            </div>
                            
                            <motion.button
                                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 group"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Join Our Community
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                        
                        {/* Right side image */}
                        <motion.div
                            className="flex-1 relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="relative z-10 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-xl rotate-1 transform hover:rotate-0 transition-transform duration-300">
                                <svg 
                                    viewBox="0 0 800 600" 
                                    className="w-full h-auto rounded-xl shadow-sm"
                                    style={{ minHeight: "300px" }}
                                >
                                    {/* Background */}
                                    <defs>
                                        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#f0f9ff" />
                                            <stop offset="100%" stopColor="#dbeafe" />
                                        </linearGradient>
                                        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
                                        </radialGradient>
                                    </defs>
                                    
                                    {/* Main background */}
                                    <rect width="100%" height="100%" fill="url(#bgGradient)" />
                                    <circle cx="400" cy="300" r="200" fill="url(#glowGradient)" />
                                    
                                    {/* Central platform/screen */}
                                    <rect x="300" y="200" width="200" height="150" rx="10" fill="#1e40af" />
                                    <rect x="310" y="210" width="180" height="130" rx="5" fill="#bfdbfe" />
                                    
                                    {/* Screen content */}
                                    <rect x="330" y="230" width="140" height="20" rx="3" fill="#60a5fa" />
                                    <rect x="330" y="260" width="80" height="10" rx="2" fill="#3b82f6" />
                                    <rect x="330" y="280" width="120" height="10" rx="2" fill="#3b82f6" />
                                    <rect x="330" y="300" width="100" height="10" rx="2" fill="#3b82f6" />
                                    
                                    {/* Student 1 - left */}
                                    <g transform="translate(150, 250)">
                                        {/* Device */}
                                        <rect x="0" y="30" width="100" height="70" rx="5" fill="#475569" />
                                        <rect x="5" y="35" width="90" height="60" rx="3" fill="#bfdbfe" />
                                        <rect x="40" y="100" width="20" height="5" rx="2" fill="#475569" />
                                        
                                        {/* Person */}
                                        <circle cx="50" cy="0" r="30" fill="#60a5fa" />
                                        <circle cx="50" cy="-10" r="12" fill="#eff6ff" />
                                        <rect x="35" y="0" width="30" height="40" rx="10" fill="#60a5fa" />
                                        
                                        {/* Connection line */}
                                        <path d="M100,50 Q150,100 300,250" stroke="#93c5fd" strokeWidth="3" strokeDasharray="5,5" fill="none" />
                                        
                                        {/* Thought bubble */}
                                        <circle cx="100" cy="-20" r="15" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" />
                                        <circle cx="120" cy="-30" r="10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" />
                                        <circle cx="135" cy="-35" r="5" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" />
                                    </g>
                                    
                                    {/* Student 2 - right */}
                                    <g transform="translate(550, 280)">
                                        {/* Device */}
                                        <rect x="0" y="30" width="100" height="70" rx="5" fill="#475569" />
                                        <rect x="5" y="35" width="90" height="60" rx="3" fill="#bfdbfe" />
                                        <rect x="40" y="100" width="20" height="5" rx="2" fill="#475569" />
                                        
                                        {/* Person */}
                                        <circle cx="50" cy="0" r="30" fill="#818cf8" />
                                        <circle cx="50" cy="-10" r="12" fill="#eff6ff" />
                                        <rect x="35" y="0" width="30" height="40" rx="10" fill="#818cf8" />
                                        
                                        {/* Connection line */}
                                        <path d="M0,50 Q-50,100 -250,250" stroke="#93c5fd" strokeWidth="3" strokeDasharray="5,5" fill="none" />
                                    </g>
                                    
                                    {/* Student 3 - bottom */}
                                    <g transform="translate(400, 450)">
                                        {/* Device */}
                                        <rect x="-50" y="0" width="100" height="70" rx="5" fill="#475569" />
                                        <rect x="-45" y="5" width="90" height="60" rx="3" fill="#bfdbfe" />
                                        <rect x="-10" y="70" width="20" height="5" rx="2" fill="#475569" />
                                        
                                        {/* Person */}
                                        <circle cx="0" cy="-30" r="30" fill="#34d399" />
                                        <circle cx="0" cy="-40" r="12" fill="#eff6ff" />
                                        <rect x="-15" y="-30" width="30" height="40" rx="10" fill="#34d399" />
                                        
                                        {/* Connection line */}
                                        <path d="M0,-30 Q0,-80 0,-100" stroke="#93c5fd" strokeWidth="3" strokeDasharray="5,5" fill="none" />
                                        
                                        {/* Chat bubble */}
                                        <rect x="40" y="-50" width="120" height="60" rx="20" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                                        <polygon points="40,-20 20,0 40,-10" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                                        <text x="100" y="-20" fontSize="12" textAnchor="middle" fill="#1e40af">Learning together!</text>
                                    </g>
                                    
                                    {/* Floating elements */}
                                    <g>
                                        {/* Books */}
                                        <rect x="100" y="150" width="40" height="50" rx="3" fill="#f472b6" />
                                        <rect x="105" y="155" width="30" height="5" fill="#eff6ff" />
                                        <rect x="105" y="165" width="20" height="5" fill="#eff6ff" />
                                        
                                        <rect x="90" y="160" width="40" height="50" rx="3" fill="#a78bfa" transform="rotate(-10)" />
                                        <rect x="95" y="165" width="30" height="5" fill="#eff6ff" transform="rotate(-10)" />
                                        <rect x="95" y="175" width="20" height="5" fill="#eff6ff" transform="rotate(-10)" />
                                        
                                        {/* Calculator */}
                                        <rect x="650" y="150" width="50" height="70" rx="5" fill="#1e293b" />
                                        <rect x="655" y="155" width="40" height="20" rx="2" fill="#94a3b8" />
                                        <g transform="translate(655, 180)">
                                            <rect x="0" y="0" width="10" height="10" rx="1" fill="#e2e8f0" />
                                            <rect x="15" y="0" width="10" height="10" rx="1" fill="#e2e8f0" />
                                            <rect x="30" y="0" width="10" height="10" rx="1" fill="#e2e8f0" />
                                            <rect x="0" y="15" width="10" height="10" rx="1" fill="#e2e8f0" />
                                            <rect x="15" y="15" width="10" height="10" rx="1" fill="#e2e8f0" />
                                            <rect x="30" y="15" width="10" height="10" rx="1" fill="#e2e8f0" />
                                            <rect x="0" y="30" width="10" height="10" rx="1" fill="#e2e8f0" />
                                            <rect x="15" y="30" width="10" height="10" rx="1" fill="#e2e8f0" />
                                            <rect x="30" y="30" width="10" height="10" rx="1" fill="#e2e8f0" />
                                        </g>
                                        
                                        {/* Light bulb */}
                                        <circle cx="700" cy="400" r="25" fill="#fcd34d" />
                                        <path d="M700,425 L700,450" stroke="#fcd34d" strokeWidth="8" strokeLinecap="round" />
                                        <path d="M685,450 L715,450" stroke="#fcd34d" strokeWidth="5" strokeLinecap="round" />
                                        
                                        {/* Atom */}
                                        <g transform="translate(150, 450)">
                                            <circle cx="0" cy="0" r="5" fill="#3b82f6" />
                                            <ellipse cx="0" cy="0" rx="30" ry="10" fill="none" stroke="#3b82f6" strokeWidth="2" transform="rotate(0)" />
                                            <ellipse cx="0" cy="0" rx="30" ry="10" fill="none" stroke="#3b82f6" strokeWidth="2" transform="rotate(60)" />
                                            <ellipse cx="0" cy="0" rx="30" ry="10" fill="none" stroke="#3b82f6" strokeWidth="2" transform="rotate(120)" />
                                        </g>
                                    </g>
                                    
                                    {/* Animated elements */}
                                    <g>
                                        <circle cx="200" cy="100" r="8" fill="#f472b6">
                                            <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="600" cy="150" r="10" fill="#60a5fa">
                                            <animate attributeName="cy" values="150;140;150" dur="4s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="300" cy="500" r="12" fill="#34d399">
                                            <animate attributeName="cy" values="500;490;500" dur="3.5s" repeatCount="indefinite" />
                                        </circle>
                                        <circle cx="500" cy="450" r="7" fill="#fcd34d">
                                            <animate attributeName="cy" values="450;440;450" dur="2.5s" repeatCount="indefinite" />
                                        </circle>
                                    </g>
                                </svg>
                                
                                {/* Floating elements */}
                                <motion.div 
                                    className="absolute -top-6 -right-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 shadow-lg"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Rocket className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                </motion.div>
                                
                                <motion.div 
                                    className="absolute -bottom-4 -left-4 bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 py-1 shadow-lg"
                                    animate={{ y: [0, 8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                >
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">1,000+ active students</span>
                                </motion.div>
                            </div>
                            
                            {/* Background blur effect */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/5 dark:to-purple-400/5 rounded-full blur-3xl -z-10"></div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Togather;