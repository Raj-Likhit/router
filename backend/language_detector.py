"""
Unicode-based language detection for English and Hindi.
No external libraries - pure character code point analysis.
Instant, offline, deterministic.
"""


def detect_language_unicode(text):
    """
    Detect language using Unicode character ranges.
    
    Supports:
    - Hindi (Devanagari): U+0900 – U+097F
    - English (Latin): U+0041-U+005A, U+0061-U+007A
    - Unsupported: Any other script
    
    Returns: (language, confidence_score)
    Example: ("Hindi", 0.87) means 87% Hindi characters detected
    """
    if not text or not text.strip():
        return "Unsupported", 0.0
    
    hindi_count = 0
    english_count = 0
    other_count = 0
    
    for char in text:
        code = ord(char)
        
        # Hindi (Devanagari script)
        if 0x0900 <= code <= 0x097F:
            hindi_count += 1
        # English (ASCII letters only, ignore numbers/punctuation for cleaner detection)
        elif (0x0041 <= code <= 0x005A) or (0x0061 <= code <= 0x007A):
            english_count += 1
        # Other characters (numbers, punctuation, emojis, etc.)
        else:
            other_count += 1
    
    # Total characters that are meaningful for language detection
    total = hindi_count + english_count
    
    if total == 0:
        # No identifiable characters
        return "Unsupported", 0.0
    
    # Calculate confidence for each language
    hindi_confidence = hindi_count / total if total > 0 else 0.0
    english_confidence = english_count / total if total > 0 else 0.0
    
    # If one language has > 60% of characters, it's dominant
    if hindi_confidence > english_confidence:
        if hindi_confidence > 0.6:
            return "Hindi", round(hindi_confidence, 2)
        elif hindi_count >= english_count:
            return "Hindi", round(hindi_confidence, 2)
        else:
            return "English", round(english_confidence, 2)
    else:
        if english_confidence > 0.6:
            return "English", round(english_confidence, 2)
        else:
            return "English", round(english_confidence, 2)


def is_hindi(text):
    """Quick check if text contains significant Hindi content."""
    language, confidence = detect_language_unicode(text)
    return language == "Hindi" and confidence > 0.3


def is_english(text):
    """Quick check if text is predominantly English."""
    language, confidence = detect_language_unicode(text)
    return language == "English" or confidence < 0.4


# Test examples (for debugging)
if __name__ == "__main__":
    test_cases = [
        "मेरा पैसा दो बार कट गया है।",
        "डेटाबेस कनेक्शन त्रुटि है।",
        "I cannot log into my account and password reset is not working.",
        "My payment was deducted twice.",
        "Hello मेरा नाम है",
        "नमस्ते 123 test",
        "😀 नहीं समझ आया 😀",
        "我无法登录",  # Chinese - should be Unsupported
    ]
    
    for text in test_cases:
        lang, conf = detect_language_unicode(text)
        print(f"{lang:12} ({conf:.2f}): {text[:50]}")
