import React from 'react';

const Results = ({ evaluation }) => {
  if (!evaluation) return null;

  const renderMetrics = (metrics) => {
    return metrics.map((metric, index) => (
      <div key={index} className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium">{metric.name}</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
            {metric.score}/10
          </span>
        </div>
        <p className="text-sm text-gray-600">{metric.feedback}</p>
      </div>
    ));
  };

  return (
    <div className="mt-6 space-y-6">
      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-3 text-blue-700">
          {evaluation.delivery.judge_name}
        </h2>
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <span className="font-semibold">Overall Score: </span>
          <span className="text-lg font-bold text-blue-700">
            {evaluation.delivery.overall_score.toFixed(1)}/10
          </span>
        </div>
        <div className="space-y-3">
          {renderMetrics(evaluation.delivery.metrics)}
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-bold mb-3 text-green-700">
          {evaluation.content.judge_name}
        </h2>
        <div className="mb-4 p-3 bg-green-50 rounded-md">
          <span className="font-semibold">Overall Score: </span>
          <span className="text-lg font-bold text-green-700">
            {evaluation.content.overall_score.toFixed(1)}/10
          </span>
        </div>
        <div className="space-y-3">
          {renderMetrics(evaluation.content.metrics)}
        </div>
      </div>
    </div>
  );
};

export default Results;