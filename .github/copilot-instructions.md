# AI Agent Instructions for AppScrum

This document provides essential guidance for AI agents working in the AppScrum codebase. It captures key architectural patterns, workflows, and conventions specific to this project.

## Architecture Overview

### Frontend (React + Vite)
- Located in `/AppScrum/src/`
- Component organization:
  - `components/` - Role-based components (auth/, developers/, ProductOwner/, ScrumMaster/)
  - `Pages/` - Main route components
  - `hooks/` - Custom hooks for domain logic (e.g., `useScrumMaster.js`, `useSprintBoard.js`)
  - `services/` - API communication layer

Key Pattern: Use role-based component organization and custom hooks for domain logic.

### Backend (Node.js + Express)
- Located in `/backend/`
- RESTful API with role-based authorization
- Models follow MongoDB schema patterns with middleware hooks
- Services contain core business logic
- Routes handle request validation and service coordination

## Authentication & Authorization

- Uses Clerk for authentication (`clerk_id` in User model)
- Role-based access control with 5 roles:
  ```javascript
  enum: ['super_admin', 'product_owner', 'scrum_master', 'developers', 'user']
  ```
- Token management through `apiService.js`

## Development Workflow

### Setup
```bash
# Frontend
cd AppScrum
npm install
npm run dev  # Runs on http://localhost:5173

# Backend
cd backend
npm install
npm start    # Runs on http://localhost:5000
```

### Key Integration Points
1. API Service (`src/services/apiService.js`) - Central point for backend communication
2. Role Context (`src/context/RoleContext.jsx`) - Manages user roles and permissions
3. User Model (`backend/models/User.js`) - Core user data structure

## Project-Specific Patterns

1. **API Error Handling**
   - All API calls use centralized error handling in `apiService.js`
   - Consistent error structure across endpoints

2. **Role-Based Component Structure**
   - Components are organized by user role
   - Each role has its dedicated dashboard and features

3. **MongoDB Schema Patterns**
   - Use timestamps (`updated_at`) via middleware
   - Soft deletion pattern with `is_active` flag
   - Required fields explicitly marked

## Common Tasks

1. **Adding New API Endpoints**
   - Add route in `backend/routes/`
   - Create/update service in `backend/services/`
   - Add validation if needed in `backend/middleware/validation/`

2. **Creating New Frontend Features**
   - Place components in appropriate role-based directory
   - Use existing hooks pattern for data management
   - Follow role-based access control patterns

## Important Files to Reference

- `/backend/models/` - Database schema definitions
- `/src/components/auth/` - Authentication flow examples
- `/src/hooks/` - Domain logic patterns
- `/backend/middleware/authenticate.js` - Authorization patterns

Remember to check environment variables in both frontend and backend before development.
