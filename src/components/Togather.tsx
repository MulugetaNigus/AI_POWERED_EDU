import React, { useState, useEffect } from "react";
import { HandHelping } from "lucide-react";
import img from '../Assets/99a6302b-5f45-466a-85e0-998ea41ec58d.png';


const Togather = () => {
    return (
        <>
            {/* main container */}
            <div className="flex items-center justfiy-between container mx-auto rounded-full p-12 mt-20 gap-10">
                {/* inner contents */}

                {/* left side */}
                <div className="">
                    <p className="text-7xl font-normal text-gray-600 dark:text-blue-500">
                        <span className="flex gap-4 text-8xl mb-4 font-extrabold text-blue-600 dark:text-blue-500">Togather</span>
                        {/* we find a new ways of learning new things !  */}
                        We Will Go Further !
                    </p>
                </div>

                {/* right side */}
                <div className="">
                    <img src={"https://img.freepik.com/premium-vector/leisure-time-isolated-cartoon-vector-illustrations-happy-students-having-leisure-time-coffee_107173-75430.jpg?uid=R110435962&ga=GA1.1.1909156352.1733350697"} alt="togather_image" width={1700} height={4000} />
                </div>
            </div>
        </>
    )
}

export default Togather;