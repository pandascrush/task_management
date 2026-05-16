export const RESP_MESSAGES = {
  USER: {
    CREATED: 'User created successfully',
    FETCHED: 'Users fetched successfully',
    NOT_FOUND: 'User not found',
    EMAIL_EXISTS: 'Email already exists',
  },
  TASK: {
    CREATED: 'Task created successfully',
    FETCHED: 'Tasks fetched successfully',
    NOT_FOUND: 'Task not found',
    UPDATED: 'Task updated successfully',
    ASSIGNED: 'Task assigned successfully',
    STATUS_UPDATED: 'Task status updated',
    UNAUTHORIZED: 'You can only update your own tasks',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Access denied',
    TOKEN_EXPIRED: 'Invalid or expired token',
  },
  COMMON: {
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation failed',
  }
};
