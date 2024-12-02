import React from "react";
import { InfringementReport } from "../types/infringementReport";

interface ReportProps {
  report: InfringementReport;
  onSave?: (report: InfringementReport) => void;
  onDelete?: (reportId: string) => void;
  isSaved?: boolean;
}

const Report: React.FC<ReportProps> = ({ report, onSave, onDelete, isSaved }) => {
  return (
    <div className="border border-gray-300 rounded-md p-4">
      <div className="mb-4">
        <p className="text-gray-700">Patent ID: <span className="font-semibold">{report.patent_id}</span></p>
        <p className="text-gray-700">Company: <span className="font-semibold">{report.company_name}</span></p>
        <p className="text-gray-700">Analysis Date: <span className="font-semibold">{report.analysis_date}</span></p>
        <p className="text-gray-700 mt-2">Overall Risk Assessment: <span className="font-semibold text-green-600">{report.overall_risk_assessment}</span></p>
      </div>
      <ul className="divide-y divide-gray-200">
        {report.top_infringing_products && report.top_infringing_products.map((product, index) => (
          <li key={index} className="p-4 flex flex-col md:flex-row items-start md:items-center">
            <div className="md:flex-1">
              <h2 className="text-lg font-semibold text-gray-800">{product.product_name}</h2>
              <p className="text-gray-600">Infringement Likelihood: <span className={`font-semibold ${product.infringement_likelihood === 'Moderate' ? 'text-orange-600' : 'text-green-600'}`}>{product.infringement_likelihood}</span></p>
              <p className="text-gray-600 mt-1">Relevant Claims: {product.relevant_claims.join(', ')}</p>
              <p className="text-gray-600 mt-1">Explanation: {product.explanation}</p>
            </div>
          </li>
        ))}
      </ul>
      {!isSaved && onSave && (
        <button
          onClick={() => onSave(report)}
          className="mt-2 bg-green-500 text-white rounded-md py-1 px-4 font-semibold hover:bg-green-600 mr-2"
        >
          Save Report
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(report.analysis_id)}
          className="mt-2 bg-red-500 text-white rounded-md py-1 px-4 font-semibold hover:bg-red-600"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default Report;