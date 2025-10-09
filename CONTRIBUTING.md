# Contributing Guidelines

## Code Standards

### TypeScript
- Use TypeScript for all new files
- Define interfaces for props and data structures
- Avoid `any` type

### Components
- Use functional components with hooks
- Keep components focused and reusable

### Naming Conventions
- Components/types/enums: PascalCase
- Variables/functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Booleans: is/has/should prefix (e.g., isLoading)
- Hooks/handlers: useX, handleX/onX
- Files: Components PascalCase.tsx; utils camelCase.ts; tests .test.ts(x)

### Git Workflow
- Create feature branches from `main`
- Use descriptive commit messages
- Submit PRs for all changes

### Code Quality
- Run `npm run lint` before committing
- Run `npm run typecheck` to catch TypeScript errors

## Pull Request Guide

### Before Opening a PR
1. **Test Your Changes**
   - Run `npm run dev` and verify features work as expected
   - Test with different user roles (student, leader, admin) if applicable

2. **Run Quality Checks**
   ```bash
   npm run typecheck  # Must pass
   npm run lint       # Must pass
   npm run build      # Must succeed
   ```

3. **Review Your Code**
   - Remove console.logs and debug code
   - Check for sensitive data (API keys, tokens)

### Creating the PR
1. **Title Format**
   - `Feature: [Brief description]` for new features
   - `Fix: [Brief description]` for bug fixes
   - `Refactor: [Brief description]` for code improvements
   - `Docs: [Brief description]` for documentation

2. **Description Should Include**
   - **What**: What does this PR do?
   - **Testing**: How did you test it?
   - **Screenshots**: (If UI changes) Before/After screenshots

### After PR is Merged
- Delete your feature branch
- Pull latest `main` before starting new work

## Getting Started
1. `npm install` - Install dependencies
2. `npm run dev` - Start development server