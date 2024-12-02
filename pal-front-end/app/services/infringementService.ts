// services/infringementService.ts

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export interface InfringementRequest {
    patent_id: string;
    company_name: string;
}

export interface TopInfringingProduct {
    product_name: string;
    infringement_likelihood: string;
    relevant_claims: string[];
    explanation: string;
    specific_features: string[];
}

export interface InfringementReport {
    analysis_id: string;
    patent_id: string;
    company_name: string;
    analysis_date: string;
    top_infringing_products: TopInfringingProduct[];
    overall_risk_assessment: string;
}

export interface PatentIdFetchRequest {
    patent_id: string;
}

export interface CompanyNameFetchRequest {
    company_name: string;
}

export interface AutoCompleteRow {
    id: string;
    name: string
}

export const checkInfringement = async (requestData: InfringementRequest): Promise<InfringementReport | null> => {
    try {
        const response = await fetch(`${API_HOST}/patents/check-infringement`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            console.error("Error checking infringement");
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Network or Parsing Error:", error instanceof Error ? error.message : error);
        return null; 
    }
};

export const fetchPatentId = async (requestData: PatentIdFetchRequest): Promise<AutoCompleteRow[]> => {
    try {
        const response = await fetch(`${API_HOST}/patents/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            console.error("Error searching patents");
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("Network or Parsing Error:", error instanceof Error ? error.message : error);
        return []; 
    }
};

export const fetchCompanyName = async (requestData: CompanyNameFetchRequest): Promise<AutoCompleteRow[]> => {
    try {
        const response = await fetch(`${API_HOST}/companies/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            console.error("Error searching companies");
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("Network or Parsing Error:", error instanceof Error ? error.message : error);
        return []; 
    }
};