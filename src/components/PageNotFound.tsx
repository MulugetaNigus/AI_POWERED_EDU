import React, { useEffect } from 'react';

const PageNotFound = () => {

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
            {/* Container */}
            <div className="text-center">
                {/* 404 Text */}
                {/* <h1 className="text-9xl font-bold text-indigo-600">404</h1> */}
                <img
                    src="https://img.freepik.com/free-vector/404-error-with-person-looking-concept-illustration_114360-7912.jpg?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                    alt="404 Illustration"
                    className="w-100 h-80 mx-auto"
                />
                {/* https://img.freepik.com/free-vector/404-error-isometric-illustration_23-2148509538.jpg?semt=ais_hybrid */}
                {/* Message */}
                <p className="text-2xl font-medium mt-4">Oops! Page not found.</p>
                <p className="mt-2 text-gray-600">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                {/* Back to Home Link */}
                <a
                    href="/"
                    className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                    Back to Home
                </a>
            </div>
        </div>
    );
};

export default PageNotFound;