"""
Pre-generated mock responses for resilience.
Used when Gemini API fails or rate limits are hit.
Updated for enhanced multilingual pipeline.
Supports: English and Hindi only.
"""

MOCK_RESPONSES = {
    # Hindi - Billing
    "मेरा पैसा दो बार कट गया है।": {
        "detected_language": "Hindi",
        "language_confidence": 0.92,
        "original_text": "मेरा पैसा दो बार कट गया है।",
        "translated_text": "My payment was deducted twice.",
        "was_translated": True,
        "complaint_category": "Billing & Payments",
        "priority": "HIGH",
        "priority_score": 60,
        "priority_rationale": "Matched HIGH priority keywords",
        "priority_keywords_matched": ["payment"],
        "sla_hours": 12,
        "source": "mock"
    },
    # English - Security
    "I cannot log into my account and password reset is not working.": {
        "detected_language": "English",
        "language_confidence": 0.95,
        "original_text": "I cannot log into my account and password reset is not working.",
        "translated_text": "I cannot log into my account and password reset is not working.",
        "was_translated": False,
        "complaint_category": "Account & Security",
        "priority": "HIGH",
        "priority_score": 65,
        "priority_rationale": "Matched HIGH priority keywords: password",
        "priority_keywords_matched": ["password"],
        "sla_hours": 12,
        "source": "mock"
    },
    # English - General
    "What are your customer service hours?": {
        "detected_language": "English",
        "language_confidence": 0.98,
        "original_text": "What are your customer service hours?",
        "translated_text": "What are your customer service hours?",
        "was_translated": False,
        "complaint_category": "General Inquiry",
        "priority": "LOW",
        "priority_score": 25,
        "priority_rationale": "No risk keywords matched",
        "priority_keywords_matched": [],
        "sla_hours": 72,
        "source": "mock"
    },
    # Hindi - Technical Support
    "डेटाबेस कनेक्शन त्रुटि है।": {
        "detected_language": "Hindi",
        "language_confidence": 0.89,
        "original_text": "डेटाबेस कनेक्शन त्रुटि है।",
        "translated_text": "Database connection error.",
        "was_translated": True,
        "complaint_category": "Technical Support",
        "priority": "HIGH",
        "priority_score": 55,
        "priority_rationale": "Matched HIGH priority keywords",
        "priority_keywords_matched": ["connection"],
        "sla_hours": 12,
        "source": "mock"
    },
}


def get_mock_response(complaint_text):
    """
    Check if complaint text matches a pre-generated mock response.
    Returns None if no exact match found.
    """
    return MOCK_RESPONSES.get(complaint_text)


def get_all_mock_complaints():
    """Get list of all mock complaint texts for frontend."""
    return list(MOCK_RESPONSES.keys())
