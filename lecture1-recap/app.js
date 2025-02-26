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
          !lines[j].startsWith("#") &&
          !lines[j].startsWith("---")
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
        const questionText = lines[i + 1].trim();

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

  // Modify the fetch content function
  const fetchContent = () => {
    setLoading(true);
    setError(null);

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

  const handleAnswer = (questionIndex, optionIndex) => {
    if (showFeedback) return;

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
