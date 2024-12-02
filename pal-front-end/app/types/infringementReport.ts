export type InfringementReport = {
    analysis_id: string;
    patent_id: string;
    company_name: string;
    analysis_date: string;
    top_infringing_products: {
      product_name: string;
      infringement_likelihood: string;
      relevant_claims: string[];
      explanation: string;
      specific_features: string[];
    }[];
    overall_risk_assessment: string;
  };