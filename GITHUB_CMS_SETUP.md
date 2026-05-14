# GitHub-Powered CMS Admin Panel - Setup Guide

This is a complete admin panel system that stores all content directly in your GitHub repository as JSON files, eliminating the need for traditional databases.

## Architecture Overview

```
GitHub Repository (Single Source of Truth)
    ↓
GitHub REST API (v3)
    ↓
NextAuth.js / JWT (Authentication)
    ↓
Admin Dashboard (React/Next.js 15)
    ↓
Vercel (Auto-deploy on changes)
```

## Key Features

✅ **No Database Required** - All data stored in JSON files in GitHub
✅ **Automatic Deployments** - Vercel redeploys on every change
✅ **Bilingual Support** - English/Bangla fields for all content
✅ **Type-Safe** - Full TypeScript support with Zod validation
✅ **Beautiful UI** - Modern SaaS-style admin dashboard
✅ **CRUD Operations** - Create, Read, Update, Delete for projects and events
✅ **Image Uploads** - Cloudinary integration for image hosting
✅ **Authentication** - Simple JWT-based admin authentication

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# GitHub API Configuration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username_or_org
GITHUB_REPO=your_repository_name

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_CREDENTIALS=admin@sabit.com:password123:Admin Name:admin

# Cloudinary (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Vercel (optional - for auto-deploy webhook)
VERCEL_REDEPLOY_WEBHOOK=https://api.vercel.com/v1/integrations/deploy/...
```

## Setup Instructions

### 1. Generate GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a name like "Sabit CMS"
4. Select scopes:
   - `repo` (full control of private repositories)
   - `workflow` (if you want to trigger GitHub Actions)
5. Copy the token and save it to `.env.local` as `GITHUB_TOKEN`

### 2. Create Initial JSON Files in GitHub

Commit these files to your repository:

**`data/projects.json`**
```json
[]
```

**`data/events.json`**
```json
[]
```

### 3. Set Admin Credentials

In `.env.local`, configure admin login:

```env
ADMIN_CREDENTIALS=admin@sabit.com:yourpassword:Admin Name:admin
```

Multiple admins:
```env
ADMIN_CREDENTIALS=admin1@sabit.com:pass1:Admin One:admin,admin2@sabit.com:pass2:Admin Two:superadmin
```

### 4. Configure Cloudinary (Optional)

If using image uploads:

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your Cloud Name from the dashboard
3. Create an unsigned upload preset for client-side uploads
4. Add credentials to `.env.local`

### 5. Set Up Vercel Redeploy Webhook (Optional)

To auto-deploy when content changes:

1. Get your Vercel deployment hook URL
2. Add it to `.env.local` as `VERCEL_REDEPLOY_WEBHOOK`

The system will automatically trigger redeploys when admins make changes.

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx           # Admin login page
│   │   ├── dashboard/page.tsx       # Dashboard overview
│   │   ├── projects/page.tsx        # Project management
│   │   ├── events/page.tsx          # Event management
│   │   └── layout.tsx               # Admin layout
│   ├── api/
│   │   └── admin/
│   │       ├── auth/                # Authentication endpoints
│   │       ├── projects/route.ts    # Project CRUD API
│   │       └── events/route.ts      # Event CRUD API
│
├── components/
│   └── admin/
│       ├── sidebar.tsx              # Navigation sidebar
│       ├── bilingual-input.tsx      # Bilingual form input
│       ├── delete-confirm-dialog.tsx# Delete confirmation
│       └── skeletons.tsx            # Loading skeletons
│
├── lib/
│   ├── auth.ts                      # JWT & authentication
│   ├── image-upload.ts              # Image handling
│   ├── github/
│   │   ├── client.ts                # GitHub API client
│   │   ├── project-operations.ts    # Project CRUD
│   │   └── event-operations.ts      # Event CRUD
│   └── validations/
│       ├── project.ts               # Project schema
│       └── event.ts                 # Event schema
│
├── types/
│   └── index.ts                     # All type definitions
│
└── middleware.ts                    # Route protection
```

## Usage Guide

### Access Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Login with your configured credentials
3. Access dashboard at `/admin/dashboard`

### Project Management

**Create Project:**
- Click "New Project" button
- Fill in bilingual fields (English & Bangla)
- Add project details, amenities, financials
- Submit to commit to GitHub

**Edit Project:**
- Click edit icon on any project
- Modify fields
- Submit to update

**Delete Project:**
- Click delete icon
- Confirm deletion
- Project removed from `data/projects.json`

### Event Management

**Create Event:**
- Click "New Event" button
- Fill in event details
- Set date, type, and status (upcoming/past)
- Submit to commit to GitHub

**Manage Events:**
- Edit or delete events using table actions
- Toggle between upcoming and past events

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Login with email/password
- `POST /api/admin/auth/logout` - Logout and clear token
- `GET /api/admin/auth/me` - Get current admin info

### Projects
- `GET /api/admin/projects` - Get all projects
- `POST /api/admin/projects` - Create new project
- `PUT /api/admin/projects/[id]` - Update project
- `DELETE /api/admin/projects/[id]` - Delete project

### Events
- `GET /api/admin/events` - Get all events
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events/[id]` - Update event
- `DELETE /api/admin/events/[id]` - Delete event

## Data Flow

```
1. Admin fills form → 2. React Hook Form validates → 3. Zod schema validation
    ↓
4. API call to Next.js route → 5. GitHub API fetches JSON file (Base64)
    ↓
6. Decode Base64 → 7. Parse JSON → 8. Modify data
    ↓
9. Encode to Base64 → 10. Commit via GitHub API → 11. Trigger Vercel redeploy
    ↓
12. Vercel rebuilds site with new data → 13. Live on production
```

## Security Considerations

✅ **Authentication:** JWT tokens stored in HTTP-only cookies
✅ **Validation:** All inputs validated with Zod schemas
✅ **API Protection:** All routes check for valid admin token
✅ **Cloudinary:** Image uploads use unsigned preset or signed tokens
✅ **Environment Variables:** Sensitive keys never exposed to client

## Troubleshooting

### "GitHub API Error"
- Check `GITHUB_TOKEN` is valid
- Verify `GITHUB_OWNER` and `GITHUB_REPO` are correct
- Ensure token has `repo` scope

### "Validation Failed"
- Check all bilingual fields are filled
- Verify image URLs are valid
- Ensure required fields are not empty

### "Unauthorized"
- Check JWT_SECRET is set
- Verify admin credentials in ADMIN_CREDENTIALS
- Clear browser cookies and login again

### Images Not Uploading
- Verify Cloudinary credentials
- Check upload preset is unsigned
- Confirm NEXT_PUBLIC_ variables are accessible

## Production Deployment

1. **Commit all code to GitHub**
2. **Connect Vercel to your GitHub repo**
3. **Add environment variables in Vercel dashboard:**
   - Settings → Environment Variables
   - Add all .env.local variables
4. **Deploy**
5. **Set up GitHub Actions for auto-updates (optional)**

## Example Project Structure (JSON)

```json
{
  "id": "sabit-khilgaon-block-a",
  "slug": "sabit-khilgaon-block-a",
  "name": {
    "en": "Sabit Khilgaon Residency — Block A",
    "bn": "সাবিত খিলগাঁও রেসিডেন্সি — ব্লক এ"
  },
  "location": {
    "en": "Khilgaon, Dhaka",
    "bn": "খিলগাঁও, ঢাকা"
  },
  "status": "handover",
  "description": {
    "en": "A modern residential complex...",
    "bn": "একটি আধুনিক আবাসিক কমপ্লেক্স..."
  },
  "image": "https://cdn.example.com/image.jpg",
  "gallery": [
    "https://cdn.example.com/gallery-1.jpg",
    "https://cdn.example.com/gallery-2.jpg"
  ],
  "progressPercent": 100,
  "specifications": {
    "bedrooms": 3,
    "bathrooms": 2,
    "parkingSpaces": 1
  },
  "amenities": {
    "interior": [
      { "en": "Ceramic Tile Flooring", "bn": "সিরামিক টাইল মেঝে" }
    ],
    "exterior": [],
    "building": []
  },
  "createdAt": "2024-05-13T10:00:00Z",
  "updatedAt": "2024-05-13T10:00:00Z"
}
```

## Best Practices

1. **Regular Backups:** GitHub automatically versions all changes
2. **Keep JSON Valid:** Admin panel validates before committing
3. **Use Meaningful IDs:** Use slugs for project/event IDs
4. **Test Changes:** Preview before deploying to production
5. **Monitor Deployments:** Check Vercel dashboard for deploy status
6. **Update Content Regularly:** Keep information fresh and relevant

## Support & Troubleshooting

For issues:
1. Check environment variables are set correctly
2. Verify GitHub token has proper permissions
3. Review browser console for error messages
4. Check Vercel deployment logs
5. Test API endpoints directly with curl/Postman

## Next Steps

1. ✅ Configure all environment variables
2. ✅ Create initial JSON files in GitHub
3. ✅ Deploy to Vercel
4. ✅ Test admin panel login
5. ✅ Create your first project/event
6. ✅ Verify content appears on website
7. ✅ Set up team member access

---

**Built with:** Next.js 15 • React 19 • TypeScript • Zod • GitHub API • Tailwind CSS • Radix UI
