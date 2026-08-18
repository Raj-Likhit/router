/**
 * TypeScript types for OmniRoute AI
 */

export interface RouteComplaintRequest {
  complaint: string;
}

export interface RouteComplaintResponse {
  id: string;
  detected_language: string;
  translated_text: string;
  complaint_category: string;
  routed_department: string;
  priority: "High" | "Medium" | "Low";
  confidence?: number;
  timestamp: string;
  source?: "gemini" | "mock" | "fallback";
}

export interface ErrorResponse {
  id: string;
  error: string;
  fallback_department: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  originalText: string;
  detectedLanguage: string;
  translatedText: string;
  complaintCategory: string;
  routedDepartment: string;
  priority: "High" | "Medium" | "Low";
  timestamp: string;
  source: "gemini" | "mock" | "fallback";
  status: "routed" | "manual_review";
}

export interface QueueCount {
  [department: string]: number;
}

export interface SampleComplaint {
  id: string;
  text: string;
  label: string;
  sublabel: string;
  language: string;
}
