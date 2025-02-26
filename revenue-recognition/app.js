import React, { useState } from "react";

const RevenueRecognitionExercise = () => {
  const [currentCase, setCurrentCase] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedCases, setCompletedCases] = useState(new Set());
  const [score, setScore] = useState({ total: 0, correct: 0 });
  const [attemptedToLeave, setAttemptedToLeave] = useState(false);

  const cases = [
    {
      title: "Software Company Case",
      description:
        "A software company sells a 3-year enterprise software license for €300,000 with installation services (€50,000) and annual maintenance (€30,000/year). The installation takes 2 months.",
      questions: [
        {
          id: "q1",
          text: "What are the distinct performance obligations in this contract?",
          options: [
            "One obligation: Complete software package with installation and maintenance",
            "Two obligations: (1) Software with installation, (2) Maintenance services",
            "Three obligations: (1) Software license, (2) Installation services, (3) Maintenance services",
            "Four obligations: (1) Software license, (2) Installation services, (3) First-year maintenance, (4) Years 2-3 maintenance",
          ],
          correctAnswer: 2,
        },
        {
          id: "q2",
          text: "When should revenue for the software license be recognized?",
          options: [
            "Immediately when the contract is signed",
            "Over the 2-month installation period",
            "Over the 3-year license period",
            "Only when all services have been completed after 3 years",
          ],
          correctAnswer: 0,
        },
        {
          id: "q3",
          text: "How should revenue for the maintenance services be recognized?",
          options: [
            "Immediately when the contract is signed",
            "After installation is complete",
            "Over the 3-year period as the services are provided",
            "In 3 equal amounts at the end of each year",
          ],
          correctAnswer: 2,
        },
      ],
      explanation:
        "This case illustrates multiple performance obligations with different revenue recognition patterns. Under IFRS 15, we identify separate performance obligations when goods or services are distinct. The software license transfers immediately (point in time), installation services are recognized over the installation period, and maintenance is recognized over the 3-year service period.",
    },
    // ... other cases remain the same
  ];

  const areAllQuestionsAnswered = () => {
    const currentQuestions = cases[currentCase].questions;
    return currentQuestions.every(
      (_, index) => studentAnswers[`${currentCase}-${index}`] !== undefined
    );
  };

  const calculateCaseScore = () => {
    const currentQuestions = cases[currentCase].questions;
    let correct = 0;
    currentQuestions.forEach((question, index) => {
      if (
        studentAnswers[`${currentCase}-${index}`] === question.correctAnswer
      ) {
        correct++;
      }
    });
    return correct;
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    if (showFeedback) return; // Prevent changing answers after submission

    setStudentAnswers({
      ...studentAnswers,
      [`${currentCase}-${questionIndex}`]: optionIndex,
    });
    setAttemptedToLeave(false);
  };

  const handleSubmit = () => {
    if (!areAllQuestionsAnswered()) return;

    const caseScore = calculateCaseScore();
    setScore((prev) => ({
      total: prev.total + cases[currentCase].questions.length,
      correct: prev.correct + caseScore,
    }));

    setCompletedCases((prev) => new Set([...prev, currentCase]));
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentCase < cases.length - 1) {
      if (!completedCases.has(currentCase) && !attemptedToLeave) {
        setAttemptedToLeave(true);
        return;
      }
      setCurrentCase(currentCase + 1);
      setShowFeedback(false);
      setAttemptedToLeave(false);
    }
  };

  const handlePrevious = () => {
    if (currentCase > 0) {
      setCurrentCase(currentCase - 1);
      setShowFeedback(false);
    }
  };

  const handleReset = () => {
    setStudentAnswers({});
    setShowFeedback(false);
  };

  const currentCaseData = cases[currentCase];

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">
          Revenue Recognition Exercise
        </h1>
        <div className="text-gray-600">
          Score: {score.correct}/{score.total}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentCase === 0}
            className={`px-4 py-2 rounded transition ${
              currentCase === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <div className="text-lg font-semibold text-blue-700">
            Case {currentCase + 1} of {cases.length}
          </div>
          <button
            onClick={handleNext}
            disabled={currentCase === cases.length - 1}
            className={`px-4 py-2 rounded transition ${
              currentCase === cases.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-2">
          {currentCaseData.title}
        </h2>
        <p className="text-gray-600">{currentCaseData.description}</p>
      </div>

      <div className="space-y-6">
        {currentCaseData.questions.map((question, qIndex) => (
          <div
            key={question.id}
            className={`border rounded-lg p-4 ${
              showFeedback &&
              studentAnswers[`${currentCase}-${qIndex}`] !==
                question.correctAnswer
                ? "border-red-300 bg-red-50"
                : showFeedback
                ? "border-green-300 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <h3 className="font-semibold text-lg mb-3">
              Question {qIndex + 1}: {question.text}
            </h3>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className={`flex items-center p-2 rounded cursor-pointer ${
                    showFeedback
                      ? oIndex === question.correctAnswer
                        ? "bg-green-100"
                        : studentAnswers[`${currentCase}-${qIndex}`] === oIndex
                        ? "bg-red-100"
                        : ""
                      : "hover:bg-blue-50"
                  } ${
                    studentAnswers[`${currentCase}-${qIndex}`] === oIndex
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleAnswer(qIndex, oIndex)}
                >
                  <input
                    type="radio"
                    id={`${question.id}-${oIndex}`}
                    name={question.id}
                    checked={
                      studentAnswers[`${currentCase}-${qIndex}`] === oIndex
                    }
                    onChange={() => handleAnswer(qIndex, oIndex)}
                    className="mr-3"
                  />
                  <label
                    htmlFor={`${question.id}-${oIndex}`}
                    className="cursor-pointer flex-grow"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showFeedback && (
        <div className="bg-gray-100 p-4 rounded-lg mt-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">
            Explanation
          </h3>
          <p className="text-gray-700">{currentCaseData.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={handleSubmit}
            disabled={showFeedback || !areAllQuestionsAnswered()}
            className={`px-4 py-2 rounded transition ${
              showFeedback || !areAllQuestionsAnswered()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Check Answers
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Reset Answers
          </button>
        </div>

        {!areAllQuestionsAnswered() && (
          <p className="text-red-500">
            Please answer all questions before checking.
          </p>
        )}
      </div>
    </div>
  );
};

export default RevenueRecognitionExercise;
