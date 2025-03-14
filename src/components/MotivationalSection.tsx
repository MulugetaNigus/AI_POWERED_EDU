import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Brain, Target, Zap } from 'lucide-react';

const MotivationalSection = () => {
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerChildren = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const features = [
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Smart Learning",
            description: "AI-powered personalized learning paths"
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Clear Goals",
            description: "Structured learning objectives"
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Rich Content",
            description: "Comprehensive study materials"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Quick Progress",
            description: "Track your learning journey"
        }
    ];

    return (
        <div className="relative w-full min-h-screen bg-cover bg-center bg-fixed overflow-hidden"
            style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/top-view-modern-dark-office-desk-with-wireless-earphone-smart-watch-notebook-wireless-keyboard-copy-space_35674-7391.jpg?ga=GA1.1.1076471325.1701760909&semt=ais_siglip')" }}>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-[2px]"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 py-20">
                <motion.div
                    className="flex flex-col items-center justify-center text-center"
                    variants={staggerChildren}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    {/* Main Heading */}
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8"
                        variants={fadeInUp}
                    >
                        Empowering Your{' '}
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                            Future
                        </span>{' '}
                        through
                        <br />
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                            Innovative Learning
                        </span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl"
                        variants={fadeInUp}
                    >
                        Transform your educational journey with cutting-edge technology and personalized learning experiences
                    </motion.p>

                    {/* Features Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mb-12"
                        variants={staggerChildren}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300"
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                            >
                                <div className="text-blue-400 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg overflow-hidden"
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="relative z-10 flex items-center">
                            Start Your Journey
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default MotivationalSection;