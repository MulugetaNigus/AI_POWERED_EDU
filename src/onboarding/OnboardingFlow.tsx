import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "./OnboardingLayout";
import PrivacyPolicyModal from "./PrivacyPolicyModal";
import {
  GraduationCap,
  Users,
  BookOpen,
  MapPin,
  Shield,
  Loader2,
  MessageCircleWarning,
  Lightbulb,
  Clock,
  Target,
  Laptop
} from "lucide-react";
import axios from "axios";
import { useUser } from '@clerk/clerk-react';

interface FormData {
  grade: string;
  discovery: string;
  background: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  learningStyle: string;
  studyTime: string;
  goals: string;
  deviceAccess: string[];
  privacyPolicy: boolean;
}

const TOTAL_STEPS = 10;

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    grade: "",
    discovery: "",
    background: "",
    address: {
      street: "",
      city: "",
      country: "",
    },
    learningStyle: "",
    studyTime: "",
    goals: "",
    deviceAccess: [],
    privacyPolicy: false,
  });
  const [userEmail, setuserEmail] = useState<string | undefined>("");
  const [usergrade, setusergrade] = useState("");
  const [usersource, setusersource] = useState("");
  const [userbackground, setuserbackground] = useState("");
  const [useraddress] = useState("Ethiopia");
  const [userregion, setuserregion] = useState("");
  const [userLearningStyle, setUserLearningStyle] = useState("");
  const [userStudyTime, setUserStudyTime] = useState("");
  const [userGoals, setUserGoals] = useState("");
  const [userDeviceAccess, setUserDeviceAccess] = useState<string[]>([]);
  const [TrackError, setTrackError] = useState(false);
  const [saveOnBoardingLoading, setsaveOnBoardingLoading] = useState(false);

  // get the user email for pre-populated
  const { user } = useUser();

  useEffect(() => {
    if (user?.emailAddresses && user.emailAddresses.length > 0) {
      setuserEmail(user.emailAddresses[0].emailAddress);
    }
  }, [user]);

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
      navigate("/");
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle device access selection
  const toggleDeviceAccess = (device: string) => {
    setUserDeviceAccess(prev => {
      if (prev.includes(device)) {
        return prev.filter(d => d !== device);
      } else {
        return [...prev, device];
      }
    });
    
    setFormData(prev => ({
      ...prev,
      deviceAccess: userDeviceAccess.includes(device) 
        ? prev.deviceAccess.filter(d => d !== device)
        : [...prev.deviceAccess, device]
    }));
  };

  // handle to send user onboadring info to db
  const handleFinish = async () => {
    setsaveOnBoardingLoading(true);
    const userInfo = {
      email: user?.emailAddresses[0].emailAddress || "",
      grade: usergrade,
      source: usersource,
      background: userbackground,
      address: useraddress,
      region: userregion,
      learningStyle: userLearningStyle,
      studyTime: userStudyTime,
      goals: userGoals,
      deviceAccess: userDeviceAccess,
      plan: "free",
      credit: 2500
    };
    console.log(userInfo);
    await axios
      .post("http://localhost:8888/api/v1/onboard", userInfo)
      .then(async (result) => {
        setsaveOnBoardingLoading(false);
        console.log(result);
        // alert("success !");
        // after sending user data to the db, set localStorage oprations and redirect to home page
        // Save the user login data into localstroage and parse it and in order to use as a user variable
        // const user = JSON.parse(localStorage.getItem("user_info") || "{}");
        // console.log(users);

        // get user_info from localstorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            user_grade_level: usergrade,
            uid: user?.id,
            email: userEmail,
            learning_style: userLearningStyle,
            study_time: userStudyTime,
            goals: userGoals,
            // profile: user.photoURL,
            // Add any other user data you want to store
          })
        );
        // Get the JWT token
        const token = user?.id;

        // Store the token in local storage
        localStorage.setItem("token", token as string);
        localStorage.setItem("ONBOARDINGSTATE", "somevaluehere");
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        setsaveOnBoardingLoading(false);
        setTrackError(true);
        return console.log(err);
      });
  };

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

            <div className="grid grid-cols-1 gap-3">
              {["Grade 6", "Grade 8", "Grade 12"].map((grade) => (
                <button
                  key={grade}
                  onClick={() => {
                    const gradeValue = grade.toLowerCase().replace(" ", "");
                    updateFormData("grade", gradeValue);
                    handleNext();
                    console.log(gradeValue);
                    setusergrade(gradeValue);
                  }}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    formData.grade === grade.toLowerCase().replace(" ", "")
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {grade}
                  </span>
                </button>
              ))}
            </div>
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

            <div className="grid grid-cols-1 gap-3">
              {[
                "Search Engine",
                "Social Media",
                "Friend Recommendation",
                "School/Teacher",
                "Other",
              ].map((source) => (
                <button
                  key={source}
                  onClick={() => {
                    updateFormData("discovery", source);
                    handleNext();
                    console.log(source);
                    setusersource(source);
                  }}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    formData.discovery === source
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {source}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                What's your learning style?
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                "Visual (learn best with images, videos, diagrams)",
                "Auditory (learn best by listening and discussing)",
                "Reading/Writing (learn best by reading and taking notes)",
                "Kinesthetic (learn best through hands-on activities)",
                "Mixed/Not Sure"
              ].map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    updateFormData("learningStyle", style);
                    handleNext();
                    setUserLearningStyle(style);
                  }}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    formData.learningStyle === style
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {style}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                When do you usually study?
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                "Early morning (5am-8am)",
                "Morning (8am-12pm)",
                "Afternoon (12pm-5pm)",
                "Evening (5pm-9pm)",
                "Late night (9pm-12am)",
                "Varies day to day"
              ].map((time) => (
                <button
                  key={time}
                  onClick={() => {
                    updateFormData("studyTime", time);
                    handleNext();
                    setUserStudyTime(time);
                  }}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    formData.studyTime === time
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                What are your educational goals?
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                "Improve grades in specific subjects",
                "Prepare for national exams",
                "Develop better study habits",
                "Learn advanced topics beyond curriculum",
                "Other"
              ].map((goal) => (
                <button
                  key={goal}
                  onClick={() => {
                    updateFormData("goals", goal);
                    handleNext();
                    setUserGoals(goal);
                  }}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    formData.goals === goal
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {goal}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Laptop className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                What devices do you use for learning?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Select all that apply
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                "Smartphone",
                "Laptop/Desktop",
                "Tablet",
                "School computer",
                "Other"
              ].map((device) => (
                <button
                  key={device}
                  onClick={() => toggleDeviceAccess(device)}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    userDeviceAccess.includes(device)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {device}
                    </span>
                    {userDeviceAccess.includes(device) && (
                      <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={userDeviceAccess.length === 0}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tell us your expectation about ExtreamX
              </h2>
            </div>

            <textarea
              value={formData.background}
              onChange={(e) => {
                updateFormData("background", e.target.value);
                console.log(e.target.value);
                setuserbackground(e.target.value);
              }}
              placeholder="I will expect from Extreamx..."
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

      case 7:
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
                    updateFormData("address", {
                      ...formData.address,
                      street: e.target.value,
                    });
                    console.log(e.target.value);
                    setuserregion(e.target.value);
                  }}
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
                  <option value="Southern Nations, Nationalities, and Peoples">
                    Southern Nations, Nationalities, and Peoples
                  </option>
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

      case 8:
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
              Before we finish, please review our privacy policy and agree to
              our terms.
            </p>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy"
                checked={formData.privacyPolicy}
                onChange={(e) =>
                  updateFormData("privacyPolicy", e.target.checked)
                }
                className="mt-1"
              />
              <label
                htmlFor="privacy"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                I agree to the{" "}
                <button
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-blue-600 hover:underline"
                >
                  privacy policy
                </button>{" "}
                and consent to the processing of my personal data.
              </label>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.privacyPolicy}
              className="flex items-center justify-center w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              You're All Set!
            </h2>
            
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Thank you for completing your profile. We're excited to personalize your learning experience!
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">What's next?</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                <li>Explore personalized learning resources</li>
                <li>Connect with other students in your grade</li>
                <li>Try our AI-powered study assistant</li>
                <li>Track your progress with detailed analytics</li>
              </ul>
            </div>

            <button
              onClick={() => handleFinish()}
              className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              {saveOnBoardingLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Complete Setup and Get Started"
              )}
            </button>
            
            {/* Error notification */}
            {TrackError && (
              <div className="flex border-1 border-red-500 bg-red-500 rounded-md p-3 mt-4">
                <p className="flex gap-3 text-sm text-gray-100 font-normal">
                  An error occurred, please try again{" "}
                  <button style={{ textDecoration: "underline" }} onClick={handleFinish}>here</button>
                  <MessageCircleWarning className="w-5 h-5" />
                </p>
              </div>
            )}
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
