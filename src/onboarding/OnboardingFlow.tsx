import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingLayout from './OnboardingLayout';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import { GraduationCap, Users, BookOpen, MapPin, Shield } from 'lucide-react';
import { setUncaughtExceptionCaptureCallback } from 'process';

interface FormData {
    grade: string;
    discovery: string;
    background: string;
    address: {
        street: string;
        city: string;
        country: string;
    };
    privacyPolicy: boolean;
}

const TOTAL_STEPS = 5;

export default function OnboardingFlow() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        grade: '',
        discovery: '',
        background: '',
        address: {
            street: '',
            city: '',
            country: '',
        },
        privacyPolicy: false,
    });
    const [usergrade, setusergrade] = useState('');
    const [usersource, setusersource] = useState('');
    const [userbackground, setuserbackground] = useState('');
    const [useraddress, setuseraddress] = useState('Ethiopia');
    const [userregion, setuserregion] = useState('');

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNext = () => {
        if (currentStep < TOTAL_STEPS - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit form and redirect
            navigate('/');
        }
    };

    const updateFormData = (field: keyof FormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // handle to send user onboadring info to db
    const handleFinish = () => {
        const userInfo = {
            grade: usergrade,
            source: usersource,
            background: userbackground,
            address: useraddress,
            region: userregion,
        };
        console.log(userInfo);
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                What grade are you in?
                            </h2>
                        </div>

                        {['Grade 6', 'Grade 8', 'Grade 12'].map((grade) => (
                            <button
                                key={grade}
                                onClick={() => {
                                    updateFormData('grade', grade);
                                    handleNext();
                                    console.log(grade);
                                    setusergrade(grade);
                                }}
                                className={`w-full p-4 text-left rounded-lg border transition-all ${formData.grade === grade
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                    }`}
                            >
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {grade}
                                </span>
                            </button>
                        ))}
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                How did you find us?
                            </h2>
                        </div>

                        {[
                            'Search Engine',
                            'Social Media',
                            'Friend Recommendation',
                            'School/Teacher',
                            'Other',
                        ].map((source) => (
                            <button
                                key={source}
                                onClick={() => {
                                    updateFormData('discovery', source);
                                    handleNext();
                                    console.log(source);
                                    setusersource(source);
                                }}
                                className={`w-full p-4 text-left rounded-lg border transition-all ${formData.discovery === source
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                    }`}
                            >
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {source}
                                </span>
                            </button>
                        ))}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Tell us about your background
                            </h2>
                        </div>

                        <textarea
                            value={formData.background}
                            onChange={(e) => { updateFormData('background', e.target.value); console.log(e.target.value); setuserbackground(e.target.value); }}
                            placeholder="What subjects interest you the most? What are your learning goals?"
                            className="w-full h-32 p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />

                        <button
                            onClick={handleNext}
                            disabled={!formData.background.trim()}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Where are you from?
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    contentEditable={false}
                                    value="Ethiopia"
                                    readOnly
                                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Select your region
                                </label>
                                {/* list of ethiopian regions */}
                                <select
                                    value={formData.address.street}
                                    onChange={(e) => {
                                        updateFormData('address', {
                                            ...formData.address,
                                            street: e.target.value,
                                        });
                                        console.log(e.target.value);
                                        setuserregion(e.target.value);
                                    }
                                    }
                                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">Select a region</option>
                                    <option value="Addis Ababa">Addis Ababa</option>
                                    <option value="Afar">Afar</option>
                                    <option value="Amhara">Amhara</option>
                                    <option value="Benishangul-Gumuz">Benishangul-Gumuz</option>
                                    <option value="Diredawa">Diredawa</option>
                                    <option value="Gambella">Gambella</option>
                                    <option value="Harari">Harari</option>
                                    <option value="Oromia">Oromia</option>
                                    <option value="Somali">Somali</option>
                                    <option value="Southern Nations, Nationalities, and Peoples">Southern Nations, Nationalities, and Peoples</option>
                                    <option value="Tigray">Tigray</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={
                                !formData.address.street.trim()
                                // !formData.address.city.trim()
                                // !formData.address.country.trim()
                            }
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Privacy Agreement
                            </h2>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400">
                            Before we finish, please review our privacy policy and agree to our terms.
                        </p>

                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="privacy"
                                checked={formData.privacyPolicy}
                                onChange={(e) => updateFormData('privacyPolicy', e.target.checked)}
                                className="mt-1"
                            />
                            <label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400">
                                I agree to the{' '}
                                <button
                                    onClick={() => setShowPrivacyPolicy(true)}
                                    className="text-blue-600 hover:underline"
                                >
                                    privacy policy
                                </button>{' '}
                                and consent to the processing of my personal data.
                            </label>
                        </div>

                        <button
                            onClick={() => handleFinish()}
                            disabled={!formData.privacyPolicy}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Complete Setup
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <OnboardingLayout
                currentStep={currentStep}
                totalSteps={TOTAL_STEPS}
                onBack={handleBack}
                showBack={currentStep > 0}
            >
                {renderStep()}
            </OnboardingLayout>

            <PrivacyPolicyModal
                isOpen={showPrivacyPolicy}
                onClose={() => setShowPrivacyPolicy(false)}
            />
        </>
    );
}