import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import axios from 'axios';
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
    groupName: string;
    groupDescription: string;
    groupMember: string;
    groupCreator: string | undefined;
}

const CreateGroupForm: React.FC = () => {

    // get the current user id
    const { user } = useUser();

    const [formData, setFormData] = useState<FormData>({
        groupName: '',
        groupDescription: '',
        groupMember: "0",
        groupCreator: user?.emailAddresses[0].emailAddress
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | undefined | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};
        if (!formData.groupName.trim()) {
            newErrors.groupName = 'Group name is required';
        }
        if (!formData.groupDescription.trim()) {
            newErrors.groupDescription = 'Group description is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append('groupName', formData.groupName);
        formDataToSend.append('groupDescription', formData.groupDescription);
        formDataToSend.append('groupMember', "0");
        formDataToSend.append('groupCreator', user?.emailAddresses[0].emailAddress as string);


        try {
            const response = await axios.post('https://extreamx-backend.onrender.com/api/v1/upload', {
                groupName: formData.groupName,
                groupDescription: formData.groupDescription,
                groupMember: "0",
                groupCreator: user?.emailAddresses[0].emailAddress,
                profilePicture: selectedImage,
                approval: false,
                members: []
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response) {
                throw new Error('Failed to submit form');
            }

            const result = response;
            console.log('Form submitted successfully:', result);
            toast.success("success, wait untill approval!", {
                position: "top-center",
            });
            formData.groupName = "";
            formData.groupDescription = "";
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
            <div className="p-8">
                <div className='flex items-center justify-between'>
                    <h2 className="text-2xl font-semibold dark:text-white text-gray-800 mb-6">Create a New Group</h2>
                    <div className='flex items-center justify-center gap-5'>
                        <img src={selectedImage} alt="profile-picture" width={60} height={60} />
                        <div className='flex flex-col'>
                            <p className='text-indigo-700 text-xl font-bold'>{formData.groupName}</p>
                            <p className='small text-gray-700'>{user?.emailAddresses[0].emailAddress as string}</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="groupName" className="block text-sm font-medium dark:text-white text-gray-700">
                            Group Name
                        </label>
                        <input
                            type="text"
                            id="groupName"
                            name="groupName"
                            value={formData.groupName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 dark:bg-gray-700 bg-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.groupName && <p className="mt-1 text-sm text-red-600">{errors.groupName}</p>}
                    </div>

                    <div>
                        <label htmlFor="groupDescription" className="block text-sm font-medium dark:text-white text-gray-700">
                            Group Description
                        </label>
                        <textarea
                            id="groupDescription"
                            name="groupDescription"
                            rows={3}
                            value={formData.groupDescription}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 dark:bg-gray-700 bg-white border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                        {errors.groupDescription && <p className="mt-1 text-sm text-red-600">{errors.groupDescription}</p>}
                    </div>

                    <div>
                        <label htmlFor="" className="block text-sm font-medium dark:text-white text-gray-700">
                            Choose a Profile Picture
                        </label>
                        <div className='flex gap-14 mt-5'>
                            <img src="https://cdn-icons-png.freepik.com/256/18448/18448227.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/18448/18448227.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                            <img src="https://cdn-icons-png.freepik.com/256/3976/3976555.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/3976/3976555.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                            <img src="https://cdn-icons-png.freepik.com/256/8881/8881823.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/8881/8881823.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                            <img src="https://cdn-icons-png.freepik.com/256/3976/3976631.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/3976/3976631.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                            <img src="https://cdn-icons-png.freepik.com/256/16682/16682288.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/16682/16682288.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                        </div>
                        <div className='flex gap-14 mt-8'>
                            <img src="https://cdn-icons-png.freepik.com/256/4207/4207253.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/4207/4207253.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                            <img src="https://cdn-icons-png.freepik.com/256/5221/5221784.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/5221/5221784.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                            <img src="https://cdn-icons-png.freepik.com/256/15113/15113073.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/15113/15113073.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                            <img src="https://cdn-icons-png.freepik.com/256/12770/12770615.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/12770/12770615.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                            <img src="https://cdn-icons-png.freepik.com/256/6041/6041341.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid"
                                alt="profile_one" width={60} height={60} className='cursor-pointer'
                                onClick={() => setSelectedImage("https://cdn-icons-png.freepik.com/256/6041/6041341.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid")}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                            transition easy-out duration-125
                            "
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin w-6 h-6" />
                            ) : (
                                'Create Group'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer
                draggable
                pauseOnHover={true}
                autoClose={2000}
                transition={Bounce}
            />
        </div>
    );
};

export default CreateGroupForm;