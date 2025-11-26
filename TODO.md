# Implementation TODO

This document tracks implementation tasks identified during test development. These are features or fixes needed to make tests pass and ensure the application works correctly.

## Critical Implementation Tasks

### 1. Middleware Session Checking
**Status**: ⚠️ Needs Verification  
**File**: `application/src/middleware.ts`

**Issue**: The middleware is using `auth.api.getSession()` which may not be the correct Better Auth API for Next.js middleware.

**Tasks**:
- [ ] Verify the correct Better Auth API for server-side session checking in Next.js middleware
- [ ] Update middleware to use the proper Better Auth method (may need to use `auth.api.getSessionFromCtx()` or similar)
- [ ] Ensure middleware properly handles request headers and cookies
- [ ] Test middleware with actual Better Auth session tokens

**Test File**: `application/src/__tests__/middleware.test.ts`  
**Failing Tests**:
- `should allow access to public routes without login`
- `should allow access to login page without authentication`
- `should allow access to signup page without authentication`
- `should deny access to protected route when not logged in and redirect to login`

**Reference**: Better Auth documentation for Next.js middleware integration

---

### 2. PhotoUpload Component FileReader Handling
**Status**: ⚠️ Test Infrastructure Issue  
**File**: `application/src/components/settings/PhotoUpload.tsx`

**Issue**: Tests are failing because FileReader mocking doesn't properly simulate the async behavior of the real FileReader API.

**Tasks**:
- [ ] Review PhotoUpload component implementation to ensure it handles FileReader correctly
- [ ] Fix test FileReader mocks to properly simulate `onload` callback behavior
- [ ] Ensure file validation (type and size) works correctly in the component
- [ ] Verify upload button disabled state during upload

**Test File**: `application/src/__tests__/components/settings/PhotoUpload.test.tsx`  
**Failing Tests**:
- `should validate file type and reject non-image files`
- `should disable upload button while uploading`

**Note**: The component implementation appears correct; the issue is with test mocking. However, verify the component handles edge cases properly.

---

### 3. Home Page Auth State Rendering
**Status**: ⚠️ Test Timing Issue  
**File**: `application/src/app/page.tsx`

**Issue**: Tests are failing because auth state may not be immediately available when component renders.

**Tasks**:
- [ ] Verify home page properly handles `isPending` state from `authClient.useSession()`
- [ ] Ensure conditional rendering works correctly for logged in/out states
- [ ] Fix test to properly wait for auth state to resolve

**Test File**: `application/src/__tests__/pages/home.test.tsx`  
**Failing Test**:
- `should show sign in and sign up buttons when not logged in`

**Note**: Component implementation looks correct; may need to adjust test timing or ensure proper Provider wrapping.

---

### 4. Signup Page Form Validation
**Status**: ✅ Implementation Exists, Tests Need Fixing  
**File**: `application/src/app/signup/page.tsx`

**Issue**: Tests are failing, but the component already has validation logic. Need to verify tests are correctly testing the implementation.

**Tasks**:
- [ ] Verify signup form validation logic is working:
  - Password matching check (line 70-72)
  - Password length check (line 75-77)
  - Error display
- [ ] Fix tests to properly trigger form validation
- [ ] Ensure error messages are displayed correctly

**Test File**: `application/src/__tests__/pages/signup.test.tsx`  
**Failing Tests**:
- `should perform a sign up workflow with email/password and redirect`
- `should show error when passwords do not match`
- `should show error when password is too short`
- `should handle signup errors`

**Note**: Validation logic exists in the component. Tests may need to properly simulate form submission and validation.

---

## Test Infrastructure Improvements

### 5. Better Auth API Mocking
**Status**: ⚠️ Needs Improvement  
**Files**: All test files using `authClient`

**Issue**: Tests are mocking `authClient` but may not be using the correct Better Auth API structure.

**Tasks**:
- [ ] Review Better Auth client API structure
- [ ] Ensure mocks match the actual API (methods, return types, error handling)
- [ ] Create reusable mock utilities for Better Auth client
- [ ] Verify mock behavior matches real Better Auth behavior

**Affected Test Files**:
- `application/src/__tests__/pages/home.test.tsx`
- `application/src/__tests__/pages/login.test.tsx`
- `application/src/__tests__/pages/signup.test.tsx`
- `application/src/__tests__/pages/dashboard.test.tsx`
- `application/src/__tests__/pages/signout.test.tsx`

---

### 6. Test Helper Utilities
**Status**: ✅ Partially Complete  
**File**: `application/src/__tests__/utils/test-helpers.tsx`

**Tasks**:
- [x] Create `renderWithAuth` helper
- [x] Create `createMockSession` helper
- [x] Create `createMockRequest` helper
- [ ] Improve `createMockRequest` to handle NextRequest properly in test environment
- [ ] Add helper for mocking Better Auth API responses
- [ ] Add helper for simulating form submissions

---

## Verification Tasks

### 7. Verify Better Auth Integration
**Status**: ⚠️ Needs Verification

**Tasks**:
- [ ] Verify Better Auth is properly configured in `application/src/lib/auth.ts`
- [ ] Test actual signup flow end-to-end
- [ ] Test actual login flow end-to-end
- [ ] Test actual logout flow end-to-end
- [ ] Verify session persistence across page refreshes
- [ ] Test middleware protection with real sessions

---

### 8. Component Functionality Verification
**Status**: ⚠️ Needs Verification

**Tasks**:
- [ ] Manually test PhotoUpload component:
  - File type validation
  - File size validation
  - Preview generation
  - Upload functionality
  - Error handling
- [ ] Manually test signup page:
  - Form validation
  - Password matching
  - Error display
  - Success redirect
- [ ] Manually test login page:
  - Form validation
  - Error display
  - Success redirect
- [ ] Manually test home page:
  - Conditional rendering based on auth state
  - Button visibility
  - Sign out functionality

---

## Documentation Tasks

### 9. Update Documentation
**Status**: 📝 Pending

**Tasks**:
- [ ] Document Better Auth middleware integration approach
- [ ] Document test setup and mocking strategies
- [ ] Update ARCHITECTURE.md with middleware implementation details
- [ ] Add troubleshooting guide for common test failures

---

## Priority Order

1. **High Priority** (Blocks functionality):
   - Task #1: Middleware Session Checking
   - Task #4: Signup Page Form Validation (verify implementation)

2. **Medium Priority** (Test infrastructure):
   - Task #2: PhotoUpload Component FileReader Handling
   - Task #5: Better Auth API Mocking
   - Task #3: Home Page Auth State Rendering

3. **Low Priority** (Verification and documentation):
   - Task #7: Verify Better Auth Integration
   - Task #8: Component Functionality Verification
   - Task #9: Update Documentation

---

## Notes for Future Sessions

- The middleware implementation may need to use Better Auth's context-based session checking rather than direct API calls
- FileReader mocking in tests is complex due to async nature; consider using a test utility library or simplifying the component's FileReader usage
- Some test failures may be due to timing issues with React state updates; ensure proper use of `waitFor` and async handling
- Better Auth's API structure should be verified against actual package exports to ensure mocks are accurate

---

## Test Coverage Summary

**Current Status**: 52 passing, 11 failing (63 total tests)

**Passing Test Categories**:
- ✅ Provider component tests
- ✅ FormSection component tests
- ✅ Logger utility tests
- ✅ Dashboard page (when logged in)
- ✅ Home page (basic rendering, logged in state)
- ✅ PhotoUpload (basic functionality, size validation, error handling)

**Failing Test Categories**:
- ❌ Middleware route protection tests
- ❌ Signup page form validation tests
- ❌ Home page (logged out state)
- ❌ PhotoUpload (file type validation, upload button state)

---

*Last Updated: Based on test run results after implementing test suite*

