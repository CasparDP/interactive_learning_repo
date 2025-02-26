// Remove import statement and use global React
const { useState, useEffect } = React;

// Navigation component
const CaseNavigation = ({
  currentCase,
  totalCases,
  onPrevious,
  onNext,
  completedCases,
  hasUnsavedChanges,
}) => (
  <div className="flex justify-between mb-4">
    <button
      onClick={onPrevious}
      disabled={currentCase === 0}
      className={`px-4 py-2 rounded ${
        currentCase === 0 ? "bg-gray-300" : "bg-blue-600 text-white"
      }`}
    >
      Previous Topic
    </button>
    <span className="px-4 py-2 bg-blue-100 rounded">
      Topic {currentCase + 1} of {totalCases}
      {completedCases.has(currentCase) && " ✓"}
    </span>
    <button
      onClick={() => {
        if (
          hasUnsavedChanges &&
          !window.confirm(
            "You have unsaved answers. Continue without checking?"
          )
        ) {
          return;
        }
        onNext();
      }}
      disabled={currentCase === totalCases - 1}
      className={`px-4 py-2 rounded ${
        currentCase === totalCases - 1
          ? "bg-gray-300"
          : "bg-blue-600 text-white"
      }`}
    >
      Next Topic
    </button>
  </div>
);

// Case description component
const TopicDescription = ({ title, description }) => (
  <div className="bg-blue-50 p-4 rounded-lg mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="mb-4">{description}</p>
  </div>
);

// Question component
const Question = ({
  question,
  index,
  selectedAnswer,
  onAnswerSelect,
  showFeedback,
}) => (
  <div className="border rounded-lg p-4 mb-4">
    <h3 className="font-semibold mb-2">
      Question {index + 1}: {question.text}
    </h3>
    <div className="space-y-2">
      {question.options.map((option, oIndex) => (
        <div key={oIndex} className="flex items-start">
          <input
            type="radio"
            id={`${question.id}-${oIndex}`}
            name={question.id}
            checked={selectedAnswer === oIndex}
            onChange={() => onAnswerSelect(index, oIndex)}
            disabled={showFeedback}
            className="mt-1 mr-2"
          />
          <label
            htmlFor={`${question.id}-${oIndex}`}
            className={`block ${
              showFeedback && question.correctAnswer === oIndex
                ? "font-bold"
                : ""
            }`}
          >
            {option}
          </label>
        </div>
      ))}
    </div>

    {showFeedback && (
      <div
        className={`mt-3 p-3 rounded ${
          selectedAnswer === question.correctAnswer
            ? "bg-green-100"
            : "bg-red-100"
        }`}
      >
        {selectedAnswer === question.correctAnswer
          ? "✓ Correct!"
          : `✗ Incorrect. The correct answer is: ${
              question.options[question.correctAnswer]
            }`}
        <p className="mt-2">{question.explanation}</p>
      </div>
    )}
  </div>
);

const Lecture1RecapExercise = () => {
  const [currentCase, setCurrentCase] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedCases, setCompletedCases] = useState(new Set());
  const [score, setScore] = useState({ total: 0, correct: 0 });

  // Load saved state on initial render
  useEffect(() => {
    const savedState = localStorage.getItem("lecture1RecapState");
    if (savedState) {
      try {
        const { answers, completed, scoreData, caseIndex } =
          JSON.parse(savedState);
        setStudentAnswers(answers || {});
        setCompletedCases(new Set(completed || []));
        setScore(scoreData || { total: 0, correct: 0 });
        setCurrentCase(caseIndex || 0);
      } catch (e) {
        console.error("Error loading saved state:", e);
      }
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    localStorage.setItem(
      "lecture1RecapState",
      JSON.stringify({
        answers: studentAnswers,
        completed: [...completedCases],
        scoreData: score,
        caseIndex: currentCase,
      })
    );
  }, [studentAnswers, completedCases, score, currentCase]);

  const cases = [
    {
      title: "Importance of Accounting Information",
      description:
        "This section covers the fundamental role of accounting information in business decision-making and capital markets.",
      questions: [
        {
          id: "q1-1",
          text: "According to the lecture, why is accurate accounting information important?",
          options: [
            "It's only important for tax purposes",
            "It helps decision-makers understand a company's financial health and performance",
            "It's only relevant for internal management decisions",
            "It's solely required by regulatory authorities",
          ],
          correctAnswer: 1,
          explanation:
            "Accounting information provides insights into a company's financial health and performance, which is essential for decision-makers both inside and outside the organization. The Lyft example demonstrated how accounting errors can significantly impact stock prices and investor decisions.",
        },
        {
          id: "q1-2",
          text: "What did Warren Buffett emphasize about accounting knowledge?",
          options: [
            "It's useful but not essential for investors",
            "It's only important for accountants",
            "It's fundamental to understanding and operating within the business world",
            "It's primarily relevant for tax optimization",
          ],
          correctAnswer: 2,
          explanation:
            "Warren Buffett emphasized that accounting is fundamental to understanding and operating within the business world. He considers accounting knowledge essential for anyone involved in business or investing.",
        },
        {
          id: "q1-3",
          text: "What information problems does accounting help address?",
          options: [
            "Only cash flow tracking",
            "Only tax compliance issues",
            "Information asymmetry and conflicts of interest",
            "Only inventory management problems",
          ],
          correctAnswer: 2,
          explanation:
            "Accounting helps address information problems arising from information asymmetry (when one party has more information than another) and conflicts of interest between various stakeholders. Accounting provides standardized information that helps reduce these problems.",
        },
      ],
      explanation:
        "Accounting information plays a crucial role in addressing information asymmetry and conflicts of interest in capital markets. It provides a reliable basis for decision-making by investors, creditors, and other stakeholders. The Lyft example from the lecture illustrated how accounting errors can have significant real-world implications on company valuation and investor decisions.",
    },
    {
      title: "Accrual Accounting Principles",
      description:
        "This section examines how accrual accounting differs from cash accounting and helps match revenues with expenses.",
      questions: [
        {
          id: "q2-1",
          text: "What is the main difference between cash accounting and accrual accounting?",
          options: [
            "Cash accounting is more accurate than accrual accounting",
            "Accrual accounting records revenues and expenses when they are earned or incurred, regardless of when cash changes hands",
            "Accrual accounting only tracks cash inflows and outflows",
            "There is no significant difference between the two approaches",
          ],
          correctAnswer: 1,
          explanation:
            "Accrual accounting records economic events when they occur (when revenues are earned or expenses are incurred), not necessarily when cash is exchanged. This provides a more complete picture of a company's economic activities and financial position.",
        },
        {
          id: "q2-2",
          text: "According to the lecture, why is accrual accounting considered more useful than cash flow accounting?",
          options: [
            "It's simpler to implement",
            "It results in higher reported profits",
            "It provides a better predictor of future performance",
            "It's required by tax authorities",
          ],
          correctAnswer: 2,
          explanation:
            "As demonstrated in the lecture graphs comparing different performance metrics, accrual accounting provides better predictability of future performance. Operating profits based on accrual accounting help explain more variation in future operating profits compared to cash flow measures.",
        },
        {
          id: "q2-3",
          text: "In the lecture example, what happens to rent paid for the full year when using accrual accounting?",
          options: [
            "It's immediately expensed in full",
            "It's recorded as an asset (prepaid rent) and then expensed over time",
            "It's never recorded as an expense",
            "It's treated as a liability",
          ],
          correctAnswer: 1,
          explanation:
            "When rent is paid for the entire year in advance, accrual accounting records it initially as an asset (prepaid rent) and then expenses it over time as the benefit is consumed, following the matching principle.",
        },
      ],
      explanation:
        "Accrual accounting helps allocate cash flows to the periods in which they truly relate, providing a more accurate picture of a company's financial performance by matching revenues with associated expenses. This approach transforms raw cash flows into a more meaningful representation of business operations and leads to better predictability of future performance, as shown in the return relevance charts from the lecture.",
    },
    {
      title: "Long-lived Assets",
      description:
        "This section focuses on tangible and intangible assets, and how companies account for them over time.",
      questions: [
        {
          id: "q3-1",
          text: "According to accounting regulations, what are the two key criteria for recognizing an asset?",
          options: [
            "It must be physical and have a high monetary value",
            "It must be owned by the company and be at least one year old",
            "It must be probable that future economic benefits will flow to the company, and its cost/value can be measured reliably",
            "It must be listed on the company's balance sheet and approved by auditors",
          ],
          correctAnswer: 2,
          explanation:
            "For an item to be recognized as an asset, accounting regulations require that: 1) it is probable that future economic benefits associated with the item will flow to the entity, and 2) the item has a cost or value that can be measured reliably.",
        },
        {
          id: "q3-2",
          text: "When should an expenditure be capitalized rather than expensed?",
          options: [
            "When it exceeds a certain monetary threshold",
            "When it is expected to provide benefits over multiple periods",
            "When it is related to marketing or advertising",
            "When it is required by tax authorities",
          ],
          correctAnswer: 1,
          explanation:
            "Expenditures should be capitalized (recorded as assets) when they are expected to provide benefits over multiple periods, following the matching principle. Operating expenses, in contrast, are expected to benefit only the current period.",
        },
        {
          id: "q3-3",
          text: "Which of the following is NOT considered for recognition as an internally developed intangible asset under IFRS?",
          options: [
            "Development costs that meet specific criteria",
            "Software developed for internal use",
            "Research costs",
            "Patented technology developed by the company",
          ],
          correctAnswer: 2,
          explanation:
            "Under IFRS, research costs must be expensed as incurred and cannot be capitalized as assets. Only development costs that meet specific criteria (the PIRATE criteria: Probable economic benefits, Intention to complete, Resources available, Ability to use/sell, Technically feasible, Expenses identifiable) can be capitalized.",
        },
        {
          id: "q3-4",
          text: "What is the accounting treatment for internally generated brands according to the lecture?",
          options: [
            "They are capitalized as intangible assets at their fair market value",
            "They are capitalized based on development costs",
            "They are not recognized as assets on the balance sheet",
            "They are initially recognized as expenses, then reclassified as assets",
          ],
          correctAnswer: 2,
          explanation:
            "Internally generated brands, even valuable ones like Meta's Facebook, are not recognized as assets on the balance sheet under current accounting rules. This creates a discrepancy between a company's book value and its market value, especially for companies with significant intangible assets.",
        },
      ],
      explanation:
        "Long-lived assets are the 'backbone' of firms' business models and generate benefits for multiple years. Following the matching principle, firms capitalize related expenditures and then depreciate/amortize them over time. However, accounting rules struggle with reflecting investments in internally generated intangible assets, which is especially critical for firms engaging in significant R&D or advertising activities.",
    },
  ];

  // Check if all questions for current case are answered
  const areAllQuestionsAnswered = () => {
    const currentQuestions = cases[currentCase].questions;
    return currentQuestions.every(
      (_, index) => studentAnswers[`${currentCase}-${index}`] !== undefined
    );
  };

  // Check if any questions for current case are answered but not submitted
  const hasUnsavedChanges = () => {
    const currentQuestions = cases[currentCase].questions;
    return (
      currentQuestions.some(
        (_, index) => studentAnswers[`${currentCase}-${index}`] !== undefined
      ) && !completedCases.has(currentCase)
    );
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    if (showFeedback) return;

    setStudentAnswers({
      ...studentAnswers,
      [`${currentCase}-${questionIndex}`]: optionIndex,
    });
  };

  const handleSubmit = () => {
    if (!areAllQuestionsAnswered()) {
      alert("Please answer all questions before checking your answers.");
      return;
    }

    // Calculate score for this case
    const currentQuestions = cases[currentCase].questions;
    let correctAnswers = 0;
    currentQuestions.forEach((question, index) => {
      if (
        studentAnswers[`${currentCase}-${index}`] === question.correctAnswer
      ) {
        correctAnswers++;
      }
    });

    // Update overall score
    setScore((prev) => ({
      total: prev.total + currentQuestions.length,
      correct: prev.correct + correctAnswers,
    }));

    setCompletedCases((prev) => new Set([...prev, currentCase]));
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentCase < cases.length - 1) {
      setCurrentCase(currentCase + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentCase > 0) {
      setCurrentCase(currentCase - 1);
      setShowFeedback(false);
    }
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all your answers and progress?"
      )
    ) {
      return;
    }

    setStudentAnswers({});
    setShowFeedback(false);
    setCompletedCases(new Set());
    setScore({ total: 0, correct: 0 });
    localStorage.removeItem("lecture1RecapState");
  };

  const currentCaseData = cases[currentCase];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">
        Lecture 1: Introduction Recap
      </h1>

      <div className="mb-6">
        <CaseNavigation
          currentCase={currentCase}
          totalCases={cases.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          completedCases={completedCases}
          hasUnsavedChanges={hasUnsavedChanges()}
        />
      </div>

      <TopicDescription
        title={currentCaseData.title}
        description={currentCaseData.description}
      />

      <div className="space-y-6">
        {currentCaseData.questions.map((question, index) => (
          <Question
            key={question.id}
            question={question}
            index={index}
            selectedAnswer={studentAnswers[`${currentCase}-${index}`]}
            onAnswerSelect={handleAnswer}
            showFeedback={showFeedback}
          />
        ))}
      </div>

      {showFeedback && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold mb-2">Topic Summary:</h3>
          <p>{currentCaseData.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={handleSubmit}
          disabled={showFeedback || !areAllQuestionsAnswered()}
          className={`px-4 py-2 rounded ${
            showFeedback || !areAllQuestionsAnswered()
              ? "bg-gray-300"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Check Answers
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Reset All Progress
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="font-semibold">
          Overall Progress: {completedCases.size} of {cases.length} topics
          completed
        </p>
        <p className="font-semibold">
          Score: {score.correct} correct out of {score.total} questions
          {score.total > 0 &&
            ` (${Math.round((score.correct / score.total) * 100)}%)`}
        </p>
      </div>
    </div>
  );
};

// Render directly instead of exporting
ReactDOM.render(<Lecture1RecapExercise />, document.getElementById("root"));
