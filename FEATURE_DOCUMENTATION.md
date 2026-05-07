# Feature Documentation - Trackademia

**Commit Hashes:** `8f13fa9`, `b9d24fc8f278df5b2ddeae887fbe3031b5b948f1`  
**Branch:** `feature/study-timer-and-mytasks`  
**Date:** April 10, 2026

---

## 1. Main Feature Implementation

### Feature 1: User Authentication (MUST HAVE)

#### Description
The authentication feature provides secure user registration and login for the web application. It supports email/password registration, login, and session persistence using JWT tokens.

#### Inputs and Validations
- **Email:** Required, valid email format
- **Password:** Required, hashed using BCrypt on backend
- **Confirm Password:** Required on registration, must match password
- **Validation Rules:**
  - Email uniqueness enforced by backend
  - Password hashing on registration
  - Password and confirm password must match
  - JWT token emitted on successful login

#### How the Feature Works
1. User registers on the `/register` page with email, password, and confirm password
2. Frontend validates that password and confirm password match
3. Backend validates email format, password strength, and unique email
4. Successful registration stores hashed password in PostgreSQL
5. User logs in via `/login` with email/password
6. Backend issues JWT token on successful authentication
7. Token is stored in `localStorage` and used for authenticated API calls
8. Logout clears token and user session data from localStorage

#### API Endpoints Used
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Authenticate user and return JWT token

#### Database Tables Involved
- **users** table: id, email, password_hash, created_at

#### Technologies & Components
- **Frontend:** React, React Router, styled-components
- **Backend:** Spring Boot, BCrypt, JWT
- **Files:** `web/src/pages/Register.jsx`, `web/src/pages/Login.jsx`, `backend/src/main/java/.../AuthController.java`

---

### Feature 2: Dashboard and Activity Feed (MUST HAVE / SHOULD HAVE)

#### Description
The Dashboard provides a central overview of user progress and recent activity. It combines task progress, activity feed summaries, and navigation to task and history pages.

#### Inputs and Validations
- Dashboard pulls authenticated user context from JWT and localStorage
- No input form on dashboard, but it displays validated task and activity data fetched from backend
- Ensures list data is loaded only after successful auth

#### How the Feature Works
1. User visits `/dashboard` after login
2. Dashboard fetches progress and activity data from backend
3. Components render task progress, activity summaries, and key metrics
4. Sidebar navigation allows quick access to My Tasks, History, and Study Timer

#### API Endpoints Used
- `GET /api/tasks` – Fetch active tasks for progress display
- `GET /api/activities` – Fetch recent activity feed entries

#### Database Tables Involved
- **tasks** table
- **activities** table

#### Technologies & Components
- **Frontend:** React, Sidebar component, ActivityFeed component
- **Files:** `web/src/pages/Dashboard.jsx`, `web/src/pages/ActivityFeed.jsx`, `web/src/pages/Sidebar.jsx`

---

### Feature 3: History and Activity Log (MUST HAVE / SHOULD HAVE)

#### Description
The History page stores completed task history and activity logs in a consistent timeline. It preserves a read-only record of completed assignments and user actions.

#### Inputs and Validations
- Displays completed task records and activity log entries
- Validates authenticated access before rendering
- Ensures timeline entries are grouped by date and formatted clearly

#### How the Feature Works
1. User navigates to `/history` via Sidebar
2. Page requests completed tasks and activity logs from backend
3. Records are grouped by date labels like Today and Yesterday
4. Activity log panel becomes independently scrollable while header labels remain fixed

#### API Endpoints Used
- `GET /api/tasks/completed` – Fetch completed tasks history
- `GET /api/activities` – Fetch activity log entries

#### Database Tables Involved
- **tasks** table
- **activities** table

#### Technologies & Components
- **Frontend:** React, inline styled containers
- **Files:** `web/src/pages/HistoryPage.jsx`

---

### Feature 4: Study Session Timer (SHOULD HAVE - Study session logging/timers)

#### Description
The Study Timer feature allows users to create focused study sessions with customizable durations. Users can set a timer with hours, minutes, and seconds, add a descriptive label, and control the timer with play/pause/edit/reset operations. The timer displays large, readable digits and plays an audio alarm when time expires.

#### Inputs and Validations
- **Timer Label:** Text input for identifying the study session (e.g., "Study Math")
- **Hours:** Numeric input (0-23+), minimum 0
- **Minutes:** Numeric input (0-59), validates range constraint
- **Seconds:** Numeric input (0-59), validates range constraint
- **Validation Rules:**
  - Total time must be greater than 0
  - Minutes and seconds capped at 59
  - Real-time display with HH:MM:SS format
  - Status messages for user feedback ("Timer started", "Paused", "Resumed", "Time's up!")

#### How the Feature Works
1. User accesses `/study` page (accessed via Sidebar)
2. LoadingScreen displays for 450ms before timer UI loads
3. User enters hours, minutes, seconds, and optional label
4. Clicks **Set** button to start the timer
5. Timer begins counting down in real-time
6. Controls available:
   - **⏸/▶ (Pause/Resume):** Toggles timer state
   - **✏️ (Edit):** Returns to input editing mode
   - **⟲ (Reset):** Clears all inputs and timer
7. When timer reaches 0, audio alarm sounds (880Hz sine wave, 1.5 seconds)
8. Status text updates throughout (e.g., "Timer started" → "Paused" → "Time's up!")

#### API Endpoints Used
- None directly (Timer is client-side only; data not persisted to backend in current implementation)

#### Database Tables Involved
- None (Timer data is session-ephemeral, stored in component state)

#### Technologies & Components
- **Frontend:** React, styled-components, useRef for interval management
- **UI Components:** GlobalStyles, LoadingScreen, Sidebar
- **File:** `web/src/pages/Study.jsx`

---

### Feature 2: My Tasks - Task Management Page (MUST HAVE - Task CRUD, SHOULD HAVE - Priority labeling)

#### Description
The My Tasks page provides comprehensive task management functionality. Users can create, read, update, delete, and complete tasks. Each task includes subject organization, priority labeling (High/Medium/Low), deadline assignment, and a progress tracking system. An activity feed shows real-time logs of task operations.

#### Inputs and Validations
**Create/Edit Task Modal:**
- **Title:** Required text field (e.g., "Midterm Review Notes")
- **Description:** Optional textarea field
- **Deadline:** Required date picker input
- **Subject:** Dropdown selection (CS, DBMS, Math, English, Physics, Other)
- **Priority:** Radio-button selection (High/Medium/Low)

**Validation Rules:**
- Title and deadline are mandatory
- Deadline must be a valid date
- Subject and priority have predefined options
- Form prevents submission if required fields empty
- Success/error messages displayed after operations

#### How the Feature Works
1. User navigates to My Tasks via Sidebar (`/tasks` route)
2. Page loads with LoadingScreen (fade-in animation)
3. **Top section:** Task Completion Progress bar
   - Formula: `(Completed Tasks / Total Tasks) * 100`
   - Displays percentage and task count (e.g., "3 of 8 tasks completed")
4. **Left column - Active Tasks:**
   - Lists all non-completed tasks as TaskCard components
   - Each card shows: subject badge, title, deadline, priority indicator
   - Click "Complete" to mark task finished (triggers completion animation)
   - Click "Edit" to open modal for modifications
5. **Right column - Activity Feed:**
   - Displays scrollable activity log (max-height: 520px)
   - Shows real-time events: task creation, completion, editing, deletion
   - Time format: "Just now", "5m ago", "2h ago", etc.
6. **Modal (Add/Edit Task):**
   - Opens on "New Task" button click or task edit
   - Form validates inputs before submission
   - On submit: API call to create/update task
   - Activity feed refreshes automatically after operation

#### API Endpoints Used
- `GET /api/tasks` – Fetch all active tasks
- `POST /api/tasks` – Create new task
- `PUT /api/tasks/{id}` – Update existing task
- `DELETE /api/tasks/{id}` – Delete task (implicit via API)
- `GET /api/tasks/{id}/complete` – Mark task as completed
- `GET /api/tasks/completed` – Fetch completed tasks for history
- `GET /api/activities` – Fetch activity feed entries

#### Database Tables Involved
- **tasks** table: id, user_id, title, description, deadline, subject, priority, status, created_at, updated_at
- **activities** table: id, user_id, type, text, timestamp
- **users** table: id, email, password_hash, created_at

#### Technologies & Components
- **Frontend:** React, styled-components, useNavigate, useAuth
- **API Service:** `apiService.js` (centralized HTTP client)
- **Components:** TaskCard, ActivityFeed, LoadingScreen, GlobalStyles, Sidebar, Modal
- **Files:** 
  - `web/src/pages/MyTasks.jsx`
  - `web/src/pages/ActivityFeed.jsx`
  - `web/src/pages/TaskCard.jsx`

---

### Feature 3: Scroll Optimization for Activity Feeds

#### Description
Fixed activity feed scrolling behavior on My Tasks and History pages to ensure page layout remains stable while only the activity log scrolls independently.

#### Implementation Details
1. **My Tasks Page (`ActivityContainer`):**
   - `max-height: 520px`
   - `overflow-y: auto`
   - `overscroll-behavior: contain` (prevents parent scroll)

2. **History Page (Activity Log Section):**
   - Activity log panel: `max-height: calc(100vh - 230px)`
   - Date labels use `position: sticky; top: 0` (stay fixed while scrolling)
   - Inner scroll container prevents whole page scroll

#### Files Modified
- `web/src/pages/MyTasks.jsx` (ActivityContainer styling)
- `web/src/pages/HistoryPage.jsx` (Activity timeline container)

---

## 2. Web Integration

### Frontend-Backend Connection
- **Auth Flow:** Login/Register → JWT token stored in localStorage → Token sent in API headers
- **Task Sync:** Create task → POST to `/api/tasks` → Database saves → GET refresh activity feed
- **Data Flow:** React state updates → API call → Response updates state → UI re-renders with fetched data

### Error Handling
- Try-catch blocks on all API calls
- User feedback via status messages and error console logs
- Failed operations prevent state update; user can retry

### Data Persistence
- Tasks persisted in PostgreSQL database
- Activity logs automatically created on task operations
- User session tracked via JWT authentication

---

## 3. Feature Alignment with SDD

| SDD Requirement | Implementation Status | Feature |
|---|---|---|
| MUST HAVE: User authentication | ✅ Implemented | Login/Register/Logout (Backend: JWT, BCrypt) |
| MUST HAVE: Task CRUD | ✅ Implemented | My Tasks page with create, read, update, delete |
| MUST HAVE: Academic Term/Subject | ✅ Implemented | Subject dropdown (CS, DBMS, Math, English, Physics) |
| MUST HAVE: Progress calculation | ✅ Implemented | Progress bar: `(Completed/Total)*100` |
| MUST HAVE: Centralized REST API | ✅ Implemented | All endpoints in backend; apiService.js facade |
| SHOULD HAVE: Study session logging/timers | ✅ Implemented | Study Timer page with timer controls |
| SHOULD HAVE: Priority labeling | ✅ Implemented | High/Medium/Low priority on tasks |
| SHOULD HAVE: Deadline countdowns | ✅ Partially Implemented | Deadline dates assigned; countdowns on History |
| SHOULD HAVE: Responsive React dashboard | ✅ Implemented | Sidebar + main content layout; flexbox responsive |

---

## 4. Short Summary

**Main Features Delivered:**
1. **Authentication:** Secure register/login/logout flow with JWT session management
2. **Dashboard:** Progress overview and activity feed summary for authenticated users
3. **My Tasks:** Full CRUD task management with progress tracking, priority labeling, subject organization, and activity feed
4. **History:** Completed task history and activity log timeline with fixed header and independent scrolling
5. **Study Timer:** Functional on-screen timer with set/pause/resume/reset/edit controls and audio alarm

**Validations:**
- Email format and password matching for registration
- Required fields for task title and deadline
- Range constraints for timer minutes and seconds (0-59)
- Task completion validation
- Authenticated access via JWT

**API Endpoints:**
- `/api/auth/register` (POST)
- `/api/auth/login` (POST)
- `/api/tasks` (GET, POST, PUT, DELETE)
- `/api/tasks/{id}/complete` (GET)
- `/api/tasks/completed` (GET)
- `/api/activities` (GET)

**Database Tables:**
- users, tasks, activities

**Commits:** `8f13fa9`, `b9d24fc8f278df5b2ddeae887fbe3031b5b948f1` (feature/study-timer-and-mytasks)

---

## 5. Testing Notes

### Functional Testing Completed
- ✅ Timer set/pause/resume/reset/edit functionality
- ✅ Task create/edit/delete operations
- ✅ Progress percentage calculation
- ✅ Activity feed real-time updates
- ✅ Responsive layout on different screen sizes
- ✅ Independent scroll containers on activity feeds
- ✅ Loading screens display and fade-in animations
- ✅ Form validation prevents invalid submissions (including password confirmation)
- ✅ Error messages appear on failed operations

### Known Limitations
- Timer data not persisted to database (session-only)
- No offline support; requires active backend connection
- No search/filter (marked as COULD HAVE in SDD)

