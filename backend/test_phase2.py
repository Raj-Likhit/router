#!/usr/bin/env python3
"""
Phase 2: Gemini Integration Test
Tests API with 3 sample prompts and validates response schema
"""

import requests
import json
from typing import Dict, Any

BASE_URL = "http://localhost:5000"

# Test cases: (description, complaint_text, expected_language)
TEST_CASES = [
    ("English complaint", "I cannot log into my account", "English"),
    ("Hindi complaint", "मेरा पैसा दो बार कट गया है।", "Hindi"),
    ("Unsupported language", "我无法登录我的账户。", "Unsupported"),
]

def validate_response(response: Dict[str, Any], test_name: str) -> bool:
    """Validate response structure and enum values."""
    print(f"\n📋 Validating {test_name}...")
    
    required_fields = [
        "detected_language",
        "translated_text", 
        "complaint_category",
        "priority",
        "confidence",
        "id",
        "routed_department",
        "timestamp"
    ]
    
    for field in required_fields:
        if field not in response:
            print(f"  ❌ Missing field: {field}")
            return False
    
    # Check enum values
    if response["detected_language"] not in ["English", "Hindi", "Unsupported"]:
        print(f"  ❌ Invalid detected_language: {response['detected_language']}")
        return False
        
    if response["complaint_category"] not in [
        "Billing & Payments",
        "Technical Support",
        "Account & Security",
        "General Inquiry"
    ]:
        print(f"  ❌ Invalid complaint_category: {response['complaint_category']}")
        return False
        
    if response["priority"] not in ["High", "Medium", "Low"]:
        print(f"  ❌ Invalid priority: {response['priority']}")
        return False
        
    if not isinstance(response["confidence"], (int, float)) or not (0.0 <= response["confidence"] <= 1.0):
        print(f"  ❌ Invalid confidence: {response['confidence']}")
        return False
    
    print(f"  ✅ All validations passed!")
    print(f"  Language: {response['detected_language']}")
    print(f"  Category: {response['complaint_category']}")
    print(f"  Priority: {response['priority']}")
    print(f"  Confidence: {response['confidence']:.2%}")
    print(f"  Department: {response['routed_department']}")
    
    return True


def test_gemini_api():
    """Test Gemini API with sample complaints."""
    print("🚀 PHASE 2: Gemini Integration Testing\n")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, complaint, expected_lang in TEST_CASES:
        try:
            print(f"\n🔍 Test: {test_name}")
            print(f"Complaint: {complaint}")
            
            response = requests.post(
                f"{BASE_URL}/api/route-complaint",
                json={"complaint": complaint},
                timeout=10
            )
            
            if response.status_code != 200:
                print(f"  ❌ HTTP {response.status_code}")
                failed += 1
                continue
            
            data = response.json()
            
            if validate_response(data, test_name):
                # Check if it's a mock or Gemini response
                source = data.get("source", "api")
                print(f"  Source: {source}")
                
                # Verify unsupported language routing
                if expected_lang == "Unsupported":
                    if data["routed_department"] == "Manual Review":
                        print(f"  ✅ Correctly routed unsupported language to Manual Review")
                        passed += 1
                    else:
                        print(f"  ❌ Unsupported language should route to Manual Review, got {data['routed_department']}")
                        failed += 1
                else:
                    print(f"  ✅ Test passed")
                    passed += 1
            else:
                failed += 1
                
        except requests.exceptions.RequestException as e:
            print(f"  ❌ Request failed: {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"\n📊 Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("✅ Phase 2 PASSED: All Gemini API tests successful!")
    else:
        print("❌ Phase 2 FAILED: Some tests failed")
    
    return failed == 0


def test_confidence_threshold():
    """Test confidence threshold logic (< 0.65 routes to Manual Review)."""
    print("\n\n" + "=" * 60)
    print("🧪 Testing Confidence Threshold Logic")
    print("=" * 60)
    
    # Use a vague complaint to test confidence
    vague_complaint = "xyz abc 123"
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/route-complaint",
            json={"complaint": vague_complaint},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            confidence = data.get("confidence", 0)
            department = data.get("routed_department", "")
            
            print(f"Complaint: '{vague_complaint}'")
            print(f"Confidence: {confidence:.2%}")
            print(f"Department: {department}")
            
            if confidence < 0.65 and department == "Manual Review":
                print("✅ Confidence threshold correctly routes to Manual Review")
                return True
            elif confidence >= 0.65:
                print(f"ℹ️ High confidence ({confidence:.2%}), routed to {department}")
                return True
            else:
                print(f"❌ Low confidence but not routed to Manual Review: {department}")
                return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return False


if __name__ == "__main__":
    success = test_gemini_api()
    test_confidence_threshold()
    
    exit(0 if success else 1)
