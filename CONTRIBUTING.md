# Contributing Guidelines

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required API keys and credentials

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### File Organization
- Use lowercase with hyphens for file names (e.g., `user-profile.jsx`)
- Place reusable components in `/components`
- Place page-specific components in `app/(group)/page/_components`
- Keep server actions in `/actions`
- Put utilities in `/lib`

### Component Guidelines
- Use functional components with hooks
- Keep components small and focused
- Extract complex logic into custom hooks
- Use proper TypeScript/JSDoc comments for complex functions

### State Management
- Use React hooks (useState, useEffect, etc.)
- Keep server and client components separate
- Use Server Actions for data mutations

### API Routes
- Follow RESTful conventions
- Always handle errors properly
- Return appropriate HTTP status codes
- Validate input data

## Testing
- Test all critical user flows
- Test API endpoints with various inputs
- Ensure mobile responsiveness

## Git Workflow
1. Create feature branches from `main`
2. Use descriptive commit messages
3. Keep commits focused and atomic
4. Open pull requests for review

## Before Committing
- [ ] Run `npm run lint` to check for linting errors
- [ ] Test your changes locally
- [ ] Remove console.logs from production code
- [ ] Update documentation if needed
