# SprintDesk

SprintDesk is a production-oriented sprint management dashboard built for software development teams. It provides authentication, sprint task management through an interactive Kanban board, analytics, notifications, theme switching, and reusable UI components.

## Features

- Secure authentication using DummyJSON
- Access token stored in memory
- Refresh token persistence
- Automatic Bearer token attachment
- Silent token refresh and failed-request retry
- Protected application routes
- Persistent authenticated sessions
- Interactive Kanban board
- Drag and drop between columns
- Task reordering
- Create, edit and delete tasks
- Task details side drawer
- Task comments
- Persistent board state
- Sprint analytics and visualizations
- Simulated real-time notifications using polling
- Read/unread notification management
- Notification persistence
- Light and dark themes
- Responsive navigation
- Reusable UI component system
- Route-level code splitting
- Unit testing with Vitest and React Testing Library

## Technology Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query v5
- Zustand
- Tailwind CSS
- Recharts
- @dnd-kit/core
- @dnd-kit/sortable
- Vitest
- React Testing Library

## Application Routes

| Route        | Description                      | Access    |
| ------------ | -------------------------------- | --------- |
| `/login`     | User authentication              | Public    |
| `/dashboard` | Sprint overview and recent tasks | Protected |
| `/board`     | Interactive Kanban sprint board  | Protected |
| `/analytics` | Sprint analytics and charts      | Protected |

## Architecture

SprintDesk separates server state, application state, API communication, and presentation logic.

```text
UI Components
      ↓
Hooks / Query Layer
      ↓
API / Service Layer
      ↓
External APIs / Mock Data
```

### Server State

TanStack Query handles data originating from external or simulated backend sources, including:

- Mock task data
- Users
- Sprints
- Comments
- Notification polling
- Loading and error states
- Caching and refetching

### Client State

Zustand manages persistent application state, including:

- Authentication
- Kanban board
- Notifications
- Comments
- Theme
- Toast messages

Local component state is used for temporary UI state such as modal visibility and form inputs.

## Project Structure

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
└── utils/
```

## Data Sources

### mock-data.json

`mock-data.json` acts as the simulated SprintDesk backend and provides:

- Users
- Sprints
- Tasks
- Comments
- Initial notifications

Data access is centralized through the service layer so UI components are not directly coupled to the JSON structure.

### DummyJSON

DummyJSON is used for authentication.

#### Login

```text
POST https://dummyjson.com/auth/login
```

Example request:

```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 1
}
```

#### Current User

```text
GET https://dummyjson.com/auth/me
```

The access token is attached using:

```text
Authorization: Bearer <access-token>
```

#### Token Refresh

```text
POST https://dummyjson.com/auth/refresh
```

If an authenticated API request returns `401`, SprintDesk:

1. Retrieves the stored refresh token.
2. Requests a new access token.
3. Updates authentication state.
4. Retries the original failed request.
5. Logs the user out if refresh fails.

## Authentication Architecture

The access token is stored only in Zustand memory.

The refresh token is persisted using localStorage to simulate persistent authentication.

```text
Login
  ↓
Access Token → Memory
Refresh Token → localStorage
  ↓
Protected API Request
  ↓
401
  ↓
Refresh Token
  ↓
New Access Token
  ↓
Retry Original Request
```

Multiple simultaneous failed requests share the same refresh operation to prevent duplicate refresh requests.

## Kanban Board

The Sprint Board contains four columns:

- Backlog
- In Progress
- Review
- Done

Users can:

- Drag tasks between columns
- Reorder tasks
- Open task details
- Edit tasks
- Change priority
- Change status
- Change assignee
- Change due date
- Add comments
- Create tasks
- Delete tasks with confirmation

Board state is persisted using Zustand middleware and localStorage.

When a task moves to **Done**, its completion timestamp is automatically generated. Moving it out of Done removes that completion timestamp so analytics remain consistent.

## Analytics

The Analytics page uses Recharts and derives all visualization data from application data.

### Sprint Velocity

Displays the number of completed tasks per sprint.

### Task Status

Displays the current distribution of:

- Backlog
- In Progress
- Review
- Done

### Priority Breakdown

Displays tasks grouped by:

- High
- Medium
- Low

### Completion Trend

Shows cumulative task completion over time based on task completion timestamps.

Analytics automatically reflect board changes.

## Notifications

SprintDesk includes a simulated real-time notification system.

Initial notification data comes from `mock-data.json`.

Additional notifications are generated by polling:

```text
GET https://jsonplaceholder.typicode.com/posts?_limit=5
```

Features include:

- Notification bell
- Unread counter
- Read/unread status
- Mark individual notifications as read
- Mark all as read
- Pagination
- Persistent notification state
- Polling paused when the browser tab is hidden
- Polling resumed when the tab becomes visible
- Toast notification when new activity arrives

## Design System

Reusable UI components were created from scratch with Tailwind CSS instead of using an external component library.

Components include:

- Button
- Input
- Select
- Modal
- Toast
- DataTable
- Skeleton / Loading components

Components support reusable states, accessibility, responsiveness, and consistent styling.

## Responsive Design

SprintDesk supports desktop, tablet, and mobile layouts.

The application includes:

- Responsive navigation
- Mobile menu
- Horizontally scrollable Kanban columns
- Responsive analytics charts
- Full-width task drawer on small screens
- Responsive notification panel

The application is designed to remain usable at a 375px viewport.

## Accessibility

Accessibility considerations include:

- Proper form labels
- Keyboard-accessible controls
- Visible focus states
- Escape-key modal and drawer closing
- Modal focus management
- Semantic dialog roles
- ARIA attributes
- Meaningful avatar alternative text
- Keyboard drag-and-drop support

## Performance

Performance optimizations include:

- Route-level code splitting
- `React.lazy`
- `Suspense`
- `React.memo`
- `useMemo`
- `useCallback`
- TanStack Query caching
- Lazy route loading
- Optimized application state separation

## Testing

Unit tests are implemented with Vitest and React Testing Library.

Covered functionality includes:

- `useToast`
- Board store — adding tasks
- Board store — deleting tasks
- Board store — moving tasks
- Authentication interceptor
- Token refresh
- Failed-request retry

Run tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Local Setup

Clone the repository:

```bash
git clone https://github.com/AndreoSam/SprintDesk.git
```

Enter the project:

```bash
cd SprintDesk
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm run test
```

## Demo Authentication

DummyJSON test credentials can be used to access the application:

```text
Username: emilys
Password: emilyspass
```

These credentials are public test credentials provided by DummyJSON and are not application secrets.

## Security

No API keys, passwords, or private credentials are stored in the repository.

Authentication is simulated using DummyJSON for the purpose of this frontend assignment.

## Technical Decisions

### Why TanStack Query?

TanStack Query is used for server-state concerns such as fetching, loading states, caching, polling, and refetching.

### Why Zustand?

Zustand provides lightweight centralized application state without unnecessary prop drilling. It is used only where state must be shared across multiple parts of the application.

### Why a Service Layer?

UI components do not directly fetch `mock-data.json`. Centralizing data access makes it possible to replace the mock source with a real backend without rewriting presentation components.

### Why dnd-kit?

`@dnd-kit/core` provides flexible drag-and-drop behavior while supporting both pointer and keyboard interactions.

### Why Recharts?

Recharts provides responsive React chart components while allowing analytics values to remain derived from the application's actual task state.

## Future Improvements

Given additional development time, potential improvements would include:

- Backend task persistence
- Server-side notification support
- Advanced Kanban filtering
- Undo drag-and-drop
- Date-range analytics filters
- Analytics image export
- Storybook documentation
- Automated accessibility testing with axe-core

These are intentionally treated as future or bonus improvements rather than expanding the required project scope.

## Documentation

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)

## Author

**Andreo Samaddar**

Frontend Engineer

GitHub: `AndreoSam`
