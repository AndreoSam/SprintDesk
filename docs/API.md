# SprintDesk — API Documentation

## 1. Overview

SprintDesk uses three data sources:

1. DummyJSON — authentication and token refresh
2. JSONPlaceholder — simulated notification polling
3. `mock-data.json` — primary application data

The application centralizes API and data access through dedicated API/service modules.

UI components do not directly communicate with external APIs or fetch the mock JSON throughout the application.

---

# 2. DummyJSON Authentication API

Base URL:

```text
https://dummyjson.com
```

DummyJSON is used only for authentication-related operations.

---

## 2.1 Login

Authenticates the user and returns access and refresh tokens.

### Endpoint

```http
POST /auth/login
```

### Full URL

```text
https://dummyjson.com/auth/login
```

### Request Headers

```http
Content-Type: application/json
```

### Request Body

Example:

```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 1
}
```

`expiresInMins` is intentionally set to a short duration so token expiration and silent refresh can be demonstrated.

### Example Response

The response contains authenticated user information together with authentication tokens.

Example structure:

```json
{
  "id": 1,
  "username": "emilys",
  "email": "user@example.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "accessToken": "<access-token>",
  "refreshToken": "<refresh-token>"
}
```

### SprintDesk Behavior

After successful login:

```text
accessToken
    ↓
Stored in Zustand memory

refreshToken
    ↓
Stored in localStorage
```

The user is then allowed to access protected application routes.

---

# 3. Authenticated Requests

Authenticated DummyJSON requests use the access token.

### Header

```http
Authorization: Bearer <access-token>
```

The shared SprintDesk API client automatically attaches this header when an access token exists.

---

# 4. Current User

Retrieves the currently authenticated user.

### Endpoint

```http
GET /auth/me
```

### Full URL

```text
https://dummyjson.com/auth/me
```

### Request Headers

```http
Authorization: Bearer <access-token>
```

### Example Response

```json
{
  "id": 1,
  "username": "emilys",
  "email": "user@example.com",
  "firstName": "Emily",
  "lastName": "Johnson"
}
```

### SprintDesk Usage

This endpoint is used during authenticated session validation and session restoration.

---

# 5. Refresh Access Token

Requests a new access token using the persisted refresh token.

### Endpoint

```http
POST /auth/refresh
```

### Full URL

```text
https://dummyjson.com/auth/refresh
```

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "refreshToken": "<refresh-token>",
  "expiresInMins": 1
}
```

### Example Response

```json
{
  "accessToken": "<new-access-token>",
  "refreshToken": "<new-refresh-token>"
}
```

### SprintDesk Refresh Flow

When an authenticated request receives `401`:

```text
Request
   ↓
401 Unauthorized
   ↓
Read persisted refresh token
   ↓
POST /auth/refresh
   ↓
Receive new access token
   ↓
Update Zustand authentication state
   ↓
Persist replacement refresh token
   ↓
Retry original request
```

A shared refresh promise is used to prevent simultaneous failed requests from triggering multiple refresh calls.

If refresh fails:

```text
Refresh Failure
      ↓
Clear Authentication State
      ↓
User must authenticate again
```

---

# 6. JSONPlaceholder Notification API

Base URL:

```text
https://jsonplaceholder.typicode.com
```

JSONPlaceholder is used only to simulate notification polling.

It is not used as the SprintDesk task/user backend.

---

## 6.1 Notification Polling

### Endpoint

```http
GET /posts?_limit=5
```

### Full URL

```text
https://jsonplaceholder.typicode.com/posts?_limit=5
```

### Example Response

```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "Example post title",
    "body": "Example post body"
  }
]
```

### Transformation

SprintDesk transforms each post into an application notification.

Conceptually:

```text
JSONPlaceholder Post
        ↓
Post ID checked
        ↓
New ID?
   ┌────┴────┐
  No        Yes
  │          │
Ignore       ▼
        Notification
```

A transformed notification contains application-specific fields such as:

```json
{
  "id": 1001,
  "title": "New sprint activity",
  "message": "Example post title",
  "type": "system",
  "read": false,
  "createdAt": "2026-08-21T10:00:00.000Z"
}
```

An ID offset is used so polled notification IDs do not collide with initial notification IDs from `mock-data.json`.

---

# 7. Notification Polling Lifecycle

Notification polling is managed through TanStack Query.

Behavior:

```text
Browser Tab Visible
       ↓
Polling Active
       ↓
Fetch latest posts
       ↓
Compare IDs
       ↓
Store new notifications
```

When the browser tab becomes hidden:

```text
visibilityState = hidden
        ↓
Polling Paused
```

When the user returns:

```text
visibilityState = visible
        ↓
Immediate Refetch
        ↓
Polling Resumes
```

Notification state is persisted using Zustand and localStorage.

---

# 8. Mock Data Service

`mock-data.json` is the primary application data source for:

- Users
- Sprints
- Tasks
- Comments
- Initial notifications

The mock data is treated as if it were a backend response.

Components do not directly fetch the file.

Instead:

```text
UI
 ↓
Custom Hook / TanStack Query
 ↓
Mock Data Service
 ↓
mock-data.json
```

---

## 8.1 Tasks

The task service retrieves the first 30 tasks from the supplied mock dataset.

Conceptual operation:

```http
GET /tasks
```

Actual implementation:

```text
mock-data.json
      ↓
data.tasks
      ↓
First 30 records
```

### Task Structure

Example:

```json
{
  "id": 1,
  "title": "Task title",
  "description": "Task description",
  "status": "backlog",
  "priority": "high",
  "assigneeId": 1,
  "dueDate": "2026-08-25",
  "sprintId": 3,
  "order": 1,
  "createdAt": "2026-08-20T10:00:00Z",
  "completedAt": null,
  "updatedAt": "2026-08-20T10:00:00Z"
}
```

### Supported Client Operations

After initial loading, board interactions are handled through Zustand:

- Add task
- Update task
- Move task
- Reorder task
- Delete task

These operations simulate mutations that would normally be sent to a backend.

---

## 8.2 Users

Conceptual operation:

```http
GET /users
```

Used for:

- Task assignees
- User avatars
- Comment authors

### Example Structure

```json
{
  "id": 1,
  "name": "Example User",
  "email": "user@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## 8.3 Sprints

Conceptual operation:

```http
GET /sprints
```

Sprint data is used by the Analytics page, particularly for Sprint Velocity calculations.

### Example Structure

```json
{
  "id": 3,
  "name": "Sprint 3",
  "startDate": "2026-08-17",
  "endDate": "2026-08-28"
}
```

---

## 8.4 Comments

Conceptual operation:

```http
GET /comments
```

Comments are associated with tasks through `taskId`.

### Example Structure

```json
{
  "id": 1,
  "taskId": 2,
  "authorId": 1,
  "message": "Example task comment",
  "createdAt": "2026-08-20T10:00:00Z"
}
```

New comments are managed in application state after the initial mock data has been loaded.

---

## 8.5 Initial Notifications

Conceptual operation:

```http
GET /notifications
```

Initial notifications are loaded from `mock-data.json`.

JSONPlaceholder polling can then add simulated new notifications.

---

# 9. Error Handling

API operations validate HTTP responses before consuming response data.

For unsuccessful requests:

```text
HTTP Error
   ↓
Error thrown by API layer
   ↓
TanStack Query / Auth flow receives error
   ↓
Application handles failure state
```

Authentication has additional handling for `401 Unauthorized` responses through the silent refresh/retry mechanism.

---

# 10. State Ownership

Different API results are managed according to their purpose.

| Data                    | Primary Management            |
| ----------------------- | ----------------------------- |
| Authentication requests | API layer                     |
| Access token            | Zustand memory                |
| Refresh token           | localStorage                  |
| Mock data loading       | TanStack Query                |
| Notification polling    | TanStack Query                |
| Board mutations         | Zustand                       |
| Notification state      | Zustand                       |
| Comments                | Zustand                       |
| Analytics               | Derived from application data |

This separation prevents server-state concerns from being mixed unnecessarily with application state.

---

# 11. Replacing Mock Data with a Real Backend

The service abstraction is intentionally designed so that:

```text
mock-data.json
```

could later be replaced with:

```text
GET /api/tasks
GET /api/users
GET /api/sprints
GET /api/comments
GET /api/notifications
```

without requiring major changes to page or presentation components.

Only the data-access/service implementation would need to change.

---

# 12. Security

SprintDesk does not require private API keys.

No real user passwords, secrets, or private credentials should be committed to the repository.

DummyJSON authentication credentials used for demonstrations are public test credentials.

The refresh-token localStorage behavior exists specifically to simulate persistent authentication as required by the frontend assignment.
