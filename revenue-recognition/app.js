import React, { useState } from "react";

const RevenueRecognitionExercise = () => {
  const [currentCase, setCurrentCase] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

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
    {
      title: "Construction Contract Case",
      description:
        "A construction company signs a €5 million contract to build a custom office building. The project will take 2 years to complete. The customer controls the asset as it's being built on their land.",
      questions: [
        {
          id: "q1",
          text: "How should the construction company recognize revenue on this project?",
          options: [
            "Only when the building is complete and handed over",
            "In two equal installments at the end of each year",
            "Over time as the construction progresses",
            "When the contract is first signed",
          ],
          correctAnswer: 2,
        },
        {
          id: "q2",
          text: "If the company has completed 30% of the work by the end of year 1 and incurred 40% of the costs, what's the appropriate revenue to recognize for year 1?",
          options: [
            "€2 million (40% of contract value)",
            "€1.5 million (30% of contract value)",
            "Zero until the project is complete",
            "Depends on milestone completion rather than percentage",
          ],
          correctAnswer: 1,
        },
        {
          id: "q3",
          text: "If the customer pays a €1 million advance at the start of the project, how should this be recorded?",
          options: [
            "As revenue immediately",
            "As a contract liability (deferred revenue)",
            "As a reduction of the total contract price",
            "As a separate financing transaction",
          ],
          correctAnswer: 1,
        },
      ],
      explanation:
        "This case demonstrates revenue recognition over time when the customer controls the asset being created. Under IFRS 15, revenue is recognized based on progress toward completion when the customer controls the asset as it's being created. Progress is measured based on the proportion of performance obligation satisfied, not necessarily based on costs incurred.",
    },
    {
      title: "Mobile Telecom Case",
      description:
        "A telecom company offers a contract: €1 upfront for a premium smartphone (standalone value €700) with a 24-month service plan at €40/month. The standalone price for the service plan alone would be €30/month.",
      questions: [
        {
          id: "q1",
          text: "What is the total transaction price in this contract?",
          options: [
            "€1 (the upfront payment)",
            "€701 (phone price plus upfront fee)",
            "€721 (€1 + 24 months × €30)",
            "€961 (€1 + 24 months × €40)",
          ],
          correctAnswer: 3,
        },
        {
          id: "q2",
          text: "How should the transaction price be allocated between the phone and the service?",
          options: [
            "€1 to phone, €960 to service",
            "€700 to phone, €261 to service",
            "Based on their relative standalone selling prices",
            "€700 to phone, €960 to service (no allocation needed)",
          ],
          correctAnswer: 2,
        },
        {
          id: "q3",
          text: "What amount of revenue should be recognized when the customer first signs up and receives the phone?",
          options: [
            "€1 (the upfront payment)",
            "€700 (standalone value of the phone)",
            "Approximately €630 (allocation based on relative standalone values)",
            "€0 (defer all revenue until service period)",
          ],
          correctAnswer: 2,
        },
      ],
      explanation:
        "This case showcases a multi-element arrangement requiring allocation of the transaction price. Under IFRS 15, when a contract includes multiple performance obligations, the transaction price (€961) is allocated based on relative standalone selling prices. For the phone: (€700 ÷ (€700 + €720)) × €961. For the service: (€720 ÷ (€700 + €720)) × €961.",
    },
  ];

  const handleAnswer = (questionIndex, optionIndex) => {
    setStudentAnswers({
      ...studentAnswers,
      [`${currentCase}-${questionIndex}`]: optionIndex,
    });
  };

  const handleSubmit = () => {
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
    setStudentAnswers({});
    setShowFeedback(false);
  };

  const currentCaseData = cases[currentCase];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">
        Revenue Recognition Decision Exercise
      </h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={handlePrevious}
          disabled={currentCase === 0}
          className={`px-4 py-2 rounded ${
            currentCase === 0 ? "bg-gray-300" : "bg-blue-600 text-white"
          }`}
        >
          Previous Case
        </button>
        <span className="px-4 py-2 bg-blue-100 rounded">
          Case {currentCase + 1} of {cases.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentCase === cases.length - 1}
          className={`px-4 py-2 rounded ${
            currentCase === cases.length - 1
              ? "bg-gray-300"
              : "bg-blue-600 text-white"
          }`}
        >
          Next Case
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">{currentCaseData.title}</h2>
        <p className="mb-4">{currentCaseData.description}</p>
      </div>

      <div className="space-y-6">
        {currentCaseData.questions.map((question, qIndex) => (
          <div key={question.id} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">
              Question {qIndex + 1}: {question.text}
            </h3>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-start">
                  <input
                    type="radio"
                    id={`${question.id}-${oIndex}`}
                    name={question.id}
                    checked={
                      studentAnswers[`${currentCase}-${qIndex}`] === oIndex
                    }
                    onChange={() => handleAnswer(qIndex, oIndex)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor={`${question.id}-${oIndex}`} className="block">
                    {option}
                  </label>
                </div>
              ))}
            </div>

            {showFeedback && (
              <div
                className={`mt-3 p-3 rounded ${
                  studentAnswers[`${currentCase}-${qIndex}`] ===
                  question.correctAnswer
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {studentAnswers[`${currentCase}-${qIndex}`] ===
                question.correctAnswer
                  ? "✓ Correct!"
                  : `✗ Incorrect. The correct answer is: ${
                      question.options[question.correctAnswer]
                    }`}
              </div>
            )}
          </div>
        ))}
      </div>

      {showFeedback && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Explanation:</h3>
          <p>{currentCaseData.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Check Answers
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reset Answers
        </button>
      </div>
    </div>
  );
};

export default RevenueRecognitionExercise;
