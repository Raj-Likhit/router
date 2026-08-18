#!/usr/bin/env python3
"""
COMPREHENSIVE END-TO-END TEST
Tests all 4 golden cases and verifies complete system functionality
"""

import requests
import json
import time
from typing import Dict, List

BASE_URL = "http://localhost:5000"

class TestRunner:
    def __init__(self):
        self.results = []
        self.queue_state = {
            'Finance Team': 0,
            'Tech Support Queue': 0,
            'Security & Access': 0,
            'General Support': 0,
            'Manual Review': 0,
        }
    
    def test_case(self, name: str, complaint: str, expected_dept: str, expected_priority: str) -> bool:
        """Test a single complaint and verify routing."""
        print(f"\n{'='*60}")
        print(f"TEST: {name}")
        print(f"{'='*60}")
        print(f"Complaint: {complaint}")
        
        try:
            response = requests.post(
                f"{BASE_URL}/api/route-complaint",
                json={"complaint": complaint},
                timeout=10
            )
            
            if response.status_code != 200:
                print(f"❌ HTTP {response.status_code}")
                return False
            
            data = response.json()
            
            # Check for errors
            if 'error' in data:
                print(f"❌ Error: {data['error']}")
                return False
            
            # Validate required fields
            required = ['id', 'detected_language', 'translated_text', 'complaint_category', 
                       'priority', 'confidence', 'routed_department', 'timestamp']
            for field in required:
                if field not in data:
                    print(f"❌ Missing field: {field}")
                    return False
            
            # Verify routing
            dept = data['routed_department']
            priority = data['priority']
            
            print(f"✓ Routed to: {dept}")
            print(f"✓ Priority: {priority}")
            print(f"✓ Language: {data['detected_language']}")
            print(f"✓ Category: {data['complaint_category']}")
            print(f"✓ Confidence: {data['confidence']:.0%}")
            print(f"✓ Translation: {data['translated_text'][:50]}...")
            
            # Verify expectations
            if dept != expected_dept:
                print(f"❌ Expected department {expected_dept}, got {dept}")
                return False
            
            if priority != expected_priority:
                print(f"❌ Expected priority {expected_priority}, got {priority}")
                return False
            
            # Update queue state
            if dept in self.queue_state:
                self.queue_state[dept] += 1
            
            print(f"\n✅ TEST PASSED")
            return True
            
        except Exception as e:
            print(f"❌ Exception: {e}")
            return False
    
    def run_all_tests(self) -> bool:
        """Run all golden test cases."""
        print("\n" + "="*60)
        print("🚀 OMNIROUTE AI - COMPREHENSIVE END-TO-END TEST")
        print("="*60)
        
        tests = [
            (
                "Golden Case 1: Hindi - Billing Issue",
                "मेरा पैसा दो बार कट गया है।",
                "Finance Team",
                "High"
            ),
            (
                "Golden Case 2: English - Security Issue",
                "I cannot log into my account and password reset is not working.",
                "Security & Access",
                "High"
            ),
            (
                "Golden Case 3: English - General Inquiry",
                "What are your customer service hours?",
                "General Support",
                "Low"
            ),
            (
                "Golden Case 4: Hindi - Technical Issue",
                "डेटाबेस कनेक्शन त्रुटि है।",
                "Tech Support Queue",
                "High"
            ),
        ]
        
        passed = 0
        failed = 0
        
        for name, complaint, expected_dept, expected_priority in tests:
            if self.test_case(name, complaint, expected_dept, expected_priority):
                passed += 1
            else:
                failed += 1
        
        # Print final report
        print("\n" + "="*60)
        print("📊 FINAL RESULTS")
        print("="*60)
        print(f"\nTests Passed: {passed}/4")
        print(f"Tests Failed: {failed}/4")
        
        print(f"\nQueue State After Testing:")
        for dept, count in self.queue_state.items():
            print(f"  {dept}: {count}")
        
        total_complaints = sum(self.queue_state.values())
        print(f"\nTotal Complaints Processed: {total_complaints}")
        
        if failed == 0:
            print("\n" + "="*60)
            print("✅ ALL TESTS PASSED - SYSTEM READY FOR DEMO")
            print("="*60)
            return True
        else:
            print("\n" + "="*60)
            print("❌ SOME TESTS FAILED - SYSTEM NEEDS FIXES")
            print("="*60)
            return False

def test_validation():
    """Test input validation."""
    print("\n\n" + "="*60)
    print("🔍 VALIDATION TESTS")
    print("="*60)
    
    print("\nTest: Empty complaint")
    r = requests.post(f"{BASE_URL}/api/route-complaint", 
                     json={"complaint": ""}, timeout=5)
    if r.status_code == 400:
        print("✓ Correctly rejected empty complaint")
    else:
        print(f"❌ Expected 400, got {r.status_code}")
    
    print("\nTest: Whitespace only")
    r = requests.post(f"{BASE_URL}/api/route-complaint",
                     json={"complaint": "   "}, timeout=5)
    if r.status_code == 400:
        print("✓ Correctly rejected whitespace-only complaint")
    else:
        print(f"❌ Expected 400, got {r.status_code}")
    
    print("\nTest: Missing complaint field")
    r = requests.post(f"{BASE_URL}/api/route-complaint",
                     json={}, timeout=5)
    if r.status_code == 400:
        print("✓ Correctly rejected missing complaint field")
    else:
        print(f"❌ Expected 400, got {r.status_code}")

def test_performance():
    """Test system performance."""
    print("\n\n" + "="*60)
    print("⚡ PERFORMANCE TESTS")
    print("="*60)
    
    # Test mock response speed (should be fast)
    print("\nTesting mock response speed...")
    start = time.time()
    r = requests.post(f"{BASE_URL}/api/route-complaint",
                     json={"complaint": "What are your customer service hours?"},
                     timeout=5)
    elapsed = time.time() - start
    print(f"Mock response time: {elapsed*1000:.1f}ms")
    if elapsed < 0.1:
        print("✓ Mock response is fast")
    
    # Test with 5 concurrent submissions
    print("\nTesting multiple submissions...")
    start = time.time()
    for _ in range(5):
        requests.post(f"{BASE_URL}/api/route-complaint",
                     json={"complaint": "What are your customer service hours?"},
                     timeout=5)
    elapsed = time.time() - start
    avg_time = elapsed / 5 * 1000
    print(f"Average time per request: {avg_time:.1f}ms")

if __name__ == "__main__":
    runner = TestRunner()
    success = runner.run_all_tests()
    
    test_validation()
    test_performance()
    
    exit(0 if success else 1)
