/**
 * Mock Authentication Service
 * Simulates backend authentication with realistic delays
 */

import { User } from '../constants/Types';
import { MOCK_USERS } from '../constants/MockData';
import { saveAuthToken, saveUser, removeAuthToken, removeUser, getAuthToken, getUser } from './storage.service';
import { delay, generateId } from '../utils/helpers';

/**
 * Mock user database (in-memory)
 * Pre-configured users for testing
 */
const MOCK_CREDENTIALS = {
  'admin@forensic.com': 'admin123',
  'user@forensic.com': 'user123',
};

/**
 * Login with email and password
 * @param email - User email
 * @param password - User password
 * @returns Promise resolving to user and token
 */
export const login = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Simulate network delay
  await delay(1500);

  // Find mock user
  const mockUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  // Check if user exists and password matches
  const expectedPassword = MOCK_CREDENTIALS[email.toLowerCase() as keyof typeof MOCK_CREDENTIALS];
  
  if (!expectedPassword || password !== expectedPassword) {
    throw new Error('Invalid email or password');
  }

  if (!mockUser) {
    throw new Error('User not found');
  }

  // Generate mock token
  const token = `mock_token_${Date.now()}_${generateId()}`;

  // Save to storage
  await saveAuthToken(token);
  await saveUser(mockUser);

  return {
    user: mockUser,
    token,
  };
};

/**
 * Sign up new user
 * @param email - User email
 * @param password - User password
 * @param firstName - User first name
 * @param lastName - User last name
 * @returns Promise resolving to new user and token
 */
export const signup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ user: User; token: string }> => {
  // Simulate network delay
  await delay(2000);

  // Check if email already exists
  const existingUser = MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase()
  );
  
  if (existingUser) {
    throw new Error('An account with this email already exists');
  }

  // Create new user
  const newUser: User = {
    id: `user-${generateId()}`,
    email: email.toLowerCase(),
    firstName,
    lastName,
    createdAt: new Date(),
  };

  // Generate mock token
  const token = `mock_token_${Date.now()}_${generateId()}`;

  // Save to storage
  await saveAuthToken(token);
  await saveUser(newUser);

  // Add to mock users (in-memory only)
  MOCK_USERS.push(newUser);

  return {
    user: newUser,
    token,
  };
};

/**
 * Logout user
 * Clears stored authentication data
 */
export const logout = async (): Promise<void> => {
  // Simulate network delay
  await delay(500);

  // Remove from storage
  await removeAuthToken();
  await removeUser();
};

/**
 * Get currently authenticated user
 * @returns Promise resolving to user or null
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check if token exists
    const token = await getAuthToken();
    if (!token) return null;

    // Get user from storage
    const user = await getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Verify authentication token
 * @returns Promise resolving to boolean
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    const user = await getUser();
    
    // Token is valid if both exist
    return !!(token && user);
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

/**
 * Refresh authentication token
 * @returns Promise resolving to new token
 */
export const refreshToken = async (): Promise<string> => {
  await delay(1000);
  
  const isValid = await verifyToken();
  if (!isValid) {
    throw new Error('Invalid session');
  }

  // Generate new token
  const newToken = `mock_token_${Date.now()}_${generateId()}`;
  await saveAuthToken(newToken);
  
  return newToken;
};
