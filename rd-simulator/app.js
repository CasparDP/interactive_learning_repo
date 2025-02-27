// Simple check to make sure the file loads properly
console.log("app.js loading successfully");

// Make sure dependencies are available
if (typeof React === "undefined") {
  throw new Error("React library not found");
}

if (typeof ReactDOM === "undefined") {
  throw new Error("ReactDOM library not found");
}

if (typeof Recharts === "undefined") {
  throw new Error("Recharts library not found");
}

// Use React and Recharts from global scope
const { useState, useEffect } = React;
const {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} = Recharts;

const RDAccountingSimulator = () => {
  // Default values for our simulation
  const defaultValues = {
    initialCash: 500,
    otherAssets: 500,
    debt: 700,
    equity: 300,
    researchExpense: 150,
    developmentExpense: 100,
    revenue: 200,
    amortizationRate: 25, // % of capitalized development cost amortized per year
    simulationYears: 5,
  };

  // State for user inputs
  const [inputs, setInputs] = useState(defaultValues);

  // State for the accounting approach
  const [accountingMethod, setAccountingMethod] = useState("expenseAll"); // 'expenseAll' or 'capitalizeDevelopment'

  // State for simulation results
  const [simulationResults, setSimulationResults] = useState({
    expenseAll: [],
    capitalizeDevelopment: [],
  });

  // State for financial ratios
  const [ratios, setRatios] = useState({
    expenseAll: { roe: [], assetTurnover: [] },
    capitalizeDevelopment: { roe: [], assetTurnover: [] },
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  // Reset to default values
  const handleReset = () => {
    setInputs(defaultValues);
  };

  // Run simulation
  useEffect(() => {
    runSimulation();
  }, [inputs]);

  const runSimulation = () => {
    // Simulate both accounting methods
    const expenseAllResults = simulateMethod("expenseAll");
    const capitalizeDevelopmentResults = simulateMethod(
      "capitalizeDevelopment"
    );

    setSimulationResults({
      expenseAll: expenseAllResults,
      capitalizeDevelopment: capitalizeDevelopmentResults,
    });

    // Calculate ratios for both methods
    const expenseAllRatios = calculateRatios(expenseAllResults);
    const capitalizeDevelopmentRatios = calculateRatios(
      capitalizeDevelopmentResults
    );

    setRatios({
      expenseAll: expenseAllRatios,
      capitalizeDevelopment: capitalizeDevelopmentRatios,
    });
  };

  const simulateMethod = (method) => {
    const results = [];

    // Initial state
    let currentYear = {
      year: 0,
      cash: inputs.initialCash,
      otherAssets: inputs.otherAssets,
      intangibleAssets: 0,
      totalAssets: inputs.initialCash + inputs.otherAssets,
      debt: inputs.debt,
      equity: inputs.equity,
      revenue: 0,
      researchExpense: 0,
      developmentExpense: 0,
      amortizationExpense: 0,
      profit: 0,
      roe: 0,
      assetTurnover: 0,
    };

    results.push({ ...currentYear });

    // Simulate for each year
    for (let year = 1; year <= inputs.simulationYears; year++) {
      const prevYear = results[year - 1];

      // Create a deep copy for the current year
      const newYear = {
        year,
        cash: prevYear.cash,
        otherAssets: prevYear.otherAssets,
        intangibleAssets: prevYear.intangibleAssets,
        debt: prevYear.debt,
        revenue: inputs.revenue,
        researchExpense: inputs.researchExpense,
        developmentExpense: inputs.developmentExpense,
      };

      // Cash outflows for R&D
      newYear.cash -= inputs.researchExpense + inputs.developmentExpense;

      // Cash inflows from revenue
      newYear.cash += inputs.revenue;

      // Treatment of R&D expenses differs by accounting method
      if (method === "expenseAll") {
        // Expense both research and development
        newYear.amortizationExpense = 0;
        newYear.profit =
          newYear.revenue -
          newYear.researchExpense -
          newYear.developmentExpense;
      } else {
        // Capitalize development costs
        newYear.intangibleAssets =
          prevYear.intangibleAssets + inputs.developmentExpense;

        // Amortize development costs
        newYear.amortizationExpense =
          (newYear.intangibleAssets * inputs.amortizationRate) / 100;
        newYear.intangibleAssets -= newYear.amortizationExpense;

        // Only research is expensed immediately
        newYear.profit =
          newYear.revenue -
          newYear.researchExpense -
          newYear.amortizationExpense;
      }

      // Update equity based on profit
      newYear.equity = prevYear.equity + newYear.profit;

      // Calculate total assets
      newYear.totalAssets =
        newYear.cash + newYear.otherAssets + newYear.intangibleAssets;

      // Calculate financial ratios
      newYear.roe = (newYear.profit / prevYear.equity) * 100; // ROE as percentage
      newYear.assetTurnover = newYear.revenue / prevYear.totalAssets;

      results.push(newYear);
    }

    return results;
  };

  const calculateRatios = (results) => {
    const roeValues = results.slice(1).map((year) => ({
      year: year.year,
      value: year.roe,
    }));

    const assetTurnoverValues = results.slice(1).map((year) => ({
      year: year.year,
      value: year.assetTurnover,
    }));

    return {
      roe: roeValues,
      assetTurnover: assetTurnoverValues,
    };
  };

  // Prepare chart data
  const prepareChartData = (metric) => {
    const data = [];

    for (let i = 0; i <= inputs.simulationYears; i++) {
      const expenseAllValue = simulationResults.expenseAll[i]
        ? simulationResults.expenseAll[i][metric]
        : 0;
      const capitalizeDevelopmentValue = simulationResults
        .capitalizeDevelopment[i]
        ? simulationResults.capitalizeDevelopment[i][metric]
        : 0;

      data.push({
        year: i,
        "Expense All R&D": expenseAllValue,
        "Capitalize Development": capitalizeDevelopmentValue,
      });
    }

    return data;
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Prepare data for comparison tables
  const prepareTableData = () => {
    if (
      simulationResults.expenseAll.length === 0 ||
      simulationResults.capitalizeDevelopment.length === 0
    ) {
      return [];
    }

    return simulationResults.expenseAll.map((yearData, index) => {
      const capDevYearData = simulationResults.capitalizeDevelopment[index];
      return {
        year: yearData.year,
        profit: {
          expenseAll: yearData.profit,
          capitalizeDevelopment: capDevYearData.profit,
          difference: capDevYearData.profit - yearData.profit,
        },
        equity: {
          expenseAll: yearData.equity,
          capitalizeDevelopment: capDevYearData.equity,
          difference: capDevYearData.equity - yearData.equity,
        },
        totalAssets: {
          expenseAll: yearData.totalAssets,
          capitalizeDevelopment: capDevYearData.totalAssets,
          difference: capDevYearData.totalAssets - yearData.totalAssets,
        },
      };
    });
  };

  const tableData = prepareTableData();

  // Ratio comparison data for the selected year
  const selectedYear = Math.min(
    inputs.simulationYears,
    Math.max(1, inputs.simulationYears)
  );
  const yearRatioData = {
    roe: {
      expenseAll:
        ratios.expenseAll.roe.find((r) => r.year === selectedYear)?.value || 0,
      capitalizeDevelopment:
        ratios.capitalizeDevelopment.roe.find((r) => r.year === selectedYear)
          ?.value || 0,
    },
    assetTurnover: {
      expenseAll:
        ratios.expenseAll.assetTurnover.find((r) => r.year === selectedYear)
          ?.value || 0,
      capitalizeDevelopment:
        ratios.capitalizeDevelopment.assetTurnover.find(
          (r) => r.year === selectedYear
        )?.value || 0,
    },
  };

  return (
    <div className="flex flex-col w-full">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h1 className="text-xl font-bold mb-4">
          R&D Accounting Treatment Simulator
        </h1>
        <p className="mb-2">
          This simulator demonstrates how different accounting treatments for
          R&D expenditures affect financial statements and key ratios over time.
        </p>
        <ul className="list-disc ml-6 mb-2">
          <li>
            <strong>Expense All R&D:</strong> Both research and development
            costs are immediately expensed
          </li>
          <li>
            <strong>Capitalize Development:</strong> Research costs are
            expensed, but development costs are capitalized and amortized
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap mb-8">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-lg font-bold mb-4">Simulation Parameters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Initial Cash
              </label>
              <input
                type="number"
                name="initialCash"
                value={inputs.initialCash}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Other Assets
              </label>
              <input
                type="number"
                name="otherAssets"
                value={inputs.otherAssets}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Initial Debt
              </label>
              <input
                type="number"
                name="debt"
                value={inputs.debt}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Initial Equity
              </label>
              <input
                type="number"
                name="equity"
                value={inputs.equity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Annual Revenue
              </label>
              <input
                type="number"
                name="revenue"
                value={inputs.revenue}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Annual Research Expense
              </label>
              <input
                type="number"
                name="researchExpense"
                value={inputs.researchExpense}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Annual Development Expense
              </label>
              <input
                type="number"
                name="developmentExpense"
                value={inputs.developmentExpense}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amortization Rate (% per year)
              </label>
              <input
                type="number"
                name="amortizationRate"
                value={inputs.amortizationRate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Simulation Years
              </label>
              <input
                type="number"
                name="simulationYears"
                value={inputs.simulationYears}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
            <div className="col-span-2">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-lg font-bold mb-4">Financial Statement Impact</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1 text-sm">Year</th>
                  <th className="border px-2 py-1 text-sm" colSpan={3}>
                    Profit
                  </th>
                  <th className="border px-2 py-1 text-sm" colSpan={3}>
                    Equity
                  </th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1 text-sm"></th>
                  <th className="border px-2 py-1 text-sm">Expense All</th>
                  <th className="border px-2 py-1 text-sm">Capitalize Dev</th>
                  <th className="border px-2 py-1 text-sm">Diff</th>
                  <th className="border px-2 py-1 text-sm">Expense All</th>
                  <th className="border px-2 py-1 text-sm">Capitalize Dev</th>
                  <th className="border px-2 py-1 text-sm">Diff</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((yearData) => (
                  <tr
                    key={`year-${yearData.year}`}
                    className={
                      yearData.year % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }
                  >
                    <td className="border px-2 py-1 text-sm font-bold">
                      {yearData.year}
                    </td>
                    <td className="border px-2 py-1 text-sm text-right">
                      {formatCurrency(yearData.profit.expenseAll)}
                    </td>
                    <td className="border px-2 py-1 text-sm text-right">
                      {formatCurrency(yearData.profit.capitalizeDevelopment)}
                    </td>
                    <td
                      className={`border px-2 py-1 text-sm text-right ${
                        yearData.profit.difference > 0
                          ? "text-green-600"
                          : yearData.profit.difference < 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {formatCurrency(yearData.profit.difference)}
                    </td>
                    <td className="border px-2 py-1 text-sm text-right">
                      {formatCurrency(yearData.equity.expenseAll)}
                    </td>
                    <td className="border px-2 py-1 text-sm text-right">
                      {formatCurrency(yearData.equity.capitalizeDevelopment)}
                    </td>
                    <td
                      className={`border px-2 py-1 text-sm text-right ${
                        yearData.equity.difference > 0
                          ? "text-green-600"
                          : yearData.equity.difference < 0
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {formatCurrency(yearData.equity.difference)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-bold mt-6 mb-4">
            Financial Ratios Comparison (Year {selectedYear})
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Return on Equity (ROE)</h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Expense All:</p>
                  <p className="text-lg font-bold">
                    {yearRatioData.roe.expenseAll.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm">Capitalize Development:</p>
                  <p className="text-lg font-bold">
                    {yearRatioData.roe.capitalizeDevelopment.toFixed(2)}%
                  </p>
                </div>
              </div>
              <p
                className={`text-sm mt-2 ${
                  yearRatioData.roe.capitalizeDevelopment >
                  yearRatioData.roe.expenseAll
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Difference:{" "}
                {(
                  yearRatioData.roe.capitalizeDevelopment -
                  yearRatioData.roe.expenseAll
                ).toFixed(2)}
                %
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Asset Turnover</h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm">Expense All:</p>
                  <p className="text-lg font-bold">
                    {yearRatioData.assetTurnover.expenseAll.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm">Capitalize Development:</p>
                  <p className="text-lg font-bold">
                    {yearRatioData.assetTurnover.capitalizeDevelopment.toFixed(
                      2
                    )}
                  </p>
                </div>
              </div>
              <p
                className={`text-sm mt-2 ${
                  yearRatioData.assetTurnover.capitalizeDevelopment >
                  yearRatioData.assetTurnover.expenseAll
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Difference:{" "}
                {(
                  yearRatioData.assetTurnover.capitalizeDevelopment -
                  yearRatioData.assetTurnover.expenseAll
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Profit Trends Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={prepareChartData("profit")}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                label={{ value: "Year", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "Profit", angle: -90, position: "insideLeft" }}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Expense All R&D"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="Capitalize Development"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        <div>
          <h2 className="text-lg font-bold mb-4">Return on Equity (ROE)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ratios.expenseAll.roe.map((item, index) => ({
                  year: item.year,
                  "Expense All R&D": item.value,
                  "Capitalize Development":
                    ratios.capitalizeDevelopment.roe[index]?.value || 0,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{
                    value: "Year",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "ROE (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Expense All R&D"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Capitalize Development"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Asset Turnover</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={ratios.expenseAll.assetTurnover.map((item, index) => ({
                  year: item.year,
                  "Expense All R&D": item.value,
                  "Capitalize Development":
                    ratios.capitalizeDevelopment.assetTurnover[index]?.value ||
                    0,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{
                    value: "Year",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Asset Turnover",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip formatter={(value) => value.toFixed(2)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Expense All R&D"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="Capitalize Development"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-4 mt-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-blue-800 mb-2">Short-term Impact</h3>
            <p>
              Capitalizing development costs typically leads to higher reported
              profits in the early years compared to expensing all R&D costs.
              This is because development costs are spread over multiple periods
              rather than being expensed immediately.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-blue-800 mb-2">
              Long-term Convergence
            </h3>
            <p>
              Over time, the cumulative profit difference tends to diminish as
              amortization expenses catch up with the capitalized amounts. Total
              lifetime profits will be the same under both methods, but the
              timing of profit recognition differs.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-blue-800 mb-2">ROE Effect</h3>
            <p>
              Return on Equity is typically higher when capitalizing development
              costs in the early years of high R&D investment. This accounting
              choice can significantly impact performance evaluation and
              potentially management behavior.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-blue-800 mb-2">
              Asset Turnover Distortion
            </h3>
            <p>
              Asset turnover ratios are lower when development costs are
              capitalized because total assets are higher. This may create a
              misleading impression of operational efficiency when comparing
              companies with different R&D accounting policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wait for dom content to be loaded
document.addEventListener("DOMContentLoaded", function () {
  try {
    console.log("Attempting to render app");
    console.log("Libraries present:", {
      React: !!window.React,
      ReactDOM: !!window.ReactDOM,
      Recharts: !!window.Recharts,
    });

    // Make sure we have all required libraries
    if (!window.React || !window.ReactDOM || !window.Recharts) {
      throw new Error("Required libraries missing before rendering");
    }

    // Render the app
    ReactDOM.render(<RDAccountingSimulator />, document.getElementById("root"));
  } catch (error) {
    console.error("Error rendering the app:", error);
    document.getElementById("root").innerHTML = `
      <div class="p-4 bg-red-100 text-red-700 rounded">
        <h2 class="font-bold mb-2">Error Rendering Simulator</h2>
        <p class="mb-2">Sorry, there was a problem rendering the simulator: ${
          error.message || "Unknown error"
        }</p>
        <p class="mb-2">Please check your browser console for more details.</p>
        <button onclick="window.location.reload()" class="bg-red-700 text-white px-4 py-2 rounded">
          Try Refreshing
        </button>
      </div>
    `;
  }
});
