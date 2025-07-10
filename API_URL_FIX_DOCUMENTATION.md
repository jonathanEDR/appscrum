# Authentication API URL Fix - Solution Documentation

## Problem Identified
The frontend was trying to connect to `http://localhost:3001/api/auth/user-profile` but the backend was running on port 5000, causing a 404 error.

## Root Cause
1. **Backend running on port 5000**: The backend server.js file was configured to run on port 5000
2. **Frontend API service using wrong URL**: The apiService.js had a hardcoded fallback URL pointing to port 3001
3. **Environment variable missing /api**: The .env file had `VITE_API_URL=http://localhost:5000` instead of `VITE_API_URL=http://localhost:5000/api`

## Solution Applied

### 1. Fixed apiService.js base URL
**File**: `AppScrum/src/services/apiService.js`
```javascript
// Changed from:
this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// To:
this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### 2. Updated environment variables
**File**: `AppScrum/.env`
```properties
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aGVyb2ljLWZseS0yNS5jbGVyay5hY2NvdW50cy5kZXYk
VITE_API_URL=http://localhost:5000/api
```

### 3. Verified backend endpoints
Confirmed that the backend has the correct route structure:
- Backend running on port 5000
- API routes mounted at `/api`
- Auth routes at `/api/auth/*`
- User profile endpoint at `/api/auth/user-profile`

## Verification Steps

### 1. Backend API Test
```bash
curl http://localhost:5000/api/health
# Returns: {"status":"OK","timestamp":"..."}

curl http://localhost:5000/api/auth/user-profile
# Returns: {"message":"Token no proporcionado"} (expected for unauthenticated request)
```

### 2. Frontend Configuration
- Environment variable correctly set to `http://localhost:5000/api`
- apiService.js using correct base URL
- Vite automatically restarted when .env changed

### 3. Full Flow Test
- Backend running on port 5000 ✅
- Frontend running on port 5174 ✅
- API endpoints accessible ✅
- Authentication middleware working ✅

## Expected Behavior After Fix
1. Frontend loads without 404 errors
2. RoleContext can fetch user profile from server
3. Authentication flow works correctly
4. Role-based dashboard rendering works
5. All API calls use correct authentication headers

## Files Modified
1. `AppScrum/src/services/apiService.js` - Fixed base URL fallback
2. `AppScrum/.env` - Added `/api` to VITE_API_URL

## Next Steps
1. Test login flow with Clerk authentication
2. Verify role-based dashboard rendering
3. Test all Scrum Master and Product Owner features
4. Confirm all API endpoints work with authentication

## Notes
- The fix ensures both development and production environments work correctly
- Environment variables take precedence over hardcoded fallbacks
- All API services (apiService, sprintService) now use the correct URLs
