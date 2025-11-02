/**
 * AsyncStorage Service
 * Wrapper for AsyncStorage operations with typed data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Report } from '../constants/Types';

// Storage Keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'forensic_auth_token',
  USER: 'forensic_user',
  REPORTS: 'forensic_reports',
  SETTINGS: 'forensic_settings',
} as const;

/**
 * Save authentication token
 * @param token - JWT-like token string
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw new Error('Failed to save authentication');
  }
};

/**
 * Get authentication token
 * @returns Token string or null
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Remove authentication token
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

/**
 * Save user data
 * @param user - User object
 */
export const saveUser = async (user: User): Promise<void> => {
  try {
    const userJson = JSON.stringify(user);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, userJson);
  } catch (error) {
    console.error('Error saving user:', error);
    throw new Error('Failed to save user data');
  }
};

/**
 * Get user data
 * @returns User object or null
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    // Convert createdAt string back to Date
    if (user.createdAt) {
      user.createdAt = new Date(user.createdAt);
    }
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Remove user data
 */
export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

/**
 * Save all reports
 * @param reports - Array of reports
 */
export const saveReports = async (reports: Report[]): Promise<void> => {
  try {
    const reportsJson = JSON.stringify(reports);
    await AsyncStorage.setItem(STORAGE_KEYS.REPORTS, reportsJson);
  } catch (error) {
    console.error('Error saving reports:', error);
    throw new Error('Failed to save reports');
  }
};

/**
 * Get all reports
 * @returns Array of reports
 */
export const getReports = async (): Promise<Report[]> => {
  try {
    const reportsJson = await AsyncStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!reportsJson) return [];
    
    const reports = JSON.parse(reportsJson);
    // Convert date strings back to Date objects
    return reports.map((report: any) => ({
      ...report,
      timestamp: new Date(report.timestamp),
      images: report.images.map((img: any) => ({
        ...img,
        uploadedAt: new Date(img.uploadedAt),
      })),
      chatHistory: report.chatHistory.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Error getting reports:', error);
    return [];
  }
};

/**
 * Save single report (append to existing reports)
 * @param report - Report to save
 */
export const saveReport = async (report: Report): Promise<void> => {
  try {
    const existingReports = await getReports();
    const updatedReports = [report, ...existingReports];
    await saveReports(updatedReports);
  } catch (error) {
    console.error('Error saving report:', error);
    throw new Error('Failed to save report');
  }
};

/**
 * Delete report by ID
 * @param reportId - ID of report to delete
 */
export const deleteReport = async (reportId: string): Promise<void> => {
  try {
    const existingReports = await getReports();
    const filteredReports = existingReports.filter(r => r.id !== reportId);
    await saveReports(filteredReports);
  } catch (error) {
    console.error('Error deleting report:', error);
    throw new Error('Failed to delete report');
  }
};

/**
 * Update existing report
 * @param reportId - ID of report to update
 * @param updates - Partial report data to update
 */
export const updateReport = async (
  reportId: string,
  updates: Partial<Report>
): Promise<void> => {
  try {
    const existingReports = await getReports();
    const updatedReports = existingReports.map(r =>
      r.id === reportId ? { ...r, ...updates } : r
    );
    await saveReports(updatedReports);
  } catch (error) {
    console.error('Error updating report:', error);
    throw new Error('Failed to update report');
  }
};

/**
 * Clear all stored data
 */
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.REPORTS,
      STORAGE_KEYS.SETTINGS,
    ]);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw new Error('Failed to clear data');
  }
};

/**
 * Save app settings
 * @param settings - Settings object
 */
export const saveSettings = async (settings: any): Promise<void> => {
  try {
    const settingsJson = JSON.stringify(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, settingsJson);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error('Failed to save settings');
  }
};

/**
 * Get app settings
 * @returns Settings object
 */
export const getSettings = async (): Promise<any> => {
  try {
    const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!settingsJson) return {};
    return JSON.parse(settingsJson);
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
};
