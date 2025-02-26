// Use React from the global scope instead of imports
const { useState, useEffect } = React;

// Navigation component
const TopicNavigation = ({
  currentTopic,
  totalTopics,
  onPrevious,
  onNext,
  completedTopics,
  hasUnsavedChanges,
}) => (
  <div className="flex justify-between mb-4">
    <button
      onClick={onPrevious}
      disabled={currentTopic === 0}
      className={`px-4 py-2 rounded ${
        currentTopic === 0 ? "bg-gray-300" : "bg-blue-600 text-white"
      }`}
    >
      Previous Topic
    </button>
    <span className="px-4 py-2 bg-blue-100 rounded">
      Topic {currentTopic + 1} of {totalTopics}
      {completedTopics.has(currentTopic) && " ✓"}
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
      disabled={currentTopic === totalTopics - 1}
      className={`px-4 py-2 rounded ${
        currentTopic === totalTopics - 1
          ? "bg-gray-300"
          : "bg-blue-600 text-white"
      }`}
    >
      Next Topic
    </button>
  </div>
);

// Topic description component
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
            id={`question-${index}-option-${oIndex}`}
            name={`question-${index}`}
            checked={selectedAnswer === oIndex}
            onChange={() => onAnswerSelect(index, oIndex)}
            disabled={showFeedback}
            className="mt-1 mr-2"
          />
          <label
            htmlFor={`question-${index}-option-${oIndex}`}
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

// Loading indicator component
const LoadingIndicator = () => (
  <div className="text-center py-8">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    <p className="mt-2 text-gray-600">Loading quiz content...</p>
  </div>
);

// Error message component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6">
    <strong className="font-bold">Error loading quiz content!</strong>
    <p className="block sm:inline ml-2">{message}</p>
    <button
      onClick={onRetry}
      className="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Try Again
    </button>
  </div>
);

// Hardcoded quiz content as a fallback
const hardcodedQuizContent = `# Importance of Accounting Information

This section covers the fundamental role of accounting information in business decision-making and capital markets.

## Question 1

According to the lecture, why is accurate accounting information important?

- It's only important for tax purposes
- It helps decision-makers understand a company's financial health and performance **(correct)**
- It's only relevant for internal management decisions
- It's solely required by regulatory authorities

**Explanation**: Accounting information provides insights into a company's financial health and performance, which is essential for decision-makers both inside and outside the organization. The Lyft example demonstrated how accounting errors can significantly impact stock prices and investor decisions.

## Question 2

What did Warren Buffett emphasize about accounting knowledge?

- It's useful but not essential for investors
- It's only important for accountants
- It's fundamental to understanding and operating within the business world **(correct)**
- It's primarily relevant for tax optimization

**Explanation**: Warren Buffett emphasized that accounting is fundamental to understanding and operating within the business world. He considers accounting knowledge essential for anyone involved in business or investing.

## Question 3

What information problems does accounting help address?

- Only cash flow tracking
- Only tax compliance issues
- Information asymmetry and conflicts of interest **(correct)**
- Only inventory management problems

**Explanation**: Accounting helps address information problems arising from information asymmetry (when one party has more information than another) and conflicts of interest between various stakeholders. Accounting provides standardized information that helps reduce these problems.

---

# Accrual Accounting Principles

This section examines how accrual accounting differs from cash accounting and helps match revenues with expenses.

## Question 1

What is the main difference between cash accounting and accrual accounting?

- Cash accounting is more accurate than accrual accounting
- Accrual accounting records revenues and expenses when they are earned or incurred, regardless of when cash changes hands **(correct)**
- Accrual accounting only tracks cash inflows and outflows
- There is no significant difference between the two approaches

**Explanation**: Accrual accounting records economic events when they occur (when revenues are earned or expenses are incurred), not necessarily when cash is exchanged. This provides a more complete picture of a company's economic activities and financial position.

## Question 2

According to the lecture, why is accrual accounting considered more useful than cash flow accounting?

- It's simpler to implement
- It results in higher reported profits
- It provides a better predictor of future performance **(correct)**
- It's required by tax authorities

**Explanation**: As demonstrated in the lecture graphs comparing different performance metrics, accrual accounting provides better predictability of future performance. Operating profits based on accrual accounting help explain more variation in future operating profits compared to cash flow measures.

## Question 3

In the lecture example, what happens to rent paid for the full year when using accrual accounting?

- It's immediately expensed in full
- It's recorded as an asset (prepaid rent) and then expensed over time **(correct)**
- It's never recorded as an expense
- It's treated as a liability

**Explanation**: When rent is paid for the entire year in advance, accrual accounting records it initially as an asset (prepaid rent) and then expenses it over time as the benefit is consumed, following the matching principle.

---

# Long-lived Assets

This section focuses on tangible and intangible assets, and how companies account for them over time.

## Question 1

According to accounting regulations, what are the two key criteria for recognizing an asset?

- It must be physical and have a high monetary value
- It must be owned by the company and be at least one year old
- It must be probable that future economic benefits will flow to the company, and its cost/value can be measured reliably **(correct)**
- It must be listed on the company's balance sheet and approved by auditors

**Explanation**: For an item to be recognized as an asset, accounting regulations require that: 1) it is probable that future economic benefits associated with the item will flow to the entity, and 2) the item has a cost or value that can be measured reliably.

## Question 2

When should an expenditure be capitalized rather than expensed?

- When it exceeds a certain monetary threshold
- When it is expected to provide benefits over multiple periods **(correct)**
- When it is related to marketing or advertising
- When it is required by tax authorities

**Explanation**: Expenditures should be capitalized (recorded as assets) when they are expected to provide benefits over multiple periods, following the matching principle. Operating expenses, in contrast, are expected to benefit only the current period.

## Question 3

Which of the following is NOT considered for recognition as an internally developed intangible asset under IFRS?

- Development costs that meet specific criteria
- Software developed for internal use
- Research costs **(correct)**
- Patented technology developed by the company

**Explanation**: Under IFRS, research costs must be expensed as incurred and cannot be capitalized as assets. Only development costs that meet specific criteria (the PIRATE criteria: Probable economic benefits, Intention to complete, Resources available, Ability to use/sell, Technically feasible, Expenses identifiable) can be capitalized.

## Question 4

What is the accounting treatment for internally generated brands according to the lecture?

- They are capitalized as intangible assets at their fair market value
- They are capitalized based on development costs
- They are not recognized as assets on the balance sheet **(correct)**
- They are initially recognized as expenses, then reclassified as assets

**Explanation**: Internally generated brands, even valuable ones like Meta's Facebook, are not recognized as assets on the balance sheet under current accounting rules. This creates a discrepancy between a company's book value and its market value, especially for companies with significant intangible assets.`;

const Lecture1RecapExercise = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [score, setScore] = useState({ total: 0, correct: 0 });

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("lecture1RecapState");
    if (savedState) {
      try {
        const { answers, completed, scoreData, topicIndex } =
          JSON.parse(savedState);
        setStudentAnswers(answers || {});
        setCompletedTopics(new Set(completed || []));
        setScore(scoreData || { total: 0, correct: 0 });
        setCurrentTopic(topicIndex || 0);
      } catch (e) {
        console.error("Error loading saved state:", e);
      }
    }
  }, []);

  // Save state when it changes
  useEffect(() => {
    if (topics.length > 0) {
      // Only save if content is loaded
      localStorage.setItem(
        "lecture1RecapState",
        JSON.stringify({
          answers: studentAnswers,
          completed: Array.from(completedTopics),
          scoreData: score,
          topicIndex: currentTopic,
        })
      );
    }
  }, [studentAnswers, completedTopics, score, currentTopic, topics]);

  // Function to parse the markdown content
  const parseMarkdownContent = (markdown) => {
    const topics = [];
    let currentTopic = null;
    let currentQuestion = null;

    // Split the markdown by lines
    const lines = markdown.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Topic header (# Title)
      if (line.startsWith("# ")) {
        if (currentTopic) {
          topics.push(currentTopic);
        }

        // Find the description (all text until next heading or ---)
        let description = "";
        let j = i + 1;
        while (
          j < lines.length &&
          !lines[j].trim().startsWith("#") &&
          !lines[j].trim().startsWith("---")
        ) {
          description += lines[j] + " ";
          j++;
        }

        currentTopic = {
          title: line.substring(2).trim(),
          description: description.trim(),
          questions: [],
        };

        // Skip the description lines we've already processed
        i = j - 1;
        continue;
      }

      // Question (## Question)
      if (line.startsWith("## Question")) {
        if (currentQuestion && currentTopic) {
          currentTopic.questions.push(currentQuestion);
        }

        // Get the question text (next line after the heading)
        const questionText = lines[i + 1]?.trim() || "Missing question text";

        currentQuestion = {
          id: `q-${topics.length}-${currentTopic?.questions.length || 0}`,
          text: questionText,
          options: [],
          correctAnswer: null,
          explanation: "",
        };

        i++; // Skip the question text line
        continue;
      }

      // Option (- Option text)
      if (line.startsWith("- ") && currentQuestion) {
        const optionText = line.substring(2).trim();
        const isCorrect = optionText.includes("**(correct)**");

        // Add option without the (correct) marker
        currentQuestion.options.push(
          optionText.replace("**(correct)**", "").trim()
        );

        // Set as correct answer if marked
        if (isCorrect) {
          currentQuestion.correctAnswer = currentQuestion.options.length - 1;
        }

        continue;
      }

      // Explanation
      if (line.startsWith("**Explanation**:") && currentQuestion) {
        currentQuestion.explanation = line.substring(16).trim();
        continue;
      }

      // Topic separator
      if (line === "---") {
        if (currentQuestion && currentTopic) {
          currentTopic.questions.push(currentQuestion);
          currentQuestion = null;
        }
        continue;
      }
    }

    // Add the last question if exists
    if (currentQuestion && currentTopic) {
      currentTopic.questions.push(currentQuestion);
    }

    // Add the last topic if exists
    if (currentTopic) {
      topics.push(currentTopic);
    }

    return topics;
  };

  // Add this fallback data in case fetch fails
  const fallbackTopics = [
    {
      title: "Introduction to Financial Reporting",
      description:
        "This topic covers the fundamental concepts of financial reporting.",
      questions: [
        {
          id: "q-0-0",
          text: "What is the primary purpose of financial reporting?",
          options: [
            "To calculate taxes",
            "For internal management only",
            "To provide useful financial information to stakeholders",
            "To showcase success to competitors",
          ],
          correctAnswer: 2,
          explanation:
            "Financial reporting provides information to stakeholders for decision-making.",
        },
      ],
    },
  ];

  // Modify the fetch content function to use hardcoded content if fetch fails
  const fetchContent = () => {
    setLoading(true);
    setError(null);

    // First try to use the hardcoded content directly
    try {
      console.log("Using hardcoded quiz content");
      const parsedTopics = parseMarkdownContent(hardcodedQuizContent);
      if (parsedTopics.length === 0) {
        console.warn("No topics parsed from hardcoded content");
        setTopics(fallbackTopics);
      } else {
        setTopics(parsedTopics);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error parsing hardcoded content:", err);
      // Continue with fetch attempt if hardcoded content fails
    }

    // Then try to fetch from file
    fetch("quiz-content.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch content: ${response.status} ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((markdownContent) => {
        try {
          const parsedTopics = parseMarkdownContent(markdownContent);
          if (parsedTopics.length === 0) {
            console.warn("No topics parsed from markdown");
            setTopics(fallbackTopics);
          } else {
            setTopics(parsedTopics);
          }
        } catch (err) {
          console.error("Error parsing markdown:", err);
          setTopics(fallbackTopics);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading markdown content:", err);
        setError(err.message || "Failed to load quiz content");
        setTopics(fallbackTopics);
        setLoading(false);
      });
  };

  // Load content on component mount
  useEffect(() => {
    fetchContent();
  }, []);

  // Check if all questions for current topic are answered
  const areAllQuestionsAnswered = () => {
    if (!topics[currentTopic]) return false;

    const currentQuestions = topics[currentTopic].questions;
    return currentQuestions.every(
      (_, index) => studentAnswers[`${currentTopic}-${index}`] !== undefined
    );
  };

  // Check if any questions for current topic are answered but not submitted
  const hasUnsavedChanges = () => {
    if (!topics[currentTopic]) return false;

    const currentQuestions = topics[currentTopic].questions;
    return (
      currentQuestions.some(
        (_, index) => studentAnswers[`${currentTopic}-${index}`] !== undefined
      ) && !completedTopics.has(currentTopic)
    );
  };

  // Allow changing answers after feedback is shown
  const handleAnswer = (questionIndex, optionIndex) => {
    // If we're changing an answer after feedback was shown
    if (showFeedback) {
      // Hide the feedback
      setShowFeedback(false);

      // If this topic was already completed, recalculate score
      if (completedTopics.has(currentTopic)) {
        // Get current questions for this topic
        const currentQuestions = topics[currentTopic].questions;

        // Calculate how many correct answers were previously counted
        let previousCorrect = 0;
        currentQuestions.forEach((question, idx) => {
          if (
            studentAnswers[`${currentTopic}-${idx}`] === question.correctAnswer
          ) {
            previousCorrect++;
          }
        });

        // Subtract previous score for this topic
        setScore((prev) => ({
          total: prev.total - currentQuestions.length,
          correct: prev.correct - previousCorrect,
        }));

        // Remove from completed topics
        const newCompletedTopics = new Set(completedTopics);
        newCompletedTopics.delete(currentTopic);
        setCompletedTopics(newCompletedTopics);
      }
    }

    // Update the answer
    setStudentAnswers({
      ...studentAnswers,
      [`${currentTopic}-${questionIndex}`]: optionIndex,
    });
  };

  const handleSubmit = () => {
    if (!areAllQuestionsAnswered()) {
      alert("Please answer all questions before checking your answers.");
      return;
    }

    // Check if this topic was already completed
    if (completedTopics.has(currentTopic)) {
      // No need to update score or add to completed topics again
      setShowFeedback(true);
      return;
    }

    // Calculate score for this topic
    const currentQuestions = topics[currentTopic].questions;
    let correctAnswers = 0;
    currentQuestions.forEach((question, index) => {
      if (
        studentAnswers[`${currentTopic}-${index}`] === question.correctAnswer
      ) {
        correctAnswers++;
      }
    });

    // Update overall score
    setScore((prev) => ({
      total: prev.total + currentQuestions.length,
      correct: prev.correct + correctAnswers,
    }));

    setCompletedTopics((prev) => new Set([...prev, currentTopic]));
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentTopic < topics.length - 1) {
      setCurrentTopic(currentTopic + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentTopic > 0) {
      setCurrentTopic(currentTopic - 1);
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
    setCompletedTopics(new Set());
    setScore({ total: 0, correct: 0 });
    localStorage.removeItem("lecture1RecapState");
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">
          Lecture 1: Introduction Recap
        </h1>
        <LoadingIndicator />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">
          Lecture 1: Introduction Recap
        </h1>
        <ErrorMessage message={error} onRetry={fetchContent} />
      </div>
    );
  }

  // No topics loaded
  if (topics.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">
          Lecture 1: Introduction Recap
        </h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No quiz content available. Please check that the quiz-content.md file
          exists.
        </div>
      </div>
    );
  }

  const currentTopicData = topics[currentTopic];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">
        Lecture 1: Introduction Recap
      </h1>

      <div className="mb-6">
        <TopicNavigation
          currentTopic={currentTopic}
          totalTopics={topics.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          completedTopics={completedTopics}
          hasUnsavedChanges={hasUnsavedChanges()}
        />
      </div>

      <TopicDescription
        title={currentTopicData.title}
        description={currentTopicData.description}
      />

      <div className="space-y-6">
        {currentTopicData.questions.map((question, index) => (
          <Question
            key={question.id}
            question={question}
            index={index}
            selectedAnswer={studentAnswers[`${currentTopic}-${index}`]}
            onAnswerSelect={handleAnswer}
            showFeedback={showFeedback}
          />
        ))}
      </div>

      {showFeedback && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold mb-2">Topic Summary:</h3>
          <p>{currentTopicData.description}</p>
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
          Overall Progress: {completedTopics.size} of {topics.length} topics
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

// Render the component
ReactDOM.render(<Lecture1RecapExercise />, document.getElementById("root"));
