# GitHub API Index

This file contains all GitHub API utilities and functions used in the admin panel.

## Core Utilities

### `src/lib/github/client.ts`
Main GitHub API client class with methods:

- `getFile(path)` - Fetch raw file from GitHub
- `getJSON(path)` - Fetch and parse JSON file
- `getJSONArray(path)` - Fetch JSON array file
- `getJSONObject(path)` - Fetch JSON object file
- `putFile(path, content, message, sha)` - Create/update file
- `updateJSON(path, data, message)` - Update JSON file
- `deleteFile(path, message)` - Delete file
- `triggerRedeploy(webhookUrl)` - Trigger Vercel redeploy

### Helper Functions
- `decodeContent(base64)` - Decode Base64 content
- `encodeContent(content)` - Encode to Base64
- `getGitHubClient()` - Get configured client instance

## Project Operations

### `src/lib/github/project-operations.ts`

**Read Operations:**
- `getProjects()` - Get all projects
- `getProjectById(id)` - Get single project by ID
- `getProjectsByStatus(status)` - Filter projects by status

**Write Operations:**
- `createProject(project)` - Create new project
- `updateProject(id, updates)` - Update project
- `deleteProject(id)` - Delete project

All operations return `ApiResponse` with success/error status.

## Event Operations

### `src/lib/github/event-operations.ts`

**Read Operations:**
- `getEvents()` - Get all events
- `getEventById(id)` - Get single event by ID
- `getUpcomingEvents()` - Get upcoming events sorted by date
- `getPastEvents()` - Get past events sorted by date

**Write Operations:**
- `createEvent(event)` - Create new event
- `updateEvent(id, updates)` - Update event
- `deleteEvent(id)` - Delete event

All operations return `ApiResponse` with success/error status.

## Automatic Features

Each write operation automatically:
1. ✅ Validates input with Zod schemas
2. ✅ Fetches current file from GitHub
3. ✅ Decodes Base64 content
4. ✅ Modifies JSON safely
5. ✅ Encodes updated content
6. ✅ Commits with meaningful message
7. ✅ Triggers Vercel redeploy (if webhook set)

## GitHub API Flow

```
Admin Action
    ↓
Validation (Zod)
    ↓
API Route Handler
    ↓
GitHub Client
    ├─ GET /repos/{owner}/{repo}/contents/{path}
    ├─ Decode Base64
    ├─ Modify JSON
    └─ PUT /repos/{owner}/{repo}/contents/{path}
    ↓
Vercel Webhook (optional)
    ↓
Site Redeployed
```

## Error Handling

All operations include error handling for:
- Invalid GitHub credentials
- Missing files
- Malformed JSON
- Invalid API responses
- Encoding/decoding errors
- Network failures

Errors are returned in `ApiResponse`:
```typescript
{
  success: false,
  error: "Descriptive error message"
}
```

## Rate Limiting

GitHub API has rate limits:
- **Unauthenticated:** 60 requests/hour
- **Authenticated:** 5,000 requests/hour

Current implementation should easily handle small teams with typical usage.

## Security

✅ GitHub token stored in environment variables
✅ Tokens never exposed to frontend
✅ All API calls from server-side only
✅ Admin authentication required on all routes
✅ Validated input before GitHub operations
