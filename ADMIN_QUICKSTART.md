# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env.local`
```bash
cp .env.local.example .env.local
```

Then fill in your values:
```env
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_username
GITHUB_REPO=your_repo
ADMIN_CREDENTIALS=admin@sabit.com:password:Admin:admin
```

### 3. Create GitHub JSON Files
Commit these to your repository:

**`data/projects.json`:**
```json
[]
```

**`data/events.json`:**
```json
[]
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access Admin Panel
- Navigate to `http://localhost:3000/admin/login`
- Login with your credentials
- Create your first project or event!

## Directory Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/           # Auth entry point
│   │   ├── dashboard/       # Overview & stats
│   │   ├── projects/        # Project CRUD UI
│   │   ├── events/          # Event CRUD UI
│   │   └── layout.tsx       # Admin layout wrapper
│   ├── api/
│   │   └── admin/
│   │       ├── auth/        # Authentication endpoints
│   │       ├── projects/    # Project REST API
│   │       └── events/      # Event REST API
│
├── lib/
│   ├── auth.ts              # JWT & session management
│   ├── admin-actions.ts     # Server actions
│   ├── admin-utils.ts       # Helper functions
│   ├── image-upload.ts      # Cloudinary integration
│   ├── github/
│   │   ├── client.ts        # GitHub API client
│   │   ├── project-operations.ts
│   │   └── event-operations.ts
│   └── validations/
│       ├── project.ts       # Zod schemas
│       └── event.ts
│
├── components/
│   └── admin/
│       ├── sidebar.tsx
│       ├── bilingual-input.tsx
│       ├── delete-confirm-dialog.tsx
│       └── skeletons.tsx
│
├── types/
│   └── index.ts             # TypeScript interfaces
│
└── middleware.ts            # Route protection
```

## How It Works

### Flow Diagram

```
Admin Page (React Component)
    ↓
Form Input (React Hook Form + Zod validation)
    ↓
Submit to API Route
    ↓
Check Admin Authentication
    ↓
Validate Input with Zod
    ↓
GitHub API Client
    ├─ GET file (fetch current)
    ├─ Decode Base64
    ├─ Modify JSON
    └─ PUT file (commit changes)
    ↓
Trigger Vercel Redeploy (optional)
    ↓
Content Updated + Site Redeployed
```

## Core Features

### ✅ Authentication
- Simple JWT-based authentication
- Credentials stored in environment variables
- HTTP-only secure cookies
- Protected routes with middleware

### ✅ Project Management
- Create, read, update, delete projects
- Bilingual (English/Bangla) support
- Status tracking (handover/ongoing/upcoming)
- Progress percentage
- Gallery management
- Specifications, amenities, financials

### ✅ Event Management
- Create, read, update, delete events
- Bilingual support
- Event types: launch, investor-meet, community, announcement
- Date & time management
- Registration links
- Upcoming/past status

### ✅ Data Validation
- Zod schemas for all data types
- Client-side validation with React Hook Form
- Server-side validation before GitHub commit
- Comprehensive error messages

### ✅ Image Handling
- Cloudinary integration
- Unsigned uploads for client security
- Image optimization
- URL-only storage (no files in GitHub)

### ✅ GitHub Integration
- Direct API access to repository
- Base64 encoding/decoding
- Proper commit messages
- SHA handling for updates
- Rate limit handling

### ✅ Automatic Deployments
- Optional Vercel webhook integration
- Auto-redeploy on content changes
- Seamless content publishing

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Login
- `POST /api/admin/auth/logout` - Logout
- `GET /api/admin/auth/me` - Current user

### Projects
- `GET /api/admin/projects` - Get all
- `POST /api/admin/projects` - Create
- `PUT /api/admin/projects/[id]` - Update
- `DELETE /api/admin/projects/[id]` - Delete

### Events
- `GET /api/admin/events` - Get all
- `POST /api/admin/events` - Create
- `PUT /api/admin/events/[id]` - Update
- `DELETE /api/admin/events/[id]` - Delete

## Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `GITHUB_TOKEN` | GitHub authentication | Yes |
| `GITHUB_OWNER` | Repository owner | Yes |
| `GITHUB_REPO` | Repository name | Yes |
| `JWT_SECRET` | Session encryption | Yes |
| `ADMIN_CREDENTIALS` | Admin login info | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Image service | Optional |
| `VERCEL_REDEPLOY_WEBHOOK` | Auto-deploy hook | Optional |

## Example Credentials Format

```env
# Single admin
ADMIN_CREDENTIALS=admin@sabit.com:password123:Admin User:admin

# Multiple admins
ADMIN_CREDENTIALS=admin1@sabit.com:pass1:Admin One:admin,admin2@sabit.com:pass2:Admin Two:superadmin
```

## Deployment

### On Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
5. Admin panel available at your domain/admin

### GitHub Token Permissions
- `repo` - Full repository access
- `workflow` - Workflow access (optional)

## Security Best Practices

✅ Use strong passwords in `ADMIN_CREDENTIALS`
✅ Never commit `.env.local` file
✅ Rotate `JWT_SECRET` regularly
✅ Use secure GitHub token with minimal permissions
✅ Keep admin URLs private
✅ Monitor deployment logs
✅ Backup GitHub repository regularly

## Troubleshooting

### "Unauthorized" Error
- Check GitHub token is valid
- Verify `GITHUB_OWNER` and `GITHUB_REPO`
- Ensure token has `repo` scope

### "Validation Failed"
- Fill all bilingual fields (English & Bangla)
- Use valid URLs for images
- Check all required fields

### JSON File Not Found
- Create `data/projects.json` and `data/events.json` in GitHub
- Start with empty arrays: `[]`

### Images Not Uploading
- Verify Cloudinary credentials
- Check upload preset is unsigned
- Confirm file size < 10MB

## Support

For detailed setup instructions, see:
- [GITHUB_CMS_SETUP.md](./GITHUB_CMS_SETUP.md)
- [GITHUB_API_INDEX.md](./GITHUB_API_INDEX.md)

## Next Steps

1. ✅ Configure environment variables
2. ✅ Create JSON files in GitHub
3. ✅ Deploy to Vercel
4. ✅ Test login & create first project
5. ✅ Invite team members
6. ✅ Configure custom domain
7. ✅ Set up monitoring & backups

---

**Built with Love** ❤️ using Next.js 15, React 19, TypeScript, Zod, and GitHub
