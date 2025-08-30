# AI Agent Instructions for AppScrum

This document provides essential guidance for AI agents working in the AppScrum codebase. It captures key architectural patterns, workflows, and conventions specific to this Scrum management platform.

## Architecture Overview

### Frontend (React + Vite)
- **Location**: `/AppScrum/src/`
- **Tech Stack**: React 19, Vite, Tailwind CSS, Clerk for auth, Axios for API calls
- **Key Patterns**:
  - Role-based component organization in `components/` (auth/, developers/, ProductOwner/, ScrumMaster/)
  - Custom hooks in `hooks/` for domain logic (e.g., `useScrumMaster.js`, `useSprintBoard.js`)
  - Centralized API service in `services/apiService.js`
  - Context providers: `RoleContext.jsx` for role management

### Backend (Node.js + Express)
- **Location**: `/backend/`
- **Tech Stack**: Node.js, Express 5, Mongoose (MongoDB), Clerk SDK, Octokit (GitHub integration)
- **Key Patterns**:
  - RESTful API with role-based authorization
  - Models in `/models/` with timestamps (`updated_at`) and soft deletion (`is_active`)
  - Business logic in `/services/` (e.g., `userService.js`, `scrumMasterService.js`)
  - Routes in `/routes/` with validation middleware

## Authentication & Authorization

- **Primary Auth**: Clerk integration with `clerk_id` as unique identifier in User model
- **Role System**: 5 roles with strict enum validation:
  ```javascript
  enum: ['super_admin', 'product_owner', 'scrum_master', 'developers', 'user']
  ```
- **Token Management**: Centralized in `apiService.js` with Bearer tokens
- **Role Context**: `RoleContext.jsx` syncs roles from server, falls back to Clerk metadata

## Development Workflow

### Setup Commands
```bash
# Frontend (from /AppScrum)
npm install
npm run dev  # Runs on http://localhost:5173

# Backend (from /backend)
npm install
npm run dev  # Uses nodemon for hot reload, runs on port 5000

# Database seeding (backend)
npm run seed              # Basic seed
npm run setup:complete    # Full setup with products, backlog, testing data
```

### Environment Variables
- **Frontend**: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL`
- **Backend**: `PORT`, `CORS_ORIGINS`, MongoDB connection, Clerk secrets

## Project-Specific Patterns

### 1. API Communication Pattern
```javascript
// Always use apiService for backend calls
import { apiService } from '../services/apiService';

// With Clerk token
const data = await apiService.request('/endpoint', {
  method: 'GET'
}, getToken); // getToken from useAuth()
```

### 2. Custom Hook Pattern
```javascript
// Hooks follow this structure for data management
export const useDomainData = (initialFilters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await domainService.getData(filters);
      setData(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
```

### 3. MongoDB Schema Pattern
```javascript
// Models include timestamps and soft delete
const schema = new mongoose.Schema({
  // Required fields with validation
  name: { type: String, required: [true, 'Name is required'] },
  
  // Enums for controlled values
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  
  // Timestamps
  fecha_creacion: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  
  // Soft delete
  is_active: { type: Boolean, default: true }
});

// Pre-save middleware for timestamps
schema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});
```

### 4. Role-Based Routing
```jsx
// Routes use RoleProtectedRoute wrapper
{
  path: '/product_owner',
  element: (
    <RoleProtectedRoute allowedRoles={['product_owner']}>
      <RoleBasedLayout />
    </RoleProtectedRoute>
  ),
  children: [
    { path: 'productos', element: <Productos /> },
    // ... role-specific routes
  ]
}
```

### 5. Error Handling Pattern
```javascript
// Centralized error handling in services
try {
  const response = await apiService.request(endpoint, options, getToken);
  return response;
} catch (error) {
  console.error('Service error:', error);
  throw new Error(`Operation failed: ${error.message}`);
}
```

## Common Tasks

### Adding New API Endpoints
1. **Create/Update Model** in `backend/models/` (follow schema patterns)
2. **Add Service Logic** in `backend/services/` (async/await, error handling)
3. **Create Route** in `backend/routes/` (validation, service calls)
4. **Update Frontend Service** in `src/services/` (apiService calls)
5. **Create Custom Hook** in `src/hooks/` (loading/error states)
6. **Add Component** in appropriate role-based directory

### Creating New Frontend Features
1. **Place in Role Directory**: `components/ProductOwner/`, `components/developers/`, etc.
2. **Use Existing Hooks**: Leverage `useScrumMaster.js`, `useSprintBoard.js` patterns
3. **Follow Role Context**: Check `RoleContext.jsx` for role-based logic
4. **Centralize API Calls**: Use `apiService.js` for all backend communication

### Database Operations
- **Soft Deletes**: Always check `is_active: true` in queries
- **Timestamps**: Use `updated_at` for optimistic concurrency
- **Unique Constraints**: Handle duplicate key errors gracefully
- **Indexing**: Add indexes for frequently queried fields (like `clerk_id`)

## Integration Points

1. **GitHub Integration**: Uses Octokit in `githubService.js` for repository management
2. **File Uploads**: Multer configured for bug reports and other attachments
3. **CORS**: Configured for multiple origins including Vercel deployment
4. **Clerk Webhooks**: Handle user creation/updates via webhooks

## Important Files to Reference

- **Frontend Core**: `src/main.jsx` (app initialization), `src/App.jsx` (router setup)
- **API Layer**: `src/services/apiService.js` (centralized API calls)
- **Role Management**: `src/context/RoleContext.jsx` (role synchronization)
- **Backend Entry**: `backend/server.js` (route setup, middleware)
- **Database Models**: `backend/models/User.js` (schema patterns)
- **Business Logic**: `backend/services/userService.js` (service patterns)

## Deployment Notes

- **Frontend**: Deployed to Vercel with `vercel.json` config
- **Backend**: Deployed to Render with persistent MongoDB
- **Environment Sync**: Ensure Clerk keys match between frontend/backend
- **CORS Origins**: Update `CORS_ORIGINS` for new deployment URLs

### Vercel Configuration
Set these environment variables in Vercel dashboard:
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `VITE_API_URL`: `https://your-render-app.onrender.com/api`

### Render Configuration
Set these environment variables in Render dashboard:
- `NODE_ENV`: `production`
- `PORT`: `10000` (or Render's assigned port)
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `CORS_ORIGINS`: `https://your-vercel-app.vercel.app`

Remember to check `.env` files and run `npm run setup:complete` for full development environment setup.

## Testing & Verification

### User Integration Test
```bash
# Backend directory
npm run test-users
```

### Manual Verification
1. **Register/Login** with Clerk in the frontend
2. **Check backend logs** - should show "Usuario creado:" 
3. **Verify database** - user should exist in MongoDB
4. **Check role loading** - no more "Failed to fetch" errors

### Common Issues Fixed
- ✅ Users now auto-create in database on first login
- ✅ Role loading prioritizes database over Clerk metadata
- ✅ Proper error handling for missing users
- ✅ CORS configured for production URLs
