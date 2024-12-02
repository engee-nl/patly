'use client'
import { useState, useEffect } from "react";
import Notification from './components/Notification';
import Report from "./components/Report";
import AutocompleteInputs from "./components/AutocompleteInputs";
import { InfringementReport } from "./types/infringementReport";
import { checkInfringement, InfringementRequest, } from "./services/infringementService";

export default function Home() {
  const [patentId, setPatentId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [reports, setReports] = useState<InfringementReport[]>([]);
  const [savedReports, setSavedReports] = useState<InfringementReport[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved reports from localStorage on page load
    const storedReports = localStorage.getItem("infringementReports");
    if (storedReports) {
      setSavedReports(JSON.parse(storedReports));
    }
  }, []);

  // Handle the notification component

  const showNotification = (message: string, type: "success" | "error" | "info") => {
    setNotification({ message, type });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleCheckInfringement = async () => {
    if (!patentId || !companyName) {
      showNotification("Please fill in both Patent ID and Company Name.", "error");
      return;
    }

    setLoading(true);

    const requestData: InfringementRequest = {
      patent_id: patentId,
      company_name: companyName,
    };

    try {
      const report: InfringementReport | null = await checkInfringement(requestData);
      if (report) {
        const isDuplicate = reports.some((r) => r.analysis_id === report.analysis_id);
        if (!isDuplicate) {
          setReports((prev) => [...prev, report]);
        }
      }
    } catch (error) {
      showNotification(`Error: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Save report to local storage
  const saveReport = (report: InfringementReport) => {
    const isDuplicate = savedReports.some((r) => r.analysis_id === report.analysis_id);
    if (isDuplicate) {
      showNotification("This report is already saved.", "info");
      return;
    }

    const updatedReports = [...savedReports, report];
    setSavedReports(updatedReports);
    localStorage.setItem("infringementReports", JSON.stringify(updatedReports));
    showNotification("Report saved successfully!", "success");
  };

  // Delete report from local storage
  const deleteReport = (analysisId: string) => {
    const updatedReports = savedReports.filter((r) => r.analysis_id !== analysisId);
    setSavedReports(updatedReports);
    localStorage.setItem("infringementReports", JSON.stringify(updatedReports));
    showNotification("Report deleted successfully!", "success");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Notification message={notification?.message || ""} type={notification?.type || "error"} />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-md p-6">
        <h1 className="text-2xl font-bold mb-4">Patent Infringement Checker</h1>

        <div className="space-y-4">
          <AutocompleteInputs setCompanyName={setCompanyName} setPatentId={setPatentId} />
          <div className="space-y-2"></div>
          <button
            onClick={handleCheckInfringement}
            className="w-full bg-blue-500 text-white rounded-md p-3 font-semibold hover:bg-blue-600"
          >
            Check
          </button>
        </div>

        <h2 className="text-xl font-semibold mt-6">Results</h2>
        <div className="space-y-4 mt-4">
          {(reports.length === 0) ? (
            <p className="text-gray-500 text-center">No results found.</p>
          ) : (
            reports.map((report) => (
              <Report
                key={report.analysis_id}
                report={report}
                onSave={saveReport}
              />
            ))
          )}
        </div>

        <h2 className="text-xl font-semibold mt-6">Saved Reports</h2>
        <div className="space-y-4 mt-4">
          {(savedReports.length === 0) ? (
            <p className="text-gray-500 text-center">No saved reports found.</p>
          ) : (
            savedReports.map((report) => (
              <Report
                key={report.analysis_id}
                report={report}
                onDelete={deleteReport}
                isSaved
              />
            ))
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-lg font-semibold">Checking...</p>
          </div>
        </div>
      )}
    </div>
  );
}