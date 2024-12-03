import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  Loader2,
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
  const [open, setOpen] = useState(true);
  const [renderNewCreditValue, setRenderNewCreditValue] = useState(false);

  const startQuiz = async (startChapter: number, endChapter: number) => {
    console.log("subject: ", subject);
    console.log("from chapter: ", startChapter);
    console.log("to: ", endChapter);
    if (!subject) {
      setError("Please select a subject first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsRetrying(false);

    try {
      const result = await generateQuestionsForSubject(
        subject
        // startChapter,
        // endChapter
      );
      updateQuestions(result.questions);
      updateTopics(result.topics);
      updateImprovementAreas(result.improvementAreas);
      setHasStarted(true);
      setRetryCount(0);
      setError(null);
      setShowChapterModal(false);

      // Update user credits after successful quiz generation
      const user = JSON.parse(localStorage.getItem("user_info") || "{}");
      if (user.email) {
        try {
          const response = await axios.put(`http://localhost:8888/api/v1/onboard/credit/${user.email}`);
          console.log("Updated credits:", response.data.remainingCredits);
          setRenderNewCreditValue(true);
        } catch (err) {
          console.log("Error updating credits:", err);
        }
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
          topics
        );
        const score = newAnswers.filter((a) => a.correct).length;
        addQuizResult(subject, score, questions.length, personalizedFeedback);

        // Get user email
        const user_email = JSON.parse(
          localStorage.getItem("user_info") || "{}"
        );

        // Axios post request to send feedback info to the server
        await axios.post("http://localhost:8888/api/v1/enhancement", {
          email: user_email.email + "-" + uuidv4(),
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
            className={`w-full p-4 text-left rounded-lg border transition-all ${
              selectedAnswer === index
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

      {waitUntillFeedback && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          className="relative z-10"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
              >
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold text-gray-900"
                      >
                        Generating Personalized Feedback...
                      </DialogTitle>
                      <div className="mt-2">
                        {waitUntillFeedback ? (
                          <p className="flex items-center text-gray-600">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                            Please wait while we generate your personalized
                            feedback
                          </p>
                        ) : (
                          <p className="text-gray-600">
                            Personalized feedback generated successfully
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    disabled={waitUntillFeedback}
                    type="button"
                    data-autofocus
                    onClick={() => {
                      setOpen(false);
                      setWaitUntilFeedback(false); // Reset feedback wait state if necessary
                    }}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Finish
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
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
