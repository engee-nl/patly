import React, { useState } from "react";
import { fetchPatentId, fetchCompanyName } from "../services/infringementService"

interface Suggestion {
  id: string;
  name: string;
}

interface AutocompleteInputsProps {
    showNotification: (message: string, type: "success" | "error" | "info") => void;
    setPatentId: (patent_id:string) => void;
    setCompanyName: (company_name:string) => void;
}

const AutocompleteInputs: React.FC<AutocompleteInputsProps> = ({ showNotification, setPatentId, setCompanyName }) => {
  const [patentSuggestions, setPatentSuggestions] = useState<Suggestion[]>([]);
  const [companySuggestions, setCompanySuggestions] = useState<Suggestion[]>([]);

  const [selectedPatent, setSelectedPatent] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const [isPatentLoading, setIsPatentLoading] = useState(false);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);

  const [showPatentSuggestions, setShowPatentSuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  // Fetch patent suggestions
  const handlePatentChange = async (query: string) => {
    setSelectedPatent(query);
    setPatentId(query);
    if (query.trim()) {
      setIsPatentLoading(true);
      const suggestions = await fetchPatentId({"patent_id" : query});
      if (suggestions){
        setPatentSuggestions(suggestions);
        setShowPatentSuggestions(true);
      }
      setIsPatentLoading(false);
    } else {
      setShowPatentSuggestions(false);
    }
  };

  // Fetch company suggestions
  const handleCompanyChange = async (query: string) => {
    setSelectedCompany(query);
    setCompanyName(query);
    if (query.trim()) {
      setIsCompanyLoading(true);
      const suggestions = await fetchCompanyName({"company_name" : query});
      if (suggestions){
        setCompanySuggestions(suggestions);
        setShowCompanySuggestions(true);
      }
      setIsCompanyLoading(false);
    } else {
      setShowCompanySuggestions(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Autocomplete for Patent ID */}
      <div className="relative">
        <label htmlFor="patent" className="block text-sm font-medium text-gray-700">
          Patent ID
        </label>
        <input
          id="patent"
          type="text"
          value={selectedPatent}
          onChange={(e) => handlePatentChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          placeholder="Search for a Patent ID"
        />
        {showPatentSuggestions && !isPatentLoading && (
          <ul className="absolute top-16 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
            {patentSuggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => {
                  setSelectedPatent(suggestion.id);
                  setPatentId(suggestion.id);
                  setShowPatentSuggestions(false);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Autocomplete for Company Name */}
      <div className="relative">
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          id="company"
          type="text"
          value={selectedCompany}
          onChange={(e) => handleCompanyChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          placeholder="Search for a Company Name"
        />
        {isCompanyLoading && (
          <div className="absolute top-8 w-full text-center text-gray-500">Loading...</div>
        )}
        {showCompanySuggestions && !isCompanyLoading && (
          <ul className="absolute top-16 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
            {companySuggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => {
                  setSelectedCompany(suggestion.id);
                  setCompanyName(suggestion.id);
                  setShowCompanySuggestions(false);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutocompleteInputs;