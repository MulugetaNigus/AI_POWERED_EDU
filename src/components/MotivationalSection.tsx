import React from 'react';

const MotivationalSection = () => {
    return (
        <div className="relative w-full h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/top-view-modern-dark-office-desk-with-wireless-earphone-smart-watch-notebook-wireless-keyboard-copy-space_35674-7391.jpg?ga=GA1.1.1076471325.1701760909&semt=ais_siglip')" }}>
            <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
                <p className='text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold mx-4 md:mx-24 text-center' style={{ lineHeight: "100px" }}>
                    Empowering Your <span className='font-extrabold text-7xl text-red-600'>Future</span> through Innovative Learning <br /> Solutions!
                </p>
            </div>
        </div>
    );
};

export default MotivationalSection;