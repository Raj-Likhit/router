# OmniRoute AI - 90-Minute Execution Timeline

**Start Time:** [TO BE SET]  
**Target Completion:** 90 minutes  
**Team:** 4 developers (P1, P2, P3, P4)  
**Supported Languages:** English, Hindi only

---

## Phase 1: Bootstrap (00:00 - 00:08)

### Owner: P1 + P2

**Goal:** Environment setup, both apps running, health check passing

#### Tasks

- [ ] P1: Install backend dependencies
  ```bash
  cd backend
  pip install -r requirements.txt
  ```
  **Done when:** All 4 packages installed successfully

- [ ] P1: Create and configure `.env`
  ```bash
  cp .env.example .env
  # Add GEMINI_API_KEY
  ```
  **Done when:** `.env` file exists with valid API key

- [ ] P1: Test Flask health check
  ```bash
  python app.py
  curl http://localhost:5000/health
  ```
  **Done when:** `{"status":"ok"}` returned, no errors in console

- [ ] P2: Install frontend dependencies
  ```bash
  cd frontend
  npm install
  ```
  **Done when:** `node_modules/` created, no errors

- [ ] P2: Start Vite dev server
  ```bash
  npm run dev
  ```
  **Done when:** Server running on `http://localhost:5173`, no console errors

**Checkpoint:** Both servers running, no errors, health check passes

---

## Phase 2: Gemini Integration (00:08 - 00:15)

### Owner: P1

**Goal:** Gemini API working, structured output validated

#### Tasks

- [ ] P1: Test Gemini API with 3 sample prompts
  - Test 1: English complaint (security)
  - Test 2: Hindi complaint (billing)
  - Test 3: Unsupported language (test fallback)
  
  **Done when:** All 3 requests return valid JSON with correct schema

- [ ] P1: Verify prompt output format
  - Check: `detected_language` is one of (English | Hindi | Unsupported)
  - Check: `complaint_category` is valid (4 options)
  - Check: `priority` is valid (High/Medium/Low)
  - Check: `confidence` is float 0.0-1.0
  
  **Done when:** All fields present, all values valid for all 3 tests

- [ ] P1: Test confidence threshold logic
  - Create a low-confidence test case
  - Verify response routes to Manual Review
  
  **Done when:** Low confidence (< 0.65) routes to Manual Review correctly

**Checkpoint:** Gemini API is working, structured output validated, confidence logic tested

---

## Phase 3: Mock Data & Fallback (00:15 - 00:22)

### Owner: P1

**Goal:** Mock responses integrated, fallback logic tested

#### Tasks

- [ ] P1: Verify 4 mock responses are loaded
  - [ ] मेरा पैसा दो बार कट गया है। (Hindi: Billing)
  - [ ] I cannot log into my account... (English: Security)
  - [ ] What are your customer service hours? (English: General)
  - [ ] डेटाबेस कनेक्शन त्रुटि है। (Hindi: Technical)
  
  **Done when:** All 4 mock responses return instantly (< 10ms)

- [ ] P1: Test fallback logic
  - Submit exact mock complaint → should return mock instantly
  - Submit new complaint → should call Gemini
  
  **Done when:** Mock responses return before Gemini, fallback works

- [ ] P1: Test rate limit handling
  - Simulate Gemini API failure (comment out API key temporarily)
  - Submit complaint → should fallback to Manual Review gracefully
  
  **Done when:** No crashes, graceful error handling, Manual Review returned

**Checkpoint:** Mock responses working, fallback tested, API failures handled gracefully

---

## Phase 4: Validation & Routing (00:22 - 00:30)

### Owner: P1

**Goal:** Input validation, enum checks, routing map tested

#### Tasks

- [ ] P1: Test input validation
  - Empty complaint → HTTP 400
  - Whitespace-only complaint → HTTP 400
  - Valid complaint → processes normally
  
  **Done when:** All 3 cases handled correctly

- [ ] P1: Test enum validation
  - Invalid language in Gemini response → routes to Manual Review
  - Invalid category in Gemini response → routes to Manual Review
  - Invalid priority in Gemini response → routes to Manual Review
  
  **Done when:** All invalid enum values caught and handled

- [ ] P1: Test routing map
  - "Billing & Payments" → "Finance Team"
  - "Technical Support" → "Tech Support Queue"
  - "Account & Security" → "Security & Access"
  - "General Inquiry" → "General Support"
  
  **Done when:** All 4 mappings correct

- [ ] P1: Test unsupported language detection
  - Submit Hindi complaint → detected_language: "Hindi"
  - Submit English complaint → detected_language: "English"
  - Submit Chinese complaint → detected_language: "Unsupported" → routes to Manual Review
  
  **Done when:** Language detection and routing correct

**Checkpoint:** All validation tests pass, routing map correct, unsupported language handling works

---

## Phase 5: Frontend Core (00:30 - 00:45)

### Owner: P2

**Goal:** Complaint form working, result card displays, loading states

#### Tasks

- [ ] P2: Test complaint form
  - Textarea accepts input
  - Submit button triggers handler
  - Button disabled while loading
  
  **Done when:** Form fully functional with loading state

- [ ] P2: Use mock data for development
  - Replace fetch with mock response data initially
  - Show result card with mock data
  - Update queue counters with mock data
  
  **Done when:** Frontend displays results correctly without backend

- [ ] P2: Build result card component
  - Display all fields: id, language, translation, category, priority, department, confidence
  - Show error states
  - Color-code priorities (High=red, Medium=yellow, Low=green)
  
  **Done when:** Result card shows all fields, colors correct

- [ ] P2: Implement loading & error states
  - Show spinner while loading
  - Show error message if API fails
  - Always show fallback department on error
  
  **Done when:** Loading spinner appears, error message clear

**Checkpoint:** Frontend form works, mocks render correctly, result card displays all data

---

## Phase 6: Dashboard (00:45 - 00:58)

### Owner: P3

**Goal:** Queue board displays, sample buttons work, styling complete

#### Tasks

- [ ] P3: Build queue board component
  - 5 department cards (Finance, Technical, Security, General, Manual Review)
  - Display counter for each
  - Show queue icon/color
  
  **Done when:** All 5 queues visible with icons and counters

- [ ] P3: Implement sample complaint buttons
  - 4 buttons: Hindi Billing, English Security, English General, Hindi Technical
  - Each button auto-fills textarea and submits
  - Buttons disabled while loading
  
  **Done when:** All 4 sample buttons work and submit correctly

- [ ] P3: Apply Tailwind/CSS styling
  - Gradient background (purple theme)
  - Responsive layout (mobile/tablet/desktop)
  - Color-coded priority badges
  - Smooth transitions and animations
  
  **Done when:** UI looks polished, responsive, no layout issues

- [ ] P3: Add visual polish
  - Smooth animations for queue counter updates
  - Loading spinner animation
  - Hover effects on buttons
  - Clear empty states
  
  **Done when:** UI feels smooth and professional

**Checkpoint:** Dashboard complete, sample buttons work, styling polished

---

## Phase 7: Integration (00:58 - 01:10)

### Owner: P4

**Goal:** Frontend ↔ Backend wired, end-to-end flow tested, CORS verified

#### Tasks

- [ ] P4: Connect frontend to real backend
  - Remove mock data from frontend
  - Wire complaint form to real POST /api/route-complaint endpoint
  - Test API call, verify JSON response
  
  **Done when:** Frontend receives real backend response

- [ ] P4: Verify CORS is working
  - Frontend on http://localhost:5173
  - Backend on http://localhost:5000
  - No CORS errors in browser console
  
  **Done when:** No CORS errors, requests succeed

- [ ] P4: Test all 4 golden cases end-to-end
  ```
  Test 1: मेरा पैसा दो बार कट गया है।
  Expected: Finance Team +1, Priority: High
  
  Test 2: I cannot log into my account...
  Expected: Security & Access +1, Priority: High
  
  Test 3: What are your customer service hours?
  Expected: General Support +1, Priority: Low
  
  Test 4: डेटाबेस कनेक्शन त्रुटि है।
  Expected: Tech Support Queue +1, Priority: High
  ```
  **Done when:** All 4 cases route correctly with correct queue increments

- [ ] P4: Test fallback resilience
  - Simulate Gemini API failure
  - Submit complaint → routes to Manual Review
  - Manual Review queue increments
  
  **Done when:** Fallback works, no crashes, Manual Review queue updates

- [ ] P4: Verify queue counter persistence
  - Submit 3 complaints
  - Total count should be 3
  - Each department shows correct count
  
  **Done when:** Queue counters accurate across multiple submissions

**Checkpoint:** Frontend-backend fully integrated, all 4 golden cases pass, fallback works

---

## Phase 8: Polish (01:10 - 01:18)

### Owner: P3

**Goal:** UI refinement, animations, typography, responsive design

#### Tasks

- [ ] P3: Typography refinement
  - Headings clear and sized correctly
  - Body text readable
  - Code/JSON display formatted nicely
  
  **Done when:** All text is readable and well-formatted

- [ ] P3: Spacing and alignment
  - 16px/24px grid consistency
  - Padding around components
  - Margin between sections
  
  **Done when:** Layout feels spacious, no cramped areas

- [ ] P3: Animation polish
  - Smooth queue counter transitions
  - Loading spinner rotation
  - Result card fade-in
  
  **Done when:** All animations smooth and professional

- [ ] P3: Empty & error states
  - Empty queue message
  - Error message styling
  - Fallback department highlight
  
  **Done when:** Empty and error states clear and helpful

- [ ] P3: Mobile responsiveness
  - Test on phone viewport (320px width)
  - Test on tablet viewport (768px width)
  - Test on desktop (1200px+ width)
  
  **Done when:** Layout works on all screen sizes

**Checkpoint:** UI polished, animations smooth, responsive on all devices

---

## Phase 9: Final QA (01:18 - 01:25)

### Owner: P4

**Goal:** All paths tested, bugs fixed, demo script validated

#### Tasks

- [ ] P4: Run all 4 golden test cases
  ```
  Test 1: Hindi Billing
  Test 2: English Security
  Test 3: English General
  Test 4: Hindi Technical
  ```
  **Done when:** All 4 cases pass, correct routing, correct priorities

- [ ] P4: Test error paths
  - Empty complaint → error message
  - Backend down → graceful fallback
  - Unsupported language → Manual Review
  - Low confidence → Manual Review
  
  **Done when:** All error paths work correctly

- [ ] P4: Verify no console errors
  - Open Chrome DevTools
  - Check Console tab for any errors/warnings
  - Fix any issues found
  
  **Done when:** Console is clean, no red errors

- [ ] P4: Test data accuracy
  - Verify translations are accurate
  - Verify categories are correct
  - Verify departments are mapped correctly
  - Verify priorities are appropriate
  
  **Done when:** All data is accurate and makes sense

- [ ] P4: Time the demo script
  - Practice the 2.5-minute demo
  - Time each step
  - Verify it fits in time budget
  
  **Done when:** Demo complete in under 3 minutes

**Checkpoint:** All QA tests pass, no console errors, demo script timed

---

## Phase 10: Rehearsal (01:25 - 01:30)

### Owner: P4

**Goal:** Final run-through without code changes, timing verified

#### Tasks

- [ ] P4: Run exact demo sequence
  1. Open dashboard (show empty queues)
  2. Submit Hindi Billing (30 sec, show translation)
  3. Submit English Security (30 sec, emphasize priority)
  4. Submit English General (30 sec)
  5. Submit Hindi Technical (30 sec)
  6. Explain architecture (20 sec)
  
  **Done when:** Demo runs smoothly, no errors, under 3 minutes

- [ ] P4: Verify all sample buttons work
  - Each button submits correctly
  - Queue counters increment
  - Result cards display
  
  **Done when:** All buttons functional

- [ ] P4: Final visual check
  - UI looks polished
  - No broken layouts
  - No typos
  - Colors correct
  
  **Done when:** UI is presentation-ready

- [ ] P4: Document any issues found
  - If issues found, report to team
  - Prioritize fixes
  - Quick patches only (no major changes)
  
  **Done when:** Final issue list documented

**Checkpoint:** Full demo rehearsed, timed, and ready for judges

---

## Success Criteria Checklist

### Functional Requirements
- [ ] Language detection works (English, Hindi, Unsupported)
- [ ] Translation to English works
- [ ] Classification into 4 categories works
- [ ] Priority assignment works (High/Medium/Low)
- [ ] Confidence scoring works (0.0-1.0)
- [ ] Deterministic routing works (category → department)
- [ ] Mock fallback works
- [ ] Manual Review fallback works

### User Interface
- [ ] Complaint textarea works
- [ ] Submit button works with loading state
- [ ] Result card displays all fields
- [ ] Queue board shows all 5 departments
- [ ] Queue counters update correctly
- [ ] Sample buttons work
- [ ] Styling is polished
- [ ] Responsive design works

### Resilience
- [ ] Gemini API calls succeed
- [ ] Mock responses return instantly
- [ ] API failures route to Manual Review gracefully
- [ ] No console errors
- [ ] No crashes on invalid input

### Performance
- [ ] Mock responses return in < 10ms
- [ ] Gemini API calls complete in < 2s
- [ ] UI updates smoothly
- [ ] No lag on button clicks

### Demo
- [ ] All 4 golden test cases pass
- [ ] Demo script runs in < 3 minutes
- [ ] No errors during demo
- [ ] Architecture explanation is clear

---

## Communication & Sync Points

### Sync Points (Every 15 mins)

- **00:15** - Phase 2 checkpoint (Gemini working?)
- **00:30** - Phase 4 checkpoint (Validation complete?)
- **00:45** - Phase 5/6 checkpoint (Frontend rendering?)
- **01:00** - Phase 7 checkpoint (Integration done?)
- **01:15** - Phase 8 checkpoint (Polish complete?)

### If Behind Schedule

**At 00:45 mark:** If Phases 2-4 not complete, P2 can start with mock data instead of waiting

**At 01:00 mark:** If integration not complete, P4 can do final QA in parallel with P3's polish

**At 01:15 mark:** If any major issues found, focus on fixing golden test cases first (demo success is critical)

### Team Communication

- **Slack/Chat**: Use for quick questions, blockers
- **Blockers**: Report immediately to avoid downstream issues
- **Success**: Share when phases complete
- **Issues**: Escalate if estimated to take > 5 mins to fix

---

## Critical Path Items (Do NOT Skip)

1. ✅ Gemini API integration & validation
2. ✅ Frontend form submission working
3. ✅ Queue counter increments correctly
4. ✅ All 4 golden test cases pass
5. ✅ Manual Review fallback works
6. ✅ CORS error-free
7. ✅ Demo script timed under 3 mins

---

## Optional Features (Only if Time Permits After 01:15)

- [ ] Additional sample complaints
- [ ] Queue filters/search
- [ ] Confidence indicator tooltip
- [ ] Processing time display
- [ ] Advanced animations
- [ ] Dark mode toggle

---

## Emergency Protocols

**If Gemini API down (15 mins before demo):**
- Use mock responses only
- Clearly explain to judges: "API in fallback mode, using pre-cached responses"
- Demo still works perfectly, architecture still sound

**If Frontend won't compile:**
- Revert to last known good commit
- Simple fix only, no major refactoring

**If Backend port conflict:**
- Change to port 5001 or 5002
- Update frontend .env.local accordingly
- Restart both services

**If time is running out:**
- Skip polish phase
- Focus on getting all 4 golden cases working perfectly
- Demo shows substance over style

---

## Post-Demo Checklist

After successful demo:

- [ ] Take screenshots of each queue
- [ ] Get demo video if possible
- [ ] Collect team feedback
- [ ] Document what worked well
- [ ] Document what could be improved
- [ ] Save final working code state

---

**Target: 90 minutes, all phases complete, perfect demo** 🚀
