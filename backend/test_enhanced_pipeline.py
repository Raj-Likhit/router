"""
Quick test of the enhanced multilingual pipeline.
"""

import requests
import json

BASE_URL = "http://localhost:5000"

test_complaints = [
    ("मेरा पैसा दो बार कट गया है।", "Hindi: Billing"),
    ("डेटाबेस कनेक्शन त्रुटि है।", "Hindi: Technical"),
    ("I cannot log into my account and password reset is not working.", "English: Security"),
    ("What are your customer service hours?", "English: General"),
    ("Some random complaint not in dictionary", "New: Should use Gemini"),
]

print("=" * 80)
print("ENHANCED MULTILINGUAL PIPELINE - TEST")
print("=" * 80)
print()

for complaint, label in test_complaints:
    try:
        response = requests.post(
            f"{BASE_URL}/api/route-complaint",
            json={"complaint": complaint},
            timeout=10
        )
        result = response.json()
        
        print(f"✓ {label}")
        print(f"  Complaint: {complaint[:50]}")
        print(f"  Language: {result.get('detected_language')} ({result.get('language_confidence')})")
        print(f"  Translated: {result.get('was_translated')}")
        print(f"  Priority: {result.get('priority')} (score: {result.get('priority_score')})")
        print(f"  Category: {result.get('complaint_category')}")
        print(f"  Department: {result.get('routed_department')}")
        print(f"  Source: {result.get('source')}")
        print(f"  Processing: {result.get('processing_steps')}")
        print()
        
    except Exception as e:
        print(f"✗ {label}")
        print(f"  Error: {str(e)}")
        print()

print("=" * 80)
print("TEST COMPLETE")
print("=" * 80)
