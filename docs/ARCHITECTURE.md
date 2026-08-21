# SprintDesk — Architecture Documentation

## 1. Overview

SprintDesk is a single-page sprint management dashboard built with React and TypeScript.

The application is designed with separation between presentation, server state, client/application state, API communication, and data sources.

The primary architectural goal is to keep UI components independent from the underlying mock data source so that `mock-data.json` can later be replaced by a real backend with minimal changes to the presentation layer.

---

## 2. Technology Stack

| Area         | Technology                        |
| ------------ | --------------------------------- |
| Framework    | React                             |
| Language     | TypeScript                        |
| Build Tool   | Vite                              |
| Routing      | React Router                      |
| Server State | TanStack Query v5                 |
| Client State | Zustand                           |
| Styling      | Tailwind CSS                      |
| Drag & Drop  | @dnd-kit/core / @dnd-kit/sortable |
| Charts       | Recharts                          |
| Testing      | Vitest + React Testing Library    |

---

## 3. High-Level Architecture

SprintDesk follows the following data flow:

```text
┌───────────────────────────────┐
│        UI Components          │
│ Pages / Board / Charts / UI   │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│       Hooks / Query Layer     │
│ TanStack Query / Custom Hooks │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│      API / Service Layer      │
│ Auth API / Mock Data Service  │
│ Notification API / API Client │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────┐
│         Data Sources          │
│                               │
│ mock-data.json                │
│ DummyJSON                     │
│ JSONPlaceholder               │
└───────────────────────────────┘
```

UI components do not directly fetch `mock-data.json`.

All external data access is centralized through API and service modules.

---

## 4. Project Structure

```text
src/
├── api/
│   ├── apiClient.ts
│   ├── authApi.ts
│   ├── notificationApi.ts
│   └── userApi.ts
│
├── components/
│   ├── auth/
│   ├── board/
│   ├── charts/
│   ├── layout/
│   ├── notifications/
│   ├── theme/
│   └── ui/
│
├── hooks/
├── pages/
├── routes/
├── services/
├── stores/
├── test/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

### `api/`

Contains external API communication and shared request logic.

Responsibilities include:

- Authentication requests
- Access-token attachment
- Token refresh
- Failed-request retry
- Notification polling requests

### `services/`

Provides the abstraction layer around `mock-data.json`.

The UI does not depend directly on the structure or location of the JSON file.

### `hooks/`

Contains reusable application logic and TanStack Query integration.

Examples include:

- Board data loading
- Sprint loading
- Notification polling
- Toast behavior

### `stores/`

Contains Zustand stores for application/client state.

### `components/`

Contains reusable feature components and the custom UI component system.

### `pages/`

Contains route-level page components.

### `utils/`

Contains pure transformation/calculation logic such as analytics calculations.

---

## 5. State Management Strategy

SprintDesk separates state into three categories.

### 5.1 Server State

TanStack Query manages data originating from API-like data sources.

This includes:

- Tasks loaded from mock data
- Users
- Sprints
- Comments
- Initial notifications
- JSONPlaceholder notification polling
- Loading states
- Error states
- Caching
- Refetching

This keeps asynchronous server-style state separate from application UI state.

### 5.2 Client/Application State

Zustand is used for state that needs to be shared between multiple components or persisted locally.

This includes:

- Authentication state
- Kanban board state
- Notifications
- Comments
- Theme
- Toast messages

Zustand persistence middleware is used where state must survive browser refreshes.

### 5.3 Local Component State

Temporary UI state remains inside components using React state.

Examples include:

- Modal visibility
- Drawer form fields
- Mobile navigation state
- Current pagination page
- Form input values

This prevents unnecessary global state.

---

## 6. Authentication Architecture

Authentication is handled using DummyJSON.

The authentication lifecycle is:

```text
User Login
    │
    ▼
POST /auth/login
    │
    ├── Access Token ──────► Zustand Memory
    │
    └── Refresh Token ─────► localStorage
                              │
                              ▼
                     Session Persistence
```

The access token is intentionally kept in application memory.

The refresh token is persisted in localStorage as required by the assignment's simulated authentication flow.

### Authenticated Requests

The shared API client automatically attaches:

```text
Authorization: Bearer <access-token>
```

to authenticated requests.

### Token Expiration

When an authenticated request returns `401`:

```text
API Request
    │
    ▼
401 Unauthorized
    │
    ▼
Read Refresh Token
    │
    ▼
POST /auth/refresh
    │
    ▼
Receive New Access Token
    │
    ▼
Update Authentication State
    │
    ▼
Retry Original Request
```

A shared refresh promise prevents multiple simultaneous failed requests from starting duplicate refresh operations.

If token refresh fails, authentication state is cleared and the user must authenticate again.

### Session Restoration

After a browser refresh:

1. SprintDesk checks for the persisted refresh token.
2. A new access token is requested.
3. The current authenticated user is retrieved.
4. Authentication state is restored.
5. Protected routes are rendered.

A full-screen loading state is displayed while this process is running.

---

## 7. Routing Architecture

SprintDesk contains the following main routes:

| Route        | Access    |
| ------------ | --------- |
| `/login`     | Public    |
| `/dashboard` | Protected |
| `/board`     | Protected |
| `/analytics` | Protected |

Protected routes require a valid authenticated session.

Unauthenticated users attempting to access protected pages are redirected to `/login`.

Authenticated users are prevented from accessing `/login`.

Route-level code splitting is implemented using:

- `React.lazy`
- `Suspense`

This prevents all page bundles from being loaded during the initial application request.

---

## 8. Kanban Board Architecture

The Kanban board uses Zustand for interactive board state and dnd-kit for drag-and-drop behavior.

The board contains:

```text
Backlog
In Progress
Review
Done
```

Tasks are initially loaded through the mock data service and then managed by the board store.

The board supports:

- Moving tasks between columns
- Reordering within columns
- Creating tasks
- Updating tasks
- Deleting tasks
- Task comments
- Persistent board state
- Dynamic task counts

Board persistence is implemented using Zustand persistence middleware and localStorage.

### Completion State

When a task enters the `done` column, SprintDesk assigns a completion timestamp.

When the task leaves `done`, the completion timestamp is removed.

This keeps analytics synchronized with the actual board state.

---

## 9. Analytics Architecture

Analytics values are derived from task and sprint data rather than hardcoded.

The analytics utility layer transforms application data into chart-ready structures.

```text
Board State / Sprint Data
          │
          ▼
Analytics Utilities
          │
          ▼
Derived Chart Data
          │
          ▼
Recharts Components
```

The Analytics page contains:

### Sprint Velocity

Number of completed tasks per sprint.

### Task Status

Distribution across:

- Backlog
- In Progress
- Review
- Done

### Priority Breakdown

Distribution across:

- High
- Medium
- Low

### Completion Trend

Cumulative task completions over time.

Because chart data is derived from board state, analytics automatically reflect board changes.

---

## 10. Notification Architecture

SprintDesk uses JSONPlaceholder to simulate real-time notifications.

The application polls:

```text
GET /posts?_limit=5
```

New post IDs are interpreted as new notifications.

The notification flow is:

```text
TanStack Query Polling
        │
        ▼
JSONPlaceholder
        │
        ▼
Compare Post IDs
        │
        ▼
New Notifications
        │
        ▼
Zustand Notification Store
        │
        ├── Unread Count
        ├── Notification Panel
        ├── Read / Unread
        └── Persistence
```

Polling pauses while the browser tab is hidden and resumes when the tab becomes visible.

When new notifications arrive while the notification panel is closed, the application displays a toast.

---

## 11. Component System

SprintDesk includes a custom Tailwind-based component system.

Reusable components include:

- Button
- Input
- Select
- Modal
- Toast
- DataTable
- Skeleton

The component system was built without external UI libraries.

Components are designed to support:

- Reusability
- Responsive layouts
- Keyboard interaction
- Focus states
- Disabled states
- Consistent styling
- Light/dark themes

---

## 12. Theme Architecture

Theme preference is stored using Zustand.

Supported themes:

```text
Light
Dark
```

The selected theme is persisted across browser refreshes.

The theme initializer synchronizes Zustand state with the root document class used by Tailwind's dark-mode utilities.

---

## 13. Responsive Design

SprintDesk is designed for desktop, tablet, and mobile usage.

Responsive behavior includes:

- Collapsible mobile navigation
- Horizontally scrollable Kanban columns
- Full-width task drawer on smaller screens
- Responsive notification panel
- Responsive DataTable container
- Single-column analytics layout on smaller screens
- Responsive Recharts containers

The application is designed to remain usable at a 375px viewport.

---

## 14. Accessibility

Accessibility considerations include:

- Semantic HTML
- Form labels
- Meaningful image alternative text
- Keyboard-accessible controls
- Visible focus states
- ARIA labels
- Dialog semantics
- Escape-key handling
- Modal/drawer focus handling
- Keyboard drag-and-drop support

---

## 15. Performance

Performance techniques used in SprintDesk include:

- Route-level lazy loading
- React Suspense
- React.memo where appropriate
- useMemo for derived data
- useCallback where stable callbacks are useful
- TanStack Query caching
- Separation of server and client state
- Avoidance of unnecessary global state

---

## 16. Testing Strategy

Vitest and React Testing Library are used for unit testing.

Required test coverage includes:

### useToast

Verifies that toast notifications can be created with the expected message and type.

### Board Store

Tests:

- Adding tasks
- Moving tasks
- Deleting tasks

### Authentication API Client

Tests the following sequence:

```text
Authenticated Request
        ↓
       401
        ↓
Token Refresh
        ↓
New Access Token
        ↓
Original Request Retried
        ↓
Successful Response
```

Tests can be executed with:

```bash
npm run test
```

---

## 17. Data Source Abstraction

`mock-data.json` is treated as a temporary backend.

Components do not directly depend on the JSON file.

Instead:

```text
Component
   ↓
Hook
   ↓
Service
   ↓
mock-data.json
```

This architecture allows the mock service to later be replaced by HTTP API endpoints without requiring significant UI changes.

---

## 18. Security Considerations

No private API keys, passwords, or application secrets are required by SprintDesk.

DummyJSON credentials used during development are public demonstration credentials.

Access tokens are kept in memory rather than persisted.

Refresh-token persistence is implemented only to satisfy the assignment's simulated authentication requirements.

---

## 19. Deployment

SprintDesk is designed to be deployed as a Vite single-page application.

A Vercel rewrite configuration ensures routes such as:

```text
/dashboard
/board
/analytics
```

resolve to the SPA entry point when opened or refreshed directly.

---

## 20. Future Improvements

The implementation intentionally focuses on assignment requirements.

Potential future improvements include:

- Real backend persistence
- Server-driven notifications
- Undo drag-and-drop
- Advanced task filters
- Analytics date filtering
- Analytics PNG export
- Storybook
- Automated axe-core accessibility tests

These are considered future or bonus improvements rather than part of the required application scope.
