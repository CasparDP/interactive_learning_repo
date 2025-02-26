// Simple quiz app that works with browser-based Babel
(function () {
  // Helper components
  function LoadingIndicator() {
    return React.createElement(
      "div",
      { className: "text-center py-8" },
      React.createElement("div", {
        className:
          "inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600",
      }),
      React.createElement(
        "p",
        { className: "mt-2 text-gray-600" },
        "Loading quiz content..."
      )
    );
  }

  function ErrorMessage({ message, onRetry }) {
    return React.createElement(
      "div",
      {
        className:
          "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-6",
      },
      React.createElement(
        "strong",
        { className: "font-bold" },
        "Error loading quiz content!"
      ),
      React.createElement("p", { className: "block sm:inline ml-2" }, message),
      React.createElement(
        "button",
        {
          onClick: onRetry,
          className:
            "mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded",
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
      { className: "border rounded-lg p-4 mb-4" },
      React.createElement(
        "h3",
        { className: "font-semibold mb-2" },
        `Question ${index + 1}: ${question.text}`
      ),
      React.createElement(
        "div",
        { className: "space-y-2" },
        question.options.map((option, oIndex) =>
          React.createElement(
            "div",
            { key: oIndex, className: "flex items-start" },
            React.createElement("input", {
              type: "radio",
              id: `question-${index}-option-${oIndex}`,
              name: `question-${index}`,
              checked: selectedAnswer === oIndex,
              onChange: () => onAnswerSelect(index, oIndex),
              disabled: showFeedback,
              className: "mt-1 mr-2",
            }),
            React.createElement(
              "label",
              {
                htmlFor: `question-${index}-option-${oIndex}`,
                className:
                  showFeedback && question.correctAnswer === oIndex
                    ? "font-bold"
                    : "",
              },
              option
            )
          )
        )
      ),
      showFeedback &&
        React.createElement(
          "div",
          {
            className: `mt-3 p-3 rounded ${
              selectedAnswer === question.correctAnswer
                ? "bg-green-100"
                : "bg-red-100"
            }`,
          },
          selectedAnswer === question.correctAnswer
            ? "✓ Correct!"
            : `✗ Incorrect. The correct answer is: ${
                question.options[question.correctAnswer]
              }`,
          React.createElement("p", { className: "mt-2" }, question.explanation)
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

    function handleAnswerSelect(questionIndex, optionIndex) {
      setStudentAnswers({
        ...studentAnswers,
        [`${currentTopic}-${questionIndex}`]: optionIndex,
      });
    }

    function handleCheckAnswers() {
      setShowFeedback(true);
    }

    function handleNextTopic() {
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

    // Rendering logic
    if (loading) {
      return React.createElement(
        "div",
        { className: "p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg" },
        React.createElement(
          "h1",
          { className: "text-2xl font-bold mb-4 text-blue-800" },
          "Lecture 1: Introduction Recap"
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
          "Lecture 1: Introduction Recap"
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
          "Lecture 1: Introduction Recap"
        ),
        React.createElement(
          "div",
          { className: "bg-yellow-100 p-4 rounded" },
          "No quiz content available."
        )
      );
    }

    const currentTopicData = topics[currentTopic];

    return React.createElement(
      "div",
      { className: "p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg" },
      React.createElement(
        "h1",
        { className: "text-2xl font-bold mb-4 text-blue-800" },
        "Lecture 1: Introduction Recap"
      ),

      // Topic navigation
      React.createElement(
        "div",
        { className: "flex justify-between mb-4" },
        React.createElement(
          "button",
          {
            onClick: handlePrevTopic,
            disabled: currentTopic === 0,
            className:
              currentTopic === 0
                ? "px-4 py-2 bg-gray-300 rounded"
                : "px-4 py-2 bg-blue-600 text-white rounded",
          },
          "Previous Topic"
        ),

        React.createElement(
          "span",
          { className: "px-4 py-2 bg-blue-100 rounded" },
          `Topic ${currentTopic + 1} of ${topics.length}`
        ),

        React.createElement(
          "button",
          {
            onClick: handleNextTopic,
            disabled: currentTopic === topics.length - 1,
            className:
              currentTopic === topics.length - 1
                ? "px-4 py-2 bg-gray-300 rounded"
                : "px-4 py-2 bg-blue-600 text-white rounded",
          },
          "Next Topic"
        )
      ),

      // Topic description
      React.createElement(
        "div",
        { className: "bg-blue-50 p-4 rounded-lg mb-6" },
        React.createElement(
          "h2",
          { className: "text-xl font-semibold mb-2" },
          currentTopicData.title
        ),
        React.createElement(
          "p",
          { className: "mb-4" },
          currentTopicData.description
        )
      ),

      // Questions
      React.createElement(
        "div",
        { className: "space-y-6" },
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

      // Check answers button
      React.createElement(
        "div",
        { className: "mt-6" },
        React.createElement(
          "button",
          {
            onClick: handleCheckAnswers,
            disabled: showFeedback,
            className: showFeedback
              ? "px-4 py-2 bg-gray-300 rounded"
              : "px-4 py-2 bg-green-600 text-white rounded",
          },
          "Check Answers"
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
