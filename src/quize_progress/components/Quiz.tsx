import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Lock,
  Crown,
} from "lucide-react";
import { useProgressStore } from "./store/progressStore";
import {
  generatePersonalizedFeedback,
  generateQuestionsForSubject,
} from "./lib/gemini";
import PDFUploader from "./PDFUploader";
import LoadingQuiz from "./LoadingQuiz";
import ChapterModal from "./ChapterModal";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from '@clerk/clerk-react';
import { SubscriptionPlan, hasFeatureAccess } from "../../utils/subscriptionUtils";

interface QuizProps {
  subject: string;
  grade: string;
}

export default function Quiz({ subject, grade }: QuizProps) {
  const {
    questions,
    topics,
    addQuizResult,
    updateQuestions,
    updateTopics,
    updateImprovementAreas,
  } = useProgressStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<
    { correct: boolean; questionIndex: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [waitUntillFeedback, setWaitUntilFeedback] = useState(false);
  const [open, setOpen] = useState(false);
  const [renderNewCreditValue, setRenderNewCreditValue] = useState(false);
  const [userEmail, setuserEmail] = useState<string | undefined>("");
  const [UserCurrentCredit, setUserCurrentCredit] = useState(0);
  const [userID, setuserID] = useState("");
  const [userCurrentPlan, setUserCurrentPlan] = useState<string>("free");
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  const { isSignedIn, user } = useUser();

  // Convert userCurrentPlan to the correct type for feature checks
  const userPlanType = userCurrentPlan as SubscriptionPlan;

  // Check feature access
  const canAccessDetailedAnalytics = hasFeatureAccess(userPlanType, 'detailed-quiz-analytics');

  useEffect(() => {
    getCurrentUserId();
    console.log("current user email:", user?.emailAddresses[0].emailAddress);
  }, [])

  useEffect(() => {
    // Fetch user's current plan
    const fetchUserPlan = async () => {
      if (isSignedIn && user) {
        try {
          const userEmail = user.emailAddresses[0]?.emailAddress;
          const response = await axios.get(`https://extreamx-backend.onrender.com/api/v1/onboard?email=${userEmail}`);
          const userData = response.data;
          const currentUserData = userData.find((user: { email: string; }) => user.email === userEmail);

          if (currentUserData && currentUserData.plan) {
            setUserCurrentPlan(currentUserData.plan);
          }
        } catch (error) {
          console.error("Error fetching user plan:", error);
        }
      }
    };

    fetchUserPlan();
  }, [isSignedIn, user])

  // get current user id
  const getCurrentUserId = () => {
    setuserEmail(user?.emailAddresses[0].emailAddress);
    axios
      .get(`https://extreamx-backend.onrender.com/api/v1/onboard?email=${userEmail}`)
      .then((response) => {
        const userData = response.data;
        console.log(userData[0].credit);
        setUserCurrentCredit(userData[0].credit);
        setuserID(userData[0]._id || null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const startQuiz = async (difficulty: string) => {
    console.log("subject: ", subject);
    console.log("from difficulty: ", difficulty);
    console.log("to difficulty: ", difficulty);
    if (!subject) {
      setError("Please select a subject first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsRetrying(false);

    try {
      const result = await generateQuestionsForSubject(subject, difficulty);
      console.log("this is the return from the QUESTION GENERATOR: ", result);
      updateQuestions(result.questions);
      updateTopics(result.topics);
      updateImprovementAreas(result.improvementAreas);
      setHasStarted(true);
      setRetryCount(0);
      setError(null);
      setShowChapterModal(false);

      // Update user credits after successful quiz generation
      if (userEmail && result.questions && userID) {
        try {
          // Determine credit cost based on difficulty level
          let creditCost = 0;
          
          switch(difficulty.toLowerCase()) {
            case 'easy':
              creditCost = 75; // Basic difficulty costs less
              break;
            case 'medium':
              creditCost = 125; // Medium difficulty
              break;
            case 'hard':
              creditCost = 200; // Hard difficulty costs more
              break;
            default:
              creditCost = 100; // Default cost
          }
          
          // Additional cost based on user's plan
          if (canAccessDetailedAnalytics) {
            // Premium users get more detailed analytics, which costs more
            creditCost += 50;
          }
          
          const response = await axios.put(
            `https://extreamx-backend.onrender.com/api/v1/onboard/credit/${userID}`,
            { tokensUsed: creditCost }
          );
          console.log("Quiz generation credits deducted:", creditCost);
          console.log("Updated credits:", response.data.remainingCredits);
          setRenderNewCreditValue(true);
        } catch (err) {
          console.log("Error updating credits:", err);
        }
      } else {
        console.log("Something went wrong with updating user credit!");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start quiz";
      setError(errorMessage);
      setHasStarted(false);
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  const handleRetry = async () => {
    if (retryCount >= 3) {
      setError("Maximum retry attempts reached. Please try again later.");
      return;
    }

    setRetryCount((prev) => prev + 1);
    setIsRetrying(true);
    setShowChapterModal(true);
  };

  const handleAnswer = async (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);

    const isCorrect = index === questions[currentQuestion].correctAnswer;
    const newAnswers = [
      ...answers,
      { correct: isCorrect, questionIndex: currentQuestion },
    ];
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      setWaitUntilFeedback(true);
      try {
        const personalizedFeedback = await generatePersonalizedFeedback(
          newAnswers,
          topics,
          subject
        );
        const score = newAnswers.filter((a) => a.correct).length;
        addQuizResult(subject, score, questions.length, personalizedFeedback);

        // Get user email
        const user_email = JSON.parse(
          localStorage.getItem("user_info") || "{}"
        );

        // Axios post request to send feedback info to the server
        await axios.post("https://extreamx-backend.onrender.com/api/v1/enhancement", {
          email: userEmail + "-" + uuidv4(),
          recommendations: personalizedFeedback.recommendations,
          strengths: personalizedFeedback.strengths,
          weaknesses: personalizedFeedback.weaknesses,
          subject: subject,
          score: score,
        });

        // Open the modal after successful feedback generation
        setOpen(true);
        // Show a success notification
        toast.success("Feedback generated successfully!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Failed to generate feedback:", error);
        // Show an error notification
        toast.error("Failed to generate feedback. Please try again.", {
          position: "top-center",
        });
      } finally {
        setWaitUntilFeedback(false); // Set to false after the process
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  if (isLoading) {
    return <LoadingQuiz />;
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          </div>
          {retryCount < 3 && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center space-y-4">
          <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Ready to start your {subject} quiz?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Test your knowledge in {subject} for {grade}
          </p>
          <button
            onClick={() => setShowChapterModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>

        <ChapterModal
          isOpen={showChapterModal}
          onClose={() => setShowChapterModal(false)}
          onStartQuiz={startQuiz}
          subject={subject}
          grade={grade}
        />
      </div>
    );
  }

  if (questions.length === 0) {
    return <PDFUploader />;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {progress.toFixed(0)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {questions[currentQuestion].text}
      </h3>

      <div className="space-y-3">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={showExplanation}
            className={`w-full p-4 text-left rounded-lg border transition-all ${selectedAnswer === index
              ? index === questions[currentQuestion].correctAnswer
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-800 dark:text-white">{option}</span>
              {showExplanation &&
                selectedAnswer === index &&
                (index === questions[currentQuestion].correctAnswer ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                ))}
            </div>
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200">
            {questions[currentQuestion].explanation}
          </p>
        </div>
      )}

      {showExplanation && currentQuestion < questions.length - 1 && (
        <button
          onClick={handleNext}
          className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next Question
        </button>
      )}

      {showExplanation && currentQuestion === questions.length - 1 && (
        <div className="mt-6 space-y-4">
          <button
            onClick={() => {
              // Logic to show results
            }}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show Results
          </button>

          {/* Detailed Analytics Button with Access Control */}
          <div className="relative">
            <button
              onClick={() => {
                if (canAccessDetailedAnalytics) {
                  setShowDetailedAnalytics(true);
                  // Logic to show detailed analytics
                } else {
                  // Redirect to subscription page
                  window.location.href = '/subscription';
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
            >
              View Detailed Analytics
              {!canAccessDetailedAnalytics && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-4 h-4 text-white" />
                </span>
              )}
              {userCurrentPlan === "premium" && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Crown className="w-4 h-4 text-amber-300" />
                </span>
              )}
            </button>

            {/* Tooltip for premium feature */}
            {!canAccessDetailedAnalytics && (
              <div className="absolute z-10 w-64 p-3 mt-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 pointer-events-none">
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Premium Feature</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Upgrade to Premium to access detailed quiz analytics and personalized learning insights.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer
        draggable
        pauseOnHover={true}
        autoClose={5000}
        transition={Bounce}
      />
    </div>
  );
}
