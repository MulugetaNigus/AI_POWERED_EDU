import React from 'react';

const MotivationalSection = () => {
    return (
        <div className="relative w-full h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/blue-office-supplies-copy-space_1235831-198678.jpg?ga=GA1.1.1076471325.1701760909&semt=ais_hybrid')" }}>
            <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50">
                <p className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold mx-4 md:mx-24 text-center'>
                    Empowering Your <span className='font-extrabold'>Future</span> through Innovative Learning <br /> Solutions!
                </p>
            </div>
        </div>
    );
};

export default MotivationalSection;