# Admin Panel Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD (Next.js 15)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              Browser (React 19 Client Components)            │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ • Sidebar Navigation                                         │  │
│  │ • Project/Event Forms                                        │  │
│  │ • Data Tables with CRUD Actions                             │  │
│  │ • Real-time Validation (React Hook Form + Zod)              │  │
│  │ • Toast Notifications & Dialogs                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↓ HTTP Requests                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            API Routes / Server Actions (Next.js)             │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ Authentication:                                              │  │
│  │ • POST /api/admin/auth/login                                │  │
│  │ • POST /api/admin/auth/logout                               │  │
│  │ • GET /api/admin/auth/me                                    │  │
│  │                                                              │  │
│  │ Projects CRUD:                                               │  │
│  │ • GET /api/admin/projects                                   │  │
│  │ • POST /api/admin/projects (Create)                         │  │
│  │ • PUT /api/admin/projects/[id] (Update)                     │  │
│  │ • DELETE /api/admin/projects/[id] (Delete)                  │  │
│  │                                                              │  │
│  │ Events CRUD:                                                 │  │
│  │ • GET /api/admin/events                                     │  │
│  │ • POST /api/admin/events (Create)                           │  │
│  │ • PUT /api/admin/events/[id] (Update)                       │  │
│  │ • DELETE /api/admin/events/[id] (Delete)                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │             Authentication & Validation Layer                │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ • JWT Token Verification (lib/auth.ts)                      │  │
│  │ • Zod Schema Validation (lib/validations/)                  │  │
│  │ • Admin Authorization Check                                 │  │
│  │ • Error Handling & Response Formatting                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↓                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │          GitHub Content Management Layer                     │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ • GitHub API Client (lib/github/client.ts)                  │  │
│  │ • Project Operations (lib/github/project-operations.ts)     │  │
│  │ • Event Operations (lib/github/event-operations.ts)         │  │
│  │                                                              │  │
│  │ Functions:                                                   │  │
│  │ • fetchFileFromGitHub()                                     │  │
│  │ • decodeBase64Content()                                     │  │
│  │ • modifyJSON()                                              │  │
│  │ • commitToGitHub()                                          │  │
│  │ • triggerVercelRedeploy()                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                             ↓ HTTPS Requests                        │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      GitHub REST API v3                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  GET /repos/{owner}/{repo}/contents/data/projects.json             │
│  • Returns: File metadata + Base64 encoded content + SHA            │
│                                                                     │
│  PUT /repos/{owner}/{repo}/contents/data/projects.json             │
│  • Input: Base64 encoded content + commit message + SHA             │
│  • Returns: New commit SHA + metadata                               │
│                                                                     │
│  DELETE /repos/{owner}/{repo}/contents/data/projects.json          │
│  • Input: SHA for deletion confirmation                             │
│  • Returns: Commit confirmation                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    GitHub Repository                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  data/                                                              │
│  ├── projects.json (JSON array of projects)                        │
│  ├── events.json (JSON array of events)                            │
│  │                                                                 │
│  └── Commit History:                                                │
│      ├── Commit: "Create project: Khilgaon Residency"              │
│      ├── Commit: "Update project: khilgaon-residency-a"            │
│      └── Commit: "Delete project: old-project-id"                  │
│                                                                     │
│  Features:                                                          │
│  ✅ Version Control (full commit history)                          │
│  ✅ Backup & Recovery (git revert)                                 │
│  ✅ Collaborative (multiple admins)                                │
│  ✅ Audit Trail (who changed what when)                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ (Optional)
┌─────────────────────────────────────────────────────────────────────┐
│                    Vercel Deployment                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Webhook Triggered on Content Change                               │
│  • Vercel receives webhook notification                            │
│  • Git pull latest changes                                         │
│  • NextJS rebuild                                                  │
│  • Deploy new version                                              │
│  • Site live with updated content                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
ADMIN ACTION (Create Project)
        ↓
[1] FORM SUBMISSION
    ├─ Project name (EN/BN)
    ├─ Location details
    ├─ Status, progress
    └─ Gallery images

        ↓
[2] CLIENT-SIDE VALIDATION
    ├─ React Hook Form validates
    ├─ Zod schema applied
    └─ Show errors or proceed

        ↓
[3] SEND TO API
    ├─ POST /api/admin/projects
    ├─ JSON body with project data
    └─ Authorization header

        ↓
[4] SERVER-SIDE PROCESSING
    ├─ Verify admin authentication
    ├─ Check JWT token validity
    └─ Validate admin permissions

        ↓
[5] DATA VALIDATION
    ├─ Zod schema validation
    ├─ Check required fields
    ├─ Validate formats (URLs, etc)
    └─ Return errors if invalid

        ↓
[6] GITHUB API CALL #1 - FETCH
    ├─ GET /repos/owner/repo/contents/data/projects.json
    ├─ Receive Base64 content + SHA
    └─ Parse authorization headers

        ↓
[7] DECODE & PARSE
    ├─ Decode Base64 → UTF-8 text
    ├─ Parse JSON string → Object array
    └─ Validate JSON structure

        ↓
[8] MODIFY DATA
    ├─ Generate unique ID
    ├─ Add timestamps
    ├─ Append to projects array
    └─ Prepare updated JSON

        ↓
[9] GITHUB API CALL #2 - COMMIT
    ├─ PUT /repos/owner/repo/contents/data/projects.json
    ├─ Encode new JSON to Base64
    ├─ Include commit message
    ├─ Include SHA for conflict detection
    └─ GitHub creates new commit

        ↓
[10] TRIGGER DEPLOYMENT (Optional)
     ├─ Webhook: POST to Vercel
     └─ Vercel rebuilds & deploys

        ↓
[11] RESPONSE TO CLIENT
     ├─ Success message
     ├─ Toast notification
     ├─ Refresh project list
     └─ Close form dialog

        ↓
[12] USER SEES RESULT
     ├─ New project in table
     ├─ Can edit/delete it
     └─ Content synced to live site
```

## Authentication Flow

```
LOGIN REQUEST
    ↓
[1] Admin enters credentials
    ├─ Email: admin@sabit.com
    └─ Password: ••••••

    ↓
[2] POST /api/admin/auth/login
    ├─ Receive email & password
    ├─ Hash password (from env)
    └─ Compare with stored credentials

    ↓
[3] Verify Credentials
    ├─ Look up in ADMIN_CREDENTIALS env
    ├─ Match email & password
    ├─ Get admin details (name, role)
    └─ Return if valid

    ↓
[4] Create JWT Token
    ├─ Sign with JWT_SECRET
    ├─ Add claims:
    │  ├─ id (base64 email)
    │  ├─ email
    │  ├─ name
    │  ├─ role
    │  ├─ iat (issued at)
    │  └─ exp (30 days)
    └─ Return token

    ↓
[5] Set HTTP-Only Cookie
    ├─ adminToken=eyJ...
    ├─ httpOnly: true (not accessible to JS)
    ├─ secure: true (HTTPS only in production)
    ├─ sameSite: lax
    └─ maxAge: 30 days

    ↓
[6] Response to Browser
    ├─ Status 200 OK
    ├─ Cookie set
    ├─ JSON response with admin info
    └─ Redirect to /admin/dashboard

    ↓
SUBSEQUENT REQUESTS
    ├─ Browser sends cookie automatically
    ├─ Server verifies JWT
    ├─ Decode token
    ├─ Check expiration
    └─ Allow/deny access

    ↓
LOGOUT
    ├─ POST /api/admin/auth/logout
    ├─ Delete adminToken cookie
    └─ Redirect to /admin/login
```

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx              # Login form UI
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard overview
│   │   ├── projects/
│   │   │   └── page.tsx              # Project management UI
│   │   ├── events/
│   │   │   └── page.tsx              # Event management UI
│   │   └── layout.tsx                # Admin layout wrapper
│   │
│   └── api/
│       └── admin/
│           ├── auth/
│           │   ├── login/route.ts    # Login endpoint
│           │   ├── logout/route.ts   # Logout endpoint
│           │   └── me/route.ts       # Current user endpoint
│           │
│           ├── projects/
│           │   ├── route.ts          # GET (list), POST (create)
│           │   └── [id]/route.ts     # PUT (update), DELETE
│           │
│           └── events/
│               ├── route.ts          # GET (list), POST (create)
│               └── [id]/route.ts     # PUT (update), DELETE
│
├── lib/
│   ├── auth.ts                       # JWT, cookies, credentials
│   ├── image-upload.ts               # Cloudinary integration
│   ├── admin-actions.ts              # Server actions
│   ├── admin-utils.ts                # Helper functions
│   │
│   ├── github/
│   │   ├── client.ts                 # GitHub API client
│   │   ├── project-operations.ts     # Project CRUD logic
│   │   └── event-operations.ts       # Event CRUD logic
│   │
│   └── validations/
│       ├── project.ts                # Zod schemas (projects)
│       └── event.ts                  # Zod schemas (events)
│
├── components/
│   └── admin/
│       ├── sidebar.tsx               # Navigation sidebar
│       ├── bilingual-input.tsx       # Reusable bilingual input
│       ├── delete-confirm-dialog.tsx # Delete confirmation modal
│       ├── protected-route.tsx       # Route protection wrapper
│       └── skeletons.tsx             # Loading skeletons
│
├── types/
│   └── index.ts                      # All TypeScript interfaces
│
└── middleware.ts                     # Route protection middleware

data/
├── projects.json                     # Projects data (GitHub)
└── events.json                       # Events data (GitHub)

Configuration:
├── next.config.mjs
├── tsconfig.json
├── tailwind.config.ts
├── .env.local                        # Environment variables
├── middleware.ts                     # Route protection

Documentation:
├── GITHUB_CMS_SETUP.md               # Detailed setup guide
├── GITHUB_API_INDEX.md               # API reference
├── ADMIN_QUICKSTART.md               # Quick start guide
└── ARCHITECTURE.md                   # This file
```

## Technology Stack

```
Frontend Layer:
├─ React 19 (UI framework)
├─ Next.js 15 App Router (framework)
├─ TypeScript (type safety)
├─ React Hook Form (form state)
├─ Zod (validation)
└─ Tailwind CSS (styling)

Backend Layer:
├─ Next.js API Routes (REST API)
├─ Next.js Server Actions (alternative)
├─ Node.js (runtime)
└─ TypeScript (type safety)

Data Layer:
├─ GitHub REST API v3 (storage)
├─ JSON files (data format)
├─ GitHub (version control)
└─ Cloudinary (image storage)

Authentication:
├─ JWT (token-based)
├─ jose (JWT signing/verification)
├─ HTTP-only cookies (secure storage)
└─ Environment variables (credentials)

Deployment:
├─ Vercel (hosting)
├─ GitHub Actions (CI/CD)
└─ Webhooks (auto-deploy)
```

## Key Components Breakdown

### 1. GitHub Client (lib/github/client.ts)
```typescript
Responsibilities:
├─ Authentication with GitHub
├─ Base64 encoding/decoding
├─ HTTP requests to GitHub API
├─ SHA handling for updates
├─ Error handling
└─ Rate limit management
```

### 2. Project Operations (lib/github/project-operations.ts)
```typescript
Responsibilities:
├─ Read operations (get projects)
├─ Create operations (add project)
├─ Update operations (modify project)
├─ Delete operations (remove project)
├─ Filter by status
└─ Commit messages
```

### 3. Authentication (lib/auth.ts)
```typescript
Responsibilities:
├─ JWT token creation
├─ Token verification
├─ Cookie management
├─ Credential validation
├─ Admin session handling
└─ Logout functionality
```

### 4. Validation Schemas (lib/validations/)
```typescript
Responsibilities:
├─ Zod schema definitions
├─ Type inference
├─ Bilingual text validation
├─ URL validation
├─ Numeric range validation
└─ Required field checking
```

## Deployment Architecture

```
Development:
├─ Local machine
├─ npm run dev
└─ http://localhost:3000

Staging:
├─ Git push to develop branch
├─ Vercel CI/CD pipeline
├─ Automated tests
└─ Preview deployment

Production:
├─ Git push to main branch
├─ Vercel deployment
├─ Auto-redeployment on content change
└─ CDN distribution
```

## Security Layers

```
Layer 1: Authentication
├─ JWT tokens
├─ HTTP-only cookies
├─ Token expiration (30 days)
└─ Secure password validation

Layer 2: Authorization
├─ Admin role verification
├─ Middleware route protection
├─ Cookie validation on each request
└─ Server-side permission checks

Layer 3: Validation
├─ Client-side (React Hook Form)
├─ Server-side (Zod schemas)
├─ Type checking (TypeScript)
└─ Error handling

Layer 4: Data Protection
├─ GitHub API authentication
├─ HTTPS-only communication
├─ Base64 encoding (GitHub requirement)
└─ Secure environment variables

Layer 5: Infrastructure
├─ Vercel security
├─ GitHub repository privacy
├─ Cloudinary security
└─ CORS policies
```

## Performance Considerations

```
Optimization Strategies:
├─ Server components where possible
├─ Incremental Static Regeneration
├─ Image optimization
├─ Lazy loading in tables
├─ Skeleton screens during loading
├─ Efficient GitHub API calls
└─ Caching strategies

Scaling:
├─ GitHub rate limits (5000/hour)
├─ Suitable for small teams
├─ Low-cost infrastructure
├─ No database costs
└─ Cloudinary for images
```

## Future Enhancements

```
Potential Improvements:
├─ Advanced search & filtering
├─ Bulk operations
├─ Content scheduling
├─ User analytics
├─ Email notifications
├─ Image galleries management
├─ Content versioning UI
├─ Team collaboration
├─ Two-factor authentication
└─ API for external integrations
```

---

**Note:** This architecture is designed for small to medium teams with low-to-medium content update frequency. For enterprise scale, consider adding a dedicated database layer.
