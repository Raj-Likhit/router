"""
Multi-language risk keyword lists for priority scoring.
Detects risk terms in BOTH original and translated text.

Strategy:
- CRITICAL (75-100): Short circuit, fire, unauthorized access, data breach
- HIGH (50-74): Burnt, contaminated, extended outage (3+ days)
- MEDIUM (35-49): Delay, flickering, performance issues
- LOW (15-34): General inquiry, no risk keywords

Key insight: Hindi risk terms like "शॉर्ट सर्किट", "आग", etc. are detected
directly in original text WITHOUT needing pre-translation.
"""

PRIORITY_KEYWORDS = {
    # ========== CRITICAL (75-100 points) ==========
    "CRITICAL": {
        "English": [
            "short circuit", "fire", "icu", "unauthorized access", "data breach",
            "system compromised", "account hacked", "massive outage", "security threat",
            "emergency", "critical failure", "service down", "complete loss"
        ],
        "Hindi": [
            "शॉर्ट सर्किट", "आग", "आईसीयू", "अनधिकृत प्रवेश", "डेटा उल्लंघन",
            "सिस्टम समझौता", "खाता हैक", "विशाल आउटेज", "सुरक्षा खतरा",
            "आपातकाल", "गंभीर विफलता", "सेवा बंद", "पूर्ण हानि",
            "मृत्यु", "जीवन खतरा", "घातक", "विस्फोट", "रिसाव"
        ]
    },
    
    # ========== HIGH (50-74 points) ==========
    "HIGH": {
        "English": [
            "burnt", "contaminated", "3 days", "4 days", "5 days", "week",
            "blackout", "critical failure", "severe damage", "unable to work",
            "service disruption", "major issue", "escalation", "breach attempt",
            "stolen", "missing", "lost access", "system down"
        ],
        "Hindi": [
            "जला हुआ", "दूषित", "3 दिन", "4 दिन", "5 दिन", "हफ्ता",
            "ब्लैकआउट", "गंभीर विफलता", "गंभीर नुकसान", "काम करने में असमर्थ",
            "सेवा व्यवधान", "बड़ा मुद्दा", "वृद्धि", "उल्लंघन प्रयास",
            "चोरी", "लापता", "पहुंच खो दी", "सिस्टम डाउन",
            "बहुत खराब", "घंटों से", "रात भर", "पूरा दिन"
        ]
    },
    
    # ========== MEDIUM (35-49 points) ==========
    "MEDIUM": {
        "English": [
            "delay", "flickering", "slow", "error", "lag", "freeze", "hang",
            "intermittent", "unstable", "glitch", "malfunction", "temporary",
            "frustrated", "inconvenient", "workaround", "partial", "sporadic",
            "degraded", "performance", "issue", "problem", "complaint", "today"
        ],
        "Hindi": [
            "देरी", "झिलमिलाहट", "धीमा", "त्रुटि", "अंतराल", "जमना", "लटका",
            "रुक-रुक कर", "अस्थिर", "खराबी", "खराबी", "अस्थायी",
            "निराश", "असुविधाजनक", "समाधान", "आंशिक", "छिटपुट",
            "गिरी हुई", "प्रदर्शन", "समस्या", "मुद्दा", "शिकायत", "आज"
        ]
    },
    
    # ========== LOW (15-34 points) ==========
    # These are detected by NOT matching higher categories, so list is optional
    "LOW": {
        "English": [
            "inquiry", "question", "how to", "help", "support", "information",
            "request", "suggestion", "feedback", "thanks", "great", "excellent"
        ],
        "Hindi": [
            "प्रश्न", "पूछताछ", "कैसे", "मदद", "समर्थन", "जानकारी",
            "अनुरोध", "सुझाव", "प्रतिक्रिया", "धन्यवाद", "शानदार", "उत्कृष्ट"
        ]
    }
}


def calculate_priority(original_text, translated_text=None, language="English"):
    """
    Calculate priority level based on multi-language keyword matching.
    
    Scans BOTH original and translated text for risk keywords.
    This catches Hindi/Telugu risk terms without requiring pre-translation.
    
    Args:
        original_text: Original complaint text (potentially in Hindi)
        translated_text: English translation (if available)
        language: Detected language ("English" or "Hindi")
    
    Returns:
        {
            "priority": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
            "score": 15-100,
            "keywords_matched": ["short circuit", "fire"],
            "rationale": "Matched CRITICAL keywords in original text"
        }
    
    Example:
        result = calculate_priority("डेटा सुरक्षा की समस्या है।", language="Hindi")
        # Returns: {
        #     "priority": "CRITICAL",
        #     "score": 75,
        #     "keywords_matched": ["डेटा उल्लंघन"],
        #     "rationale": "Matched CRITICAL keywords in original text"
        # }
    """
    score = 25  # Base LOW priority
    matched_keywords = []
    matched_level = None
    
    # Texts to scan: original + translated (if different)
    texts_to_scan = {
        "original": original_text.lower()
    }
    if translated_text and translated_text != original_text:
        texts_to_scan["translated"] = translated_text.lower()
    
    # Determine which language keyword list to use
    keyword_language = language if language in PRIORITY_KEYWORDS["CRITICAL"] else "English"
    
    # Scan for CRITICAL keywords first (highest priority)
    for keyword in PRIORITY_KEYWORDS["CRITICAL"].get(keyword_language, []):
        for text_key, text_content in texts_to_scan.items():
            if keyword.lower() in text_content:
                score = 80  # Set to CRITICAL range
                matched_keywords.append(f"{keyword} (in {text_key})")
                matched_level = "CRITICAL"
                break
        if matched_level == "CRITICAL":
            break
    
    # If not CRITICAL, check HIGH
    if matched_level != "CRITICAL":
        for keyword in PRIORITY_KEYWORDS["HIGH"].get(keyword_language, []):
            for text_key, text_content in texts_to_scan.items():
                if keyword.lower() in text_content:
                    if score < 60:  # Only override if not already high
                        score = 60  # Set to HIGH range
                        matched_level = "HIGH"
                        matched_keywords.append(f"{keyword} (in {text_key})")
                    break
            if matched_level == "HIGH":
                break
    
    # If not CRITICAL or HIGH, check MEDIUM
    if matched_level not in ["CRITICAL", "HIGH"]:
        for keyword in PRIORITY_KEYWORDS["MEDIUM"].get(keyword_language, []):
            for text_key, text_content in texts_to_scan.items():
                if keyword.lower() in text_content:
                    if score < 40:  # Only override if not already medium+
                        score = 40  # Set to MEDIUM range
                        matched_level = "MEDIUM"
                        matched_keywords.append(f"{keyword} (in {text_key})")
                    break
            if matched_level == "MEDIUM":
                break
    
    # Determine final priority level from score
    if score >= 75:
        priority = "CRITICAL"
        rationale = "Matched CRITICAL keywords"
    elif score >= 50:
        priority = "HIGH"
        rationale = "Matched HIGH priority keywords"
    elif score >= 35:
        priority = "MEDIUM"
        rationale = "Matched MEDIUM priority keywords"
    else:
        priority = "LOW"
        rationale = "No risk keywords matched"
    
    if matched_keywords:
        rationale += f": {', '.join(matched_keywords[:2])}"
    
    return {
        "priority": priority,
        "score": score,
        "keywords_matched": matched_keywords[:3],  # Top 3 matches
        "rationale": rationale,
        "sla_hours": {
            "CRITICAL": 2,
            "HIGH": 12,
            "MEDIUM": 24,
            "LOW": 72
        }[priority]
    }


# Test examples
if __name__ == "__main__":
    test_cases = [
        ("मेरा पैसा दो बार कट गया है।", None, "Hindi"),
        ("डेटाबेस कनेक्शन त्रुटि है।", None, "Hindi"),
        ("मैं अपने अकाउंट में लॉगिन नहीं कर सकता।", None, "Hindi"),
        ("Short circuit in the main panel.", None, "English"),
        ("The server is down and we cannot access any files.", None, "English"),
        ("What are your customer service hours?", None, "English"),
    ]
    
    print("=" * 80)
    print("PRIORITY SCORING ENGINE - TEST RESULTS")
    print("=" * 80)
    
    for original, translated, lang in test_cases:
        result = calculate_priority(original, translated, lang)
        print(f"\nComplaint: {original[:60]}")
        print(f"Language: {lang}")
        print(f"Priority: {result['priority']} (Score: {result['score']}, SLA: {result['sla_hours']}h)")
        print(f"Matched: {', '.join(result['keywords_matched']) if result['keywords_matched'] else 'None'}")
        print(f"Reason: {result['rationale']}")
