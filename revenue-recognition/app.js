// Simple quiz app that works with browser-based Babel
(function () {
  // Helper components
  function LoadingIndicator() {
    return React.createElement(
      "div",
      { className: "text-center py-12" },
      React.createElement("div", {
        className:
          "inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600",
      }),
      React.createElement(
        "p",
        { className: "mt-4 text-gray-600 font-medium" },
        "Loading quiz content..."
      )
    );
  }

  function ErrorMessage({ message, onRetry }) {
    return React.createElement(
      "div",
      {
        className:
          "bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg shadow-md my-6 animate-fadeIn",
      },
      React.createElement(
        "div",
        { className: "flex items-center mb-3" },
        React.createElement(
          "svg",
          {
            className: "w-6 h-6 mr-2",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
          },
          React.createElement("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
          })
        ),
        React.createElement(
          "strong",
          { className: "font-bold text-lg" },
          "Error loading quiz content!"
        )
      ),
      React.createElement("p", { className: "mb-4" }, message),
      React.createElement(
        "button",
        {
          onClick: onRetry,
          className:
            "px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200",
        },
        "Try Again"
      )
    );
  }

  function Question({
    question,
    index,
    selectedAnswer,
    onAnswerSelect,
    showFeedback,
  }) {
    return React.createElement(
      "div",
      {
        className:
          "bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-6 transition-all duration-200 hover:shadow-lg",
      },
      // Question header
      React.createElement(
        "div",
        { className: "px-6 py-4 bg-gray-50 border-b border-gray-100" },
        React.createElement(
          "h3",
          { className: "font-bold text-lg text-gray-800" },
          `Question ${index + 1}: ${question.text}`
        )
      ),
      // Options container
      React.createElement(
        "div",
        { className: "p-6" },
        React.createElement(
          "div",
          { className: "space-y-3" },
          question.options.map((option, oIndex) =>
            React.createElement(
              "div",
              {
                key: oIndex,
                className: `flex items-start p-3 rounded-lg transition-colors duration-200 ${
                  showFeedback && question.correctAnswer === oIndex
                    ? "bg-green-50 border border-green-100"
                    : "hover:bg-gray-50"
                }`,
              },
              React.createElement("input", {
                type: "radio",
                id: `question-${index}-option-${oIndex}`,
                name: `question-${index}`,
                checked: selectedAnswer === oIndex,
                onChange: () => onAnswerSelect(index, oIndex),
                disabled: showFeedback,
                className:
                  "mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500",
              }),
              React.createElement(
                "label",
                {
                  htmlFor: `question-${index}-option-${oIndex}`,
                  className: `block w-full cursor-pointer ${
                    showFeedback && question.correctAnswer === oIndex
                      ? "font-semibold text-green-800"
                      : "text-gray-700"
                  }`,
                },
                option
              )
            )
          )
        ),

        // Feedback section
        showFeedback &&
          React.createElement(
            "div",
            {
              className: `mt-6 p-4 rounded-lg border ${
                selectedAnswer === question.correctAnswer
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`,
            },
            React.createElement(
              "div",
              { className: "flex items-center mb-2" },
              React.createElement(
                "span",
                {
                  className: `inline-flex items-center justify-center h-6 w-6 rounded-full mr-2 ${
                    selectedAnswer === question.correctAnswer
                      ? "bg-green-200 text-green-700"
                      : "bg-red-200 text-red-700"
                  }`,
                },
                selectedAnswer === question.correctAnswer ? "✓" : "✗"
              ),
              React.createElement(
                "span",
                { className: "font-semibold" },
                selectedAnswer === question.correctAnswer
                  ? "Correct!"
                  : `Incorrect. The correct answer is: ${
                      question.options[question.correctAnswer]
                    }`
              )
            ),
            React.createElement(
              "p",
              { className: "mt-2 text-sm italic" },
              question.explanation
            )
          )
      )
    );
  }

  // Main Quiz component
  function QuizApp() {
    const [topics, setTopics] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [currentTopic, setCurrentTopic] = React.useState(0);
    const [studentAnswers, setStudentAnswers] = React.useState({});
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [completedTopics, setCompletedTopics] = React.useState(new Set());
    const [score, setScore] = React.useState({ total: 0, correct: 0 });

    // Load saved state on initial render
    React.useEffect(() => {
      const savedState = localStorage.getItem("revenueRecognitionState");
      if (savedState) {
        try {
          const { answers, completed, scoreData, caseIndex } =
            JSON.parse(savedState);
          setStudentAnswers(answers || {});
          setCompletedTopics(new Set(completed || []));
          setScore(scoreData || { total: 0, correct: 0 });
          setCurrentTopic(caseIndex || 0);
        } catch (e) {
          console.error("Error loading saved state:", e);
        }
      }
    }, []);

    // Save state when it changes
    React.useEffect(() => {
      if (topics.length > 0) {
        localStorage.setItem(
          "revenueRecognitionState",
          JSON.stringify({
            answers: studentAnswers,
            completed: Array.from(completedTopics),
            scoreData: score,
            caseIndex: currentTopic,
          })
        );
      }
    }, [studentAnswers, completedTopics, score, currentTopic, topics]);

    // Parse markdown to extract questions
    function parseMarkdown(content) {
      console.log("Parsing markdown content...");
      const topics = [];
      let currentTopic = null;
      let currentQuestion = null;

      // Split content into lines
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Topic header
        if (line.startsWith("# ")) {
          // Save previous topic
          if (currentTopic) {
            if (currentQuestion) {
              currentTopic.questions.push(currentQuestion);
              currentQuestion = null;
            }
            topics.push(currentTopic);
          }

          // Find description
          let description = "";
          let j = i + 1;
          while (
            j < lines.length &&
            !lines[j].trim().startsWith("# ") &&
            !lines[j].trim().startsWith("## ") &&
            !lines[j].trim().startsWith("---")
          ) {
            if (lines[j].trim() !== "") {
              description += lines[j].trim() + " ";
            }
            j++;
          }

          currentTopic = {
            title: line.substring(2).trim(),
            description: description.trim(),
            questions: [],
          };

          // Skip description lines
          i = j - 1;
        }
        // Question
        else if (line.startsWith("## Question")) {
          // Save previous question
          if (currentQuestion && currentTopic) {
            currentTopic.questions.push(currentQuestion);
          }

          // Extract question text
          let questionText = "";
          let j = i + 1;
          while (
            j < lines.length &&
            !lines[j].trim().startsWith("- ") &&
            !lines[j].trim().startsWith("**") &&
            !lines[j].trim().startsWith("## ") &&
            !lines[j].trim().startsWith("# ")
          ) {
            if (lines[j].trim() !== "") {
              questionText += lines[j].trim() + " ";
            }
            j++;
          }

          currentQuestion = {
            id: `q-${topics.length}-${
              currentTopic ? currentTopic.questions.length : 0
            }`,
            text: questionText.trim(),
            options: [],
            correctAnswer: null,
            explanation: "",
          };

          // Skip question text lines
          i = j - 1;
        }
        // Option
        else if (line.startsWith("- ") && currentQuestion) {
          const option = line.substring(2).trim();
          const isCorrect = option.includes("**(correct)**");
          currentQuestion.options.push(
            option.replace("**(correct)**", "").trim()
          );

          if (isCorrect) {
            currentQuestion.correctAnswer = currentQuestion.options.length - 1;
          }
        }
        // Explanation
        else if (line.startsWith("**Explanation**") && currentQuestion) {
          currentQuestion.explanation = line
            .substring(line.indexOf(":") + 1)
            .trim();
        }
      }

      // Add final topic and question
      if (currentQuestion && currentTopic) {
        currentTopic.questions.push(currentQuestion);
      }
      if (currentTopic) {
        topics.push(currentTopic);
      }

      console.log("Parsed topics:", topics);
      return topics;
    }

    // Load content from file
    React.useEffect(() => {
      fetch("quiz-content.md")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch content: ${response.status}`);
          }
          return response.text();
        })
        .then((content) => {
          if (!content || content.trim() === "") {
            throw new Error("Empty content received");
          }

          const parsedTopics = parseMarkdown(content);
          if (parsedTopics.length === 0) {
            throw new Error("No topics could be parsed from content");
          }

          setTopics(parsedTopics);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading content:", err);
          setError(err.message);
          setLoading(false);
        });
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

    function handleAnswerSelect(questionIndex, optionIndex) {
      // Allow changing answers after feedback is shown
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
              studentAnswers[`${currentTopic}-${idx}`] ===
              question.correctAnswer
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
    }

    function handleCheckAnswers() {
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
    }

    function handleNextTopic() {
      if (
        hasUnsavedChanges() &&
        !window.confirm("You have unsaved answers. Continue without checking?")
      ) {
        return;
      }

      if (currentTopic < topics.length - 1) {
        setCurrentTopic(currentTopic + 1);
        setShowFeedback(false);
      }
    }

    function handlePrevTopic() {
      if (currentTopic > 0) {
        setCurrentTopic(currentTopic - 1);
        setShowFeedback(false);
      }
    }

    function handleReset() {
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
      localStorage.removeItem("revenueRecognitionState");
    }

    // Rendering logic
    if (loading) {
      return React.createElement(
        "div",
        { className: "p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg" },
        React.createElement(
          "h1",
          { className: "text-2xl font-bold mb-4 text-blue-800" },
          "Revenue Recognition Cases"
        ),
        React.createElement(LoadingIndicator, null)
      );
    }

    if (error) {
      return React.createElement(
        "div",
        { className: "p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg" },
        React.createElement(
          "h1",
          { className: "text-2xl font-bold mb-4 text-blue-800" },
          "Revenue Recognition Cases"
        ),
        React.createElement(ErrorMessage, {
          message: error,
          onRetry: () => window.location.reload(),
        })
      );
    }

    if (topics.length === 0) {
      return React.createElement(
        "div",
        { className: "p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg" },
        React.createElement(
          "h1",
          { className: "text-2xl font-bold mb-4 text-blue-800" },
          "Revenue Recognition Cases"
        ),
        React.createElement(
          "div",
          { className: "bg-yellow-100 p-4 rounded" },
          "No case content available."
        )
      );
    }

    const currentTopicData = topics[currentTopic];

    return React.createElement(
      "div",
      { className: "p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-xl" },
      // Header with line gradient under it
      React.createElement(
        "div",
        { className: "mb-8 pb-4 border-b border-gray-200" },
        React.createElement(
          "h1",
          { className: "text-3xl font-bold text-blue-800" },
          "Revenue Recognition Cases"
        ),
        React.createElement(
          "p",
          { className: "text-gray-600 mt-2" },
          "Apply IFRS 15 principles to these practical business scenarios"
        )
      ),

      // Topic navigation - modernized
      React.createElement(
        "div",
        { className: "flex justify-between items-center mb-6" },
        React.createElement(
          "button",
          {
            onClick: handlePrevTopic,
            disabled: currentTopic === 0,
            className: `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
              currentTopic === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`,
          },
          React.createElement("span", { className: "mr-1" }, "←"),
          "Previous Case"
        ),

        React.createElement(
          "span",
          {
            className:
              "px-5 py-2 bg-blue-50 rounded-lg font-semibold text-blue-800 border border-blue-100",
          },
          `Case ${currentTopic + 1} of ${topics.length}${
            completedTopics.has(currentTopic) ? " ✓" : ""
          }`
        ),

        React.createElement(
          "button",
          {
            onClick: handleNextTopic,
            disabled: currentTopic === topics.length - 1,
            className: `px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
              currentTopic === topics.length - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            }`,
          },
          "Next Case",
          React.createElement("span", { className: "ml-1" }, "→")
        )
      ),

      // Topic description - enhanced
      React.createElement(
        "div",
        {
          className:
            "bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 border border-blue-100 shadow-sm",
        },
        React.createElement(
          "h2",
          { className: "text-xl font-bold mb-3 text-blue-900" },
          currentTopicData.title
        ),
        React.createElement(
          "p",
          { className: "text-blue-800 opacity-90 leading-relaxed" },
          currentTopicData.description
        )
      ),

      // Questions
      React.createElement(
        "div",
        { className: "space-y-8" },
        currentTopicData.questions.map((question, index) =>
          React.createElement(Question, {
            key: question.id,
            question: question,
            index: index,
            selectedAnswer: studentAnswers[`${currentTopic}-${index}`],
            onAnswerSelect: handleAnswerSelect,
            showFeedback: showFeedback,
          })
        )
      ),

      // Explanation when feedback is shown
      showFeedback &&
        React.createElement(
          "div",
          {
            className:
              "mt-6 p-5 bg-blue-50 rounded-xl border border-blue-100 shadow-sm animate-fadeIn",
          },
          React.createElement(
            "h3",
            { className: "font-bold text-lg text-blue-900 mb-2" },
            "Explanation:"
          ),
          React.createElement(
            "p",
            { className: "text-blue-800 opacity-90 leading-relaxed" },
            currentTopicData.questions.map((q) => q.explanation).join(" ")
          )
        ),

      // Action buttons
      React.createElement(
        "div",
        { className: "mt-8 flex flex-wrap gap-4" },
        React.createElement(
          "button",
          {
            onClick: handleCheckAnswers,
            disabled: showFeedback || !areAllQuestionsAnswered(),
            className: `px-6 py-3 rounded-lg font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
              showFeedback || !areAllQuestionsAnswered()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500"
            }`,
          },
          showFeedback ? "Answers Checked" : "Check Answers"
        ),

        React.createElement(
          "button",
          {
            onClick: handleReset,
            className:
              "px-6 py-3 rounded-lg font-semibold text-white shadow-sm bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200",
          },
          "Reset All Progress"
        )
      ),

      // Progress stats
      React.createElement(
        "div",
        {
          className:
            "mt-8 border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center",
        },
        React.createElement(
          "p",
          { className: "font-semibold text-gray-700 mb-2 md:mb-0" },
          `Overall Progress: ${completedTopics.size} of ${topics.length} cases completed`
        ),
        React.createElement(
          "p",
          {
            className:
              "font-semibold text-gray-700 px-4 py-2 bg-gray-50 rounded-lg",
          },
          `Score: ${score.correct} correct out of ${score.total} questions
          ${
            score.total > 0
              ? ` (${Math.round((score.correct / score.total) * 100)}%)`
              : ""
          }`
        )
      )
    );
  }

  // Render the app
  ReactDOM.render(
    React.createElement(QuizApp, null),
    document.getElementById("root")
  );
})();
